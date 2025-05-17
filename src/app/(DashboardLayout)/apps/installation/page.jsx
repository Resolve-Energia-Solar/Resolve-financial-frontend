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
  AssignmentTurnedIn, BuildCircle, FilterAlt, HourglassTop, PendingActions, LockOpen, Lock,
  Cancel,
  ConstructionRounded,
  CheckCircle
} from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { Chip, Box, Typography } from '@mui/material';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { formatDate } from '@/utils/dateUtils';
import { FilterContext } from '@/context/FilterContext';
import { KPICard } from '@/app/components/charts/KPICard';

const InspectionsDashboard = () => {
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

  const formatHours = (hours) => {
    if (typeof hours !== 'number' || isNaN(hours)) return '-';
    if (hours >= 24) {
      const days = (hours / 24).toFixed(1);
      return `${days} dias`;
    }
    if (hours >= 1) {
      return `${hours} horas`;
    }
    return `-`;
  };

  const stats = [
    {
      key: 'avg_time_installation_hours',
      label: 'Tempo médio de instalação',
      value: indicators?.avg_time_installation_hours,
      icon: <BuildCircle style={{ color: '#155724' }} />,
      color: '#d4edda',
      filter: { inspection_is_finished: true },
      format: formatHours,
    },
    {
      key: 'released_clients_count',
      label: 'Liberados para instalação',
      value: indicators?.released_clients_count,
      icon: <AssignmentTurnedIn style={{ color: '#155724' }} />,
      color: '#d4edda',
      filter: { inspection_is_finished: true },
      format: formatHours,
    },
    {
      key: 'avg_contract_time',
      label: 'Tempo médio em contratos',
      value: indicators?.avg_contract_time || '-',
      icon: <HourglassTop style={{ color: '#856404' }} />,
      color: '#fff3cd',
      filter: { inspection_is_pending: true },
    },
    {
      key: 'number_of_installations',
      label: 'Número de instalações finalizadas',
      value: indicators?.number_of_installations,
      icon: <CheckCircle style={{ color: '#155724' }} />,
      color: '#d4edda',
      filter: { inspection_isnull: true },
    },
    {
      key: 'sla_validation',
      label: 'SLA de Validação',
      value: (
        <Typography variant="body2" fontSize={12} color="#856404">
          Em desenvolvimento...
        </Typography>
      ),
      icon: <PendingActions style={{ color: '#856404' }} />,
      color: '#fff3cd',
      filter: {},
    },
  ];

  const statusStats = [
    {
      key: 'scheduled',
      label: 'Agendado',
      icon: <AssignmentTurnedIn />,
      value: indicators?.installations_status_count?.Agendado || 0,
      color: '#E3F2FD',
      filter: { installation_status: 'Agendado' }
    },
    {
      key: 'blocked',
      label: 'Bloqueado',
      icon: <Lock />,
      value: indicators?.installations_status_count?.Bloqueado || 0,
      color: '#FFEBEE',
      filter: { installation_status: 'Bloqueado' }
    },
    {
      key: 'cancelled',
      label: 'Cancelado',
      icon: <Cancel />,
      value: indicators?.installations_status_count?.Cancelado || 0,
      color: '#FFCDD2',
      filter: { installation_status: 'Cancelado' }
    },
    {
      key: 'in_construction',
      label: 'Em obra',
      icon: <ConstructionRounded />,
      value: indicators?.installations_status_count?.['Em obra'] || 0,
      color: '#FFF9C4',
      filter: { installation_status: 'Em obra' }
    },
    {
      key: 'installed',
      label: 'Instalado',
      icon: <CheckCircle />,
      value: indicators?.installations_status_count?.Instalado || 0,
      color: '#C8E6C9',
      filter: { installation_status: 'Instalado' }
    },
    {
      key: 'released',
      label: 'Liberado',
      icon: <LockOpen />,
      value: indicators?.installations_status_count?.Liberado || 0,
      color: '#E8F5E9',
      filter: { installation_status: 'Liberado' }
    }
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({
        fields:
          'id,project_number,sale.customer.complete_name,sale.signature_date,sale.status,sale.treadmill_counter,sale.branch.name,installation_status',
        expand:
          'sale,sale.customer,sale.branch,inspection',
        metrics: 'installation_status',
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
      const { indicators } = await projectService.installationIndicators({ ...filters });
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
  }, [fetchProjects, fetchIndicators, filters, refresh]);

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Instalação' }];

  const installationStatusChips = {
    Agendado: <Chip label="Agendado" color="primary" icon={<AssignmentTurnedIn />} />,
    Bloqueado: <Chip label="Bloqueado" color="error" icon={<Lock />} />,
    Cancelado: <Chip label="Cancelado" color="error" icon={<Cancel />} />,
    'Em obra': <Chip label="Em obra" color="warning" icon={<ConstructionRounded />} />,
    Instalado: <Chip label="Instalado" color="success" icon={<CheckCircle />} />,
    Liberado: <Chip label="Liberado" color="success" icon={<LockOpen />} />,
  }

  const columns = [
    {
      field: 'project',
      headerName: 'Projeto',
      render: (r) => `${r.project_number} - ${r.sale?.customer?.complete_name}` || 'SEM NÚMERO',
      sx: { opacity: 0.7 },
    },
    {
      field: 'sale.branch',
      headerName: 'Unidade',
      render: (r) => r.sale?.branch?.name || '-',
    },
    {
      field: 'sale.signature_date',
      headerName: 'Data de Assinatura',
      render: (r) => formatDate(r.sale?.signature_date),
    },
    {
      field: 'sale.status',
      headerName: 'Status',
      render: (r) => <StatusChip status={r.sale?.status} />,
    },
    {
      field: 'sale.treadmill_counter',
      headerName: 'Contador',
      render: (r) => <Chip label={r.sale?.treadmill_counter || '-'} variant="outlined" />,
    },
    {
      field: 'installation_status',
      headerName: 'Status de Instalação',
      render: (r) => installationStatusChips[r.installation_status] || <Chip label="SEM STATUS" variant="outlined" />,
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
    <PageContainer title={'Instalações'} description={'Dashboard de Instalações'}>
      <Breadcrumb items={BCrumb} />

      {/* Indicadores */}
      <Box sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6">Indicadores</Typography>
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
            const isActive = filters && Object.keys(filters).some((fk) => fk in filter);
            return (
              <KPICard
                key={key}
                label={label}
                value={value}
                icon={icon}
                color={color}
                active={isActive}
                loading={loadingIndicators}
                format={format}
                onClick={() => handleKPIClick(key)}
              />
            );
          })}
        </Box>
      </Box>
      <Box sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6">Status de Instalação</Typography>
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
          {statusStats.map(({ key, label, value, icon, color, filter, format }) => {
            const isActive = filters && Object.keys(filters).some((fk) => fk in filter);
            return (
              <KPICard
                key={key}
                label={label}
                value={value}
                icon={icon}
                color={color}
                active={isActive}
                loading={loadingIndicators}
                format={format}
                onClick={() => handleKPIClick(key)}
              />
            );
          })}
        </Box>
      </Box>

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

export default InspectionsDashboard;
