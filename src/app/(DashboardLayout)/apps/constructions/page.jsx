'use client';
import { useState, useEffect, useCallback, useContext } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import projectService from '@/services/projectService';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';
import StatusChip from '@/utils/status/DocumentStatusIcon';
import {
  AssignmentTurnedIn,
  BuildCircle,
  Cancel,
  FilterAlt,
  HourglassBottom,
  Pending,
  PendingActions,
  Person,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { Chip, Box, Typography, Skeleton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { formatDate } from '@/utils/dateUtils';
import ScheduleOpinionChip from '@/app/components/apps/inspections/schedule/StatusChip/ScheduleOpinionChip';
import { FilterContext } from '@/context/FilterContext';
import { IconBuilding, IconTools, IconUserBolt } from '@tabler/icons-react';

const CONSTRUCTION_STATUS_MAP = {
  P: { label: 'Pendente', color: 'default', icon: <HourglassEmptyIcon /> },
  F: { label: 'Finalizada', color: 'success', icon: <CheckCircleIcon /> },
  C: { label: 'Cancelada', color: 'error', icon: <Cancel /> },
  EA: { label: 'Em Andamento', color: 'warning', icon: <HourglassBottom /> },
};

const WORK_RESPONSIBILITY_MAP = {
  C: { label: 'Cliente', color: 'success', icon: <Person /> },
  F: { label: 'Franquia', color: 'primary', icon: <IconUserBolt /> },
  O: { label: 'Centro de Operações', color: 'warning', icon: <IconBuilding /> },
};


const ConstructionsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [indicators, setIndicators] = useState({
    purchase_status: {},
    delivery_status: {},
    total_count: 0,
  });
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const stats = [
    {
      key: 'pending',
      label: 'Pendente',
      value: indicators.total_pending,
      icon: <PendingActions />,
      color: '#fff3cd',
      filter: { inspection_is_pending: false },
    },
    {
      key: 'scheduled_construction',
      label: 'Obra agendada',
      value: indicators.scheduled_construction,
      icon: <AssignmentTurnedIn />,
      color: '#d1ecf1',
      filter: { construction_scheduled: false },
    },
    {
      key: 'in_progress',
      label: 'Em Andamento',
      value: indicators.in_progress,
      icon: <HourglassBottom />,
      color: '#d1ecf1',
      filter: { inspection_in_progress: true },
    },
    {
      key: 'finished',
      label: 'Finalizado',
      value: indicators.total_finished,
      icon: <CheckCircleIcon />,
      color: '#d4edda',
      filter: { inspection_is_finished: true },
    },
    {
      key: 'with_construction',
      label: 'Vistoria com obra',
      value: indicators.with_construction,
      icon: <BuildCircle />,
      color: '#e2e3e5',
      filter: { has_construction: true },
    },
    {
      key: 'with_construction_shade',
      label: 'Vistoria com obra e sombreamento',
      value: indicators.with_construction_and_shade,
      icon: <IconTools />,
      color: '#e2e3e5',
      filter: { has_construction: true, has_shade: true },
    },
    {
      key: 'cancelled',
      label: 'Cancelado',
      value: indicators.cancelled,
      icon: <Cancel />,
      color: '#f8d7da',
      filter: { inspection_is_cancelled: true },
    },
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({
        fields:
          'id,project_number,sale.customer.complete_name,sale.signature_date,sale.status,sale.treadmill_counter,sale.branch.name,inspection.status,inspection.service_opinion,inspection.schedule_date,inspection.final_service_opinion.name,inspection.final_service_opinion_date,inspection.final_service_opinion_user,civil_construction.work_responsibility,civil_construction.status,civil_construction.is_customer_aware,civil_construction.deadline',
        expand:
          'sale,sale.customer,sale.branch,inspection,inspection.final_service_opinion,inspection.final_service_opinion_date,inspection,civil_construction',
        in_construction: true,
        metrics: 'in_construction',
        page: page + 1,
        limit: rowsPerPage,
        remove_termination_cancelled_and_pre_sale: true,
        ...filters,
      });
      setProjects(response.results);
      setTotalRows(response.meta.pagination.total_count);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar Projetos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters, enqueueSnackbar]);

  const fetchIndicators = useCallback(async () => {
    setLoadingIndicators(true);
    try {
      const { indicators } = await projectService.inspectionsIndicators({
        remove_termination_cancelled_and_pre_sale: true,
        ...filters,
      });
      setIndicators(indicators);
    } catch {
      enqueueSnackbar('Erro ao carregar indicadores', { variant: 'error' });
    } finally {
      setLoadingIndicators(false);
    }
  }, [enqueueSnackbar, filters]);

  useEffect(() => {
    fetchProjects();
    fetchIndicators();
  }, [fetchProjects, fetchIndicators, refresh, filters]);

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Obras' }];

  const columns = [
    {
      field: 'project',
      headerName: 'Projeto',
      render: (r) => `${r.project_number} - ${r.sale?.customer?.complete_name}` || 'SEM NÚMERO',
      sx: { opacity: 0.7 },
    },
    {
      field: 'inspection.final_service_opinion.name',
      headerName: 'Parecer da vistoria',
      render: (r) =>  <Chip label={r.inspection?.final_service_opinion?.name || '-'}  />,
    },
    {
      field: 'civil_constructions.work_responsibility',
      headerName: 'Responsabilidade da obra',
      render: (r) =>
        r.civil_construction[0]?.work_responsibility ? (
          <Chip
            label={WORK_RESPONSIBILITY_MAP[r.civil_construction[0]?.work_responsibility].label}
            color={WORK_RESPONSIBILITY_MAP[r.civil_construction[0]?.work_responsibility].color}
            icon={WORK_RESPONSIBILITY_MAP[r.civil_construction[0]?.work_responsibility].icon}
          />
        ) : (
          ' - '
        ),
    },
    {
      field: 'ciivil_construction.is_customer_aware',
      headerName: 'Cliente ciente',
      render: (r) => (
        <Chip
          label={r.civil_construction[0]?.is_customer_aware ? 'Sim' : 'Não'}
          color={r.civil_construction[0]?.is_customer_aware ? 'success' : 'error'}
          icon={
            r.civil_construction[0]?.is_customer_aware ? (
              <CheckCircleIcon />
            ) : (
              <Cancel sx={{ color: 'error.main' }} />
            )
          }
        />
      ),
    },
    {
      field: 'civil_construction.deadline',
      headerName: 'Prazo',
      render: (r) => formatDate(r?.civil_construction[0]?.deadline),
    },
    {
      field: 'civil_construction.status',
      headerName: 'Status da obra',
      render: (r) =>
        r.civil_construction[0]?.status ? (
          <Chip
            label={CONSTRUCTION_STATUS_MAP[r.civil_construction[0]?.status].label}
            color={CONSTRUCTION_STATUS_MAP[r.civil_construction[0]?.status].color}
            icon={CONSTRUCTION_STATUS_MAP[r.civil_construction[0].status].icon}
          />
        ) : (
          <Chip label="Sem Obra" color="default"/>
        ),
    },
  ];

  const handleKPIClick = (kpiType) => {
    const kpiFilter = stats.find((stat) => stat.key === kpiType)?.filter;

    if (kpiFilter && Object.keys(kpiFilter).length > 0) {
      clearFilters();
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...kpiFilter,
      }));
    } else {
      clearFilters();
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row.id);
    setOpenDrawer(true);
  };

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target?.value, 10));
    setPage(0);
  }, []);

  return (
    <PageContainer title={'Obras'} description={'Dashboard de Obras'}>
      <Breadcrumb items={BCrumb} />

      {/* Indicadores */}
      {/* <Box sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6">Indicadores</Typography>
        {loadingIndicators ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-evenly',
              gap: 2,
              flexWrap: 'wrap',
              mt: 1,
              mb: 4,
              background: '#f5f5f5',
              p: 2,
            }}
          >
            {Array.from({ length: stats.length }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={120}
                sx={{
                  flex: '1 1 150px',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.300',
                  borderRadius: 1,
                  maxWidth: '200px',
                  aspectRatio: '4 / 2.5',
                  textAlign: 'center',
                  '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' },
                }}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-evenly',
              gap: 2,
              flexWrap: 'wrap',
              mt: 1,
              mb: 4,
              background: '#f5f5f5',
              p: 2,
            }}
          >
            {stats.map(({ key, label, value, icon, color, filter, format }) => {
              const isActive =
                filters && Object.keys(filters).some((filterKey) => filterKey in filter);
              return (
                <Box
                  key={key}
                  sx={{
                    flex: '1 1 150px',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: color,
                    borderRadius: 1,
                    maxWidth: '200px',
                    aspectRatio: '4 / 2.5',
                    textAlign: 'center',
                    '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' },
                    border: isActive ? '2px solid green' : 'none',
                  }}
                  onClick={() => handleKPIClick(key)}
                >
                  {icon}
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    {label}
                  </Typography>
                  <Typography variant="h6">{format ? format(value) : value}</Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box> */}

      {/* Filtros */}
      <GenericFilterDrawer
        filters={filterConfig}
        initialValues={filters}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />

      {/* Tabela de Projetos */}
      <TableHeader.Root>
        <TableHeader.Title
          title="Total"
          totalItems={totalRows}
          objNameNumberReference={totalRows === 1 ? 'Projeto' : 'Projetos'}
          loading={loading}
        />
        <TableHeader.Button
          buttonLabel="Filtros"
          icon={<FilterAlt />}
          onButtonClick={() => {
            setFilterDrawerOpen(true);
          }}
          sx={{ width: 200, marginLeft: 2 }}
        />
      </TableHeader.Root>

      <Table.Root
        data={projects}
        totalRows={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={handleRowClick}
        onClose={() => {
          setOpenDrawer(false);
          setSelectedRow(null);
        }}
        noWrap={true}
      >
        <Table.Head>
          {columns.map((c) => (
            <Table.Cell key={c.field} sx={{ fontWeight: 600, fontSize: '14px' }}>
              {c.headerName}
            </Table.Cell>
          ))}
        </Table.Head>

        <Table.Body
          loading={loading}
          onRowClick={handleRowClick}
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' } }}
        >
          {columns.map((col) => (
            <Table.Cell key={col.field} render={col.render} sx={col.sx} />
          ))}
        </Table.Body>
        <Table.Pagination />
      </Table.Root>
      <ProjectDetailDrawer
        projectId={selectedRow}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      />
    </PageContainer>
  );
};

export default ConstructionsDashboard;
