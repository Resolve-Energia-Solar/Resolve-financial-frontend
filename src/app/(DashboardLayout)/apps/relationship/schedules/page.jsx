'use client';
import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ArrowDropUp,
  ArrowRightOutlined,
  ArrowDropDown,
  Add,
  FilterAlt,
} from '@mui/icons-material';

import { FilterContext } from '@/context/FilterContext';
import scheduleService from '@/services/scheduleService';
import serviceCatalogService from '@/services/serviceCatalogService';
import { formatDate } from '@/utils/dateUtils';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import BlankCard from '@/app/components/shared/BlankCard';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import RelationshipScheduleDetail from '@/app/components/apps/relationship/schedules/RelationshipScheduleDetail';
import UserCard from '@/app/components/apps/users/userCard';
import ScheduleOpinionChip from '@/app/components/apps/inspections/schedule/StatusChip/ScheduleOpinionChip';
import { TableHeader } from '@/app/components/TableHeader';
import { Table } from '@/app/components/Table';
import filterConfig from './filterConfig';

const BCrumb = [{ to: '/', title: 'Início' }, { title: 'Agendamentos do Pós-Venda' }];

export default function CustomerServiceSchedules() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [ordering, setOrdering] = useState('-created_at');
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const STORAGE_KEY = 'relationship-schedules-selected-services';

  // Função para salvar serviços selecionados no localStorage
  const saveSelectedServices = useCallback((services) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch (error) {
      console.warn('Erro ao salvar serviços selecionados no localStorage:', error);
    }
  }, []);

  // Função para recuperar serviços selecionados do localStorage
  const loadSelectedServices = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Erro ao carregar serviços selecionados do localStorage:', error);
      return [];
    }
  }, []);

  const activeCount = useMemo(
    () =>
      Object.values(filters || {}).filter((v) => v != null && !(Array.isArray(v) && v.length === 0))
        .length,
    [filters],
  );

  useEffect(() => {
    let alive = true;
    serviceCatalogService
      .index({ fields: 'id,name', limit: 100, category__in: 11 })
      .then(({ results = [] }) => {
        if (!alive) return;
        setServices(results);

        // Carregar serviços selecionados do localStorage
        const savedSelectedServices = loadSelectedServices();
        
        // Se há serviços salvos, usar apenas os que ainda existem
        if (savedSelectedServices.length > 0) {
          const validSavedServices = savedSelectedServices.filter((savedId) =>
            results.some((service) => service.id === savedId),
          );

          if (validSavedServices.length > 0) {
            setSelectedServices(validSavedServices);
          } else {
            // Se nenhum serviço salvo é válido, selecionar todos
            setSelectedServices(results.map((s) => s.id));
          }
        } else {
          // Se não há serviços salvos, selecionar todos
          setSelectedServices(results.map((s) => s.id));
        }
      })
      .catch(() => enqueueSnackbar('Erro ao buscar tipos de serviços', { variant: 'error' }));
    return () => {
      alive = false;
    };
  }, [enqueueSnackbar, loadSelectedServices]);

  useEffect(() => {
    if (!selectedServices.length) return;
    let alive = true;
    setLoading(true);
    scheduleService
      .index({
        page,
        limit: rowsPerPage,
        ordering,
        service__in: selectedServices.join(','),
        expand: [
          'customer',
          'service',
          'address',
          'service_opinion',
          'final_service_opinion',
          'project',
          'project.sale.branch',
          'schedule_agent.phone_numbers',
        ],
        fields: "id,protocol,severity,schedule_agent.profile_picture,schedule_agent.complete_name,schedule_agent.phone_numbers,project.project_number,customer.complete_name,schedule_date,schedule_start_time,address.complete_address,service.name,service_opinion.name,final_service_opinion.name,project.sale.branch.name",
        ...filters,
      })
      .then((data) => {
        if (!alive) return;
        setScheduleList(data.results);
        setTotalRows(data.meta.pagination.total_count);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar('Erro ao buscar agendamentos', { variant: 'error' });
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [selectedServices, page, rowsPerPage, ordering, filters, refresh, enqueueSnackbar]);

  const handlePageChange = useCallback((_, newPage) => setPage(newPage), []);
  const handleRowsChange = useCallback((e) => setRowsPerPage(+e.target.value), []);
  const handleSort = useCallback((f) => {
    setPage(1);
    setOrdering((prev) => (prev === f ? `-${f}` : f));
  }, []);
  const goToAdd = useCallback(() => router.push('/apps/relationship/schedules/add'), [router]);

  const columns = useMemo(
    () => [
      {
        field: 'protocol',
        headerName: 'Protocolo',
        render: ({ protocol }) => protocol || 'Sem Protocolo',
      },
      {
        field: 'service.name',
        headerName: 'Serviço',
        render: ({ service }) => service.name,
        sx: { minWidth: 230 },
      },
      {
        field: 'project.project_number,customer.complete_name',
        headerName: 'Projeto',
        render: (r) => `${r.project?.project_number} - ${r.customer.complete_name}`,
        sx: { minWidth: 350 },
      },
      {
        field: 'project.sale.branch.name',
        headerName: 'Unidade',
        render: ({ project }) => project?.sale?.branch?.name || 'Sem unidade',
        sx: { minWidth: 200 },
      },
      {
        field: 'schedule_date',
        headerName: 'Data e Hora',
        sortable: true,
        render: ({ schedule_date, schedule_start_time }) => {
          const d = formatDate(schedule_date, 'DD/MM/YYYY');
          const t = schedule_start_time?.slice(0, 5) || '';
          return `${d} ${t}`;
        },
        sx: { minWidth: 180 },
      },
      {
        field: 'severity',
        headerName: 'Prioridade',
        sortable: true,
        render: ({ severity }) => {
          if (!severity) return '-';
          const icons = {
            C: <ArrowDropUp color="error" />,
            B: <ArrowRightOutlined color="warning" />,
            A: <ArrowDropDown color="success" />,
          };
          const labels = { C: 'Alta (C)', B: 'Média (B)', A: 'Baixa (A)' };
          const colors = { C: 'error.main', B: 'warning.main', A: 'success.main' };
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {icons[severity]}
              <Typography variant="body2" color={colors[severity]}>
                {labels[severity]}
              </Typography>
            </Box>
          );
        },
        sx: { minWidth: 110 },
      },
      {
        field: 'schedule_agent',
        headerName: 'Agente',
        sx: { minWidth: 380 },
        render: ({ schedule_agent }) =>
          schedule_agent ? (
            <UserCard userData={schedule_agent} showPhone={true} showEmail={false} />
          ) : (
            'Sem agente'
          ),
      },
      {
        field: 'service_opinion',
        headerName: 'Parecer Inicial',
        sortable: true,
        render: ({ service_opinion }) => <ScheduleOpinionChip status={service_opinion?.name} />,
      },
      {
        field: 'final_service_opinion',
        headerName: 'Parecer Final',
        sortable: true,
        render: ({ final_service_opinion }) => (
          <ScheduleOpinionChip status={final_service_opinion?.name} />
        ),
      },
      {
        field: 'address',
        headerName: 'Endereço',
        sx: { minWidth: 480 },
        render: ({ address }) => address?.complete_address || 'Sem endereço',
      },
    ],
    [],
  );

  return (
    <PageContainer title="Agendamentos do Pós-Venda">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Lista de Agendamentos
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <FormControl fullWidth>
                <InputLabel>Serviços</InputLabel>
                <Select
                  multiple
                  value={selectedServices}
                  onChange={(e) => {
                    const newSelectedServices = e.target.value;
                    setSelectedServices(newSelectedServices);
                    setPage(1);
                    saveSelectedServices(newSelectedServices);
                  }}
                  renderValue={(vals) => (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {vals.map((id) => (
                        <Chip key={id} label={services.find((s) => s.id === id)?.name || id} />
                      ))}
                    </Box>
                  )}
                >
                  {services.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2} container justifyContent="flex-end">
              {activeCount > 0 && (
                <Chip
                  label={`${activeCount} filtro${activeCount > 1 ? 's' : ''} ativo${
                    activeCount > 1 ? 's' : ''
                  }`}
                  onDelete={clearFilters}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
              )}
              <Button
                onClick={() => setFilterDrawerOpen(true)}
                startIcon={<FilterAlt />}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.getContrastText(theme.palette.primary.main),
                }}
              >
                Filtros
              </Button>
            </Grid>
          </Grid>

          <TableHeader.Root
            onRowClick={(row) => {
              setSelectedScheduleId(row.id);
              setDetailsDrawerOpen(true);
            }}
          >
            <TableHeader.Title
              title="Total"
              totalItems={totalRows}
              objNameNumberReference={totalRows === 1 ? 'Agendamento' : 'Agendamentos'}
            />
            <TableHeader.Button
              buttonLabel="Agendar"
              icon={<Add />}
              onButtonClick={goToAdd}
              sx={{ width: 200 }}
            />
          </TableHeader.Root>

          <Table.Root
            data={scheduleList}
            totalRows={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            onRowClick={(row) => {
              setSelectedScheduleId(row.id);
              setDetailsDrawerOpen(true);
            }}
          >
            <Table.Head columns={columns} onSort={handleSort} />
            <Table.Body loading={loading} columns={columns.length}>
              {columns.map((col) => (
                <Table.Cell
                  key={col.field}
                  render={col.render}
                  sx={{ cursor: 'pointer', ...col.sx }}
                />
              ))}
            </Table.Body>
            <Table.Pagination />
          </Table.Root>
        </CardContent>
      </BlankCard>

      <GenericFilterDrawer
        filters={filterConfig}
        initialValues={filters}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={setFilters}
      />

      <RelationshipScheduleDetail
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        scheduleId={selectedScheduleId}
      />
    </PageContainer>
  );
}
