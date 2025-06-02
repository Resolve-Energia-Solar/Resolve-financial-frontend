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
  AssignmentTurnedIn, FilterAlt, LockOpen, Lock,
  Cancel,
  ConstructionRounded,
  CheckCircle
} from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { Chip, Box, Typography, useTheme } from '@mui/material';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { FilterContext } from '@/context/FilterContext';
import { KPICard } from '@/app/components/charts/KPICard';
import ScheduleOpinionChip from '@/app/components/apps/inspections/schedule/StatusChip/ScheduleOpinionChip';
import DeliveryStatusChip from '@/app/components/apps/logistics/DeliveryStatusChip';
import UserCard from '@/app/components/apps/users/userCard';
import JourneyCounterChip from '@/app/components/apps/project/Costumer-journey/JourneyCounterChip';

const InstallationsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [indicators, setIndicators] = useState({ installations_status_count: {} });
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ordering, setOrdering] = useState('-created_at');
  const [totalRows, setTotalRows] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const statusStats = [
    {
      key: 'Agendado',
      label: 'Agendado',
      icon: <AssignmentTurnedIn />,
      value: indicators?.installations_status_count?.['Agendado'] || 0,
      color: '#E3F2FD',
      filter: { installation_status__in: 'Agendado' }
    },
    {
      key: 'Bloqueado',
      label: 'Bloqueado',
      icon: <Lock />,
      value: indicators?.installations_status_count?.['Bloqueado'] || 0,
      color: '#FFEBEE',
      filter: { installation_status__in: 'Bloqueado' }
    },
    {
      key: 'Cancelado',
      label: 'Cancelado',
      icon: <Cancel />,
      value: indicators?.installations_status_count?.['Cancelado'] || 0,
      color: '#FFCDD2',
      filter: { installation_status__in: 'Cancelado' }
    },
    {
      key: 'Em obra',
      label: 'Em obra',
      icon: <ConstructionRounded />,
      value: indicators?.installations_status_count?.['Em obra'] || 0,
      color: '#FFF9C4',
      filter: { installation_status__in: 'Em obra' }
    },
    {
      key: 'Instalado',
      label: 'Instalado',
      icon: <CheckCircle />,
      value: indicators?.installations_status_count?.['Instalado'] || 0,
      color: '#C8E6C9',
      filter: { installation_status__in: 'Instalado' }
    },
    {
      key: 'Liberado',
      label: 'Liberado',
      icon: <LockOpen />,
      value: indicators?.installations_status_count?.['Liberado'] || 0,
      color: '#E8F5E9',
      filter: { installation_status__in: 'Liberado' }
    }
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({
        fields:
          'id,project_number,designer_status,sale.customer.complete_name,sale.signature_date,sale.status,journey_counter,sale.branch.name,installation_status,sale.id,sale.customer.address,sale.customer.neighborhood,inspection.final_service_opinion.name,team,supervisor,purchase_order_number,panels_count,delivery_status,is_released_to_installation,latest_installation',
        expand:
          'sale,sale.customer,sale.branch,inspection.final_service_opinion',
        metrics: 'journey_counter,installation_status,delivery_status,is_released_to_installation,latest_installation',
        page: page + 1,
        limit: rowsPerPage,
        ordering,
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
  }, [page, rowsPerPage, filters, ordering, enqueueSnackbar]);

  const fetchIndicators = useCallback(async () => {
    setLoadingIndicators(true);
    try {
      const indicators = await projectService.installationIndicators({ ...filters });
      setIndicators(indicators.indicators || indicators);
    } catch {
      enqueueSnackbar('Erro ao carregar indicadores', { variant: 'error' });
    } finally {
      setLoadingIndicators(false);
    }
  }, [filters, enqueueSnackbar]);

  useEffect(() => {
    fetchProjects();
    fetchIndicators();
  }, [fetchProjects, fetchIndicators]);

  const handleSort = (field) => {
    setPage(0);
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else {
      setOrdering(field);
    }
  };

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
      field: 'project_number',
      headerName: 'Projeto',
      render: (r) => `${r.project_number} - ${r.sale?.customer?.complete_name}`,
      sx: { opacity: 0.7 },
    },
    {
      field: 'inspection.status',
      headerName: 'Status da Vistoria',
      render: (r) => <ScheduleOpinionChip status={r.inspection?.final_service_opinion?.name} />,
    },
    {
      field: 'sale.status',
      headerName: 'Status da Venda\n(Documentação)',
      render: (r) => <StatusChip status={r.sale?.status} />,
    },
    {
      field: 'designer_status',
      headerName: 'Status do Projeto\n(Engenharia)',
      render: (r) => <StatusChip status={r.designer_status} />,
    },
    {
      field: 'delivery_status',
      headerName: 'Status de Entrega',
      render: (r) => <DeliveryStatusChip status={r.delivery_status} />,
    },
    {
      field: 'is_released_to_installation',
      headerName: 'Liberado para Instalação',
      render: (r) => r.is_released_to_installation ? <Chip label="Sim" color="success" icon={<CheckCircle />} /> : <Chip label="Não" color="error" icon={<Cancel />} />,
    },
    {
      field: 'installation_status',
      headerName: 'Status de Instalação',
      render: (r) => installationStatusChips[r.installation_status] || <Chip label="Indefinido" color="default" />,
    },
    {
      field: 'journey_counter',
      headerName: 'Contador de Dias',
      render: (r) => <JourneyCounterChip count={r.journey_counter} />,
      sortable: true
    },
    {
      field: 'latest_installation.schedule_agent',
      headerName: 'Equipe',
      render: (r) => r.latest_installation?.schedule_agent ? <UserCard userId={r.latest_installation?.schedule_agent} /> : '-',
    },
    {
      field: 'latest_installation.final_service_opinion_user',
      headerName: 'Fiscal',
      render: (r) => r.latest_installation?.final_service_opinion_user ? <UserCard userId={r.latest_installation?.final_service_opinion_user} /> : '-',
    },
    {
      field: 'latest_installation.panel_count',
      headerName: 'Qtd. de Módulos',
      render: (r) => r.latest_installation?.panel_count || '-',
    },
    {
      field: 'latest_installation.complete_address',
      headerName: 'Endereço',
      render: (r) => r.latest_installation?.complete_address || '-',
    },
    {
      field: 'latest_installation.neighborhood',
      headerName: 'Bairro',
      render: (r) => r.latest_installation?.neighborhood || '-',
    },
  ];

  const handleKPIClick = (kpiType) => {
    const kpiFilter = statusStats.find((stat) => stat.key === kpiType)?.filter;
    const isAlreadyFiltered = kpiFilter && Object.keys(kpiFilter).every(
      (key) => filters[key] === kpiFilter[key]
    );

    if (kpiFilter && Object.keys(kpiFilter).length > 0 && !isAlreadyFiltered) {
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
    setSelectedSaleId(row.sale?.id);
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
            p: 2,
            background: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5'
          }}
        >
          {statusStats.map(({ key, label, value, icon, color, filter, format }) => {
            const isActive = filter && Object.keys(filter).every(
              (key) => filters[key] === filter[key]
            );
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
        <Table.Head
          columns={columns}
          ordering={ordering}
          onSort={handleSort}
        />
        <Table.Body
          loading={loading}
          columns={columns.length}
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
        saleId={selectedSaleId}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      />
    </PageContainer>
  );
};

export default InstallationsDashboard;
