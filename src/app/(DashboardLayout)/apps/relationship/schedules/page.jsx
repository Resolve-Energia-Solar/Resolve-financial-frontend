'use client';
import { useState, useEffect, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
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
  Typography
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';
import ScheduleStatusChip from '@/app/components/apps/inspections/schedule/StatusChip';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';

import { FilterContext } from '@/context/FilterContext';
import scheduleService from '@/services/scheduleService';
import serviceCatalogService from '@/services/serviceCatalogService';
import { formatDate } from '@/utils/dateUtils';
import DetailsDrawer from '@/app/components/apps/schedule/DetailsDrawer';
import UserCard from '@/app/components/apps/users/userCard';
import ScheduleOpinionChip from '@/app/components/apps/inspections/schedule/StatusChip/ScheduleOpinionChip';
import { Table } from '@/app/components/Table';
import { TableHeader } from "@/app/components/TableHeader";
import filterConfig from './filterConfig';
import { useSnackbar } from 'notistack';
import { Add } from '@mui/icons-material';

const BCrumb = [{ to: '/', title: 'Início' }, { title: 'Agendamentos do Pós-Venda' }];

const CustomerServiceSchedules = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);
  const activeCount = Object.keys(filters || {}).filter(key => {
    const v = filters[key];
    return v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0);
  }).length;
  const [loading, setLoading] = useState(true);
  const [scheduleList, setScheduleList] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [orderDirection, setOrderDirection] = useState('asc');
  const userPermissions = useSelector((state) => state.user.permissions);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [ordering, setOrdering] = useState('-created_at');

  useEffect(() => {
    serviceCatalogService
      .index({ fields: 'id,name', limit: 100, category__in: 11 })
      .then((data) => {
        const list = data.results || [];
        setServices(list);
        if (list.length > 0) {
          setSelectedServices(list.map((s) => s.id));
        }
      })
      .catch((err) => { enqueueSnackbar('Erro ao buscar tipos de serviços'); console.error('Erro ao buscar tipos de serviços:', err) });
  }, []);

  useEffect(() => {
    if (selectedServices.length === 0) return;
    setLoading(true);
    scheduleService
      .index({
        page,
        limit: rowsPerPage,
        expand: ['customer', 'service_opinion', 'final_service_opinion', 'address', 'service', 'project'],
        service__in: selectedServices.join(','),
        fields: [
          'id',
          'protocol',
          'service.name',
          'service_opinion.name',
          'final_service_opinion.name',
          'schedule_agent',
          'project.project_number',
          'customer.complete_name',
          'schedule_date',
          'schedule_start_time',
          'address.complete_address',
        ],
        ordering,
        ...filters,
      })
      .then((data) => {
        setScheduleList(data.results);
        setTotalRows(data.meta.pagination.total_count);
      })
      .catch((err) => {
        console.error('Erro:', err);
        enqueueSnackbar('Erro ao buscar agendamentos', { variant: 'error' });
      })
      .finally(() => setLoading(false));
  }, [selectedServices, page, rowsPerPage, ordering, filters, refresh]);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const columns = [
    {
      field: 'protocol',
      headerName: 'Protocolo',
      render: r => r.protocol || 'Sem Protocolo'
    },
    {
      field: 'service.name',
      headerName: 'Serviço',
      render: r => r.service.name,
      sx: { minWidth: 230 },
    },
    {
      field: 'project.project_number,customer.complete_name',
      headerName: 'Projeto',
      render: r => `${r.project.project_number} - ${r.customer.complete_name}`,
      sx: { minWidth: 350 },
    },
    {
      field: 'schedule_date,schedule_start_time',
      headerName: 'Data e Hora',
      render: r => {
        const date = formatDate(r.schedule_date, 'DD/MM/YYYY');
        const time = r.schedule_start_time ? r.schedule_start_time.slice(0, 5) : '';
        return `${date} ${time}`;
      },
      sortable: true,
      sx: { minWidth: 180 },
    },

    {
      field: 'schedule_agent',
      headerName: 'Agente',
      render: r => {
        const agent = r.schedule_agent;
        return agent ? <UserCard userId={agent} /> : "Sem agente";
      },
      sx: { minWidth: 380 },
    },
    {
      field: 'service_opinion',
      headerName: 'Parecer Inicial',
      render: r => <ScheduleOpinionChip status={r.service_opinion?.name} />,
      sortable: true,
      sx: { minWidth: 150 },
    },
    {
      field: 'final_service_opinion',
      headerName: 'Parecer Final',
      render: r => <ScheduleOpinionChip status={r.final_service_opinion?.name} />,
      sortable: true,
      sx: { minWidth: 150 },
    },
    {
      field: 'address.complete_address',
      headerName: 'Endereço',
      render: r => r.address?.complete_address || 'Sem endereço',
      sx: { minWidth: 480 },
    }
  ];

  return (
    <PageContainer title="Agendamentos do Pós-Venda" description="Listagem de Agendamentos do Pós-Venda">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <Typography variant="h5" gutterBottom alignContent={'center'}>
            Lista de Agendamentos do Pós-Venda
          </Typography>
          <Grid container alignItems="center" justifyContent={'space-between'} my={2}>
            <Grid item xs={10}>
              <FormControl fullWidth>
                <InputLabel id="services-select-label">Serviços</InputLabel>
                <Select
                  labelId="services-select-label"
                  id="services-select"
                  multiple
                  value={selectedServices}
                  onChange={(e) => {
                    setSelectedServices(e.target.value);
                    setPage(1);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const service = services.find((s) => s.id === value);
                        return <Chip key={value} label={service ? service.name : value} />;
                      })}
                    </Box>
                  )}
                  label="Serviços"
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid container xs={2} justifyContent="flex-end" alignItems="center">
              {activeCount > 0 && (
                <Chip
                  label={`${activeCount} filtro${activeCount > 1 ? 's' : ''} ativo${activeCount > 1 ? 's' : ''}`}
                  onDelete={clearFilters}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
              )}
              <Button variant="outlined" onClick={() => setFilterDrawerOpen(true)}>
                Abrir Filtros
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
              objNameNumberReference={totalRows === 1 ? "Agendamento" : "Agendamentos"}
            />
            <TableHeader.Button
              buttonLabel="Agendar"
              icon={<Add />}
              onButtonClick={() => { window.location.href = '/apps/relationship/schedules/create' }}
              sx={{
                width: 200,
              }}
            />
          </TableHeader.Root>

          <Table.Root
            data={scheduleList}
            totalRows={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={(schedule) => {
              setSelectedScheduleId(schedule.id);
              setDetailsDrawerOpen(true);
            }}
          >
            <Table.Head columns={columns}>
            </Table.Head>
            <Table.Body
              loading={loading}
              columns={columns.length}
            >
              {columns.map(col => (
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
        onApply={(newFilters) => setFilters(newFilters)}
      />
      <DetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        scheduleId={selectedScheduleId}
      />
    </PageContainer >
  );
};

export default CustomerServiceSchedules;
