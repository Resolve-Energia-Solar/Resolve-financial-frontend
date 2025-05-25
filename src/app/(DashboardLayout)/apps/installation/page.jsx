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
import { Chip, Box, Typography } from '@mui/material';
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
  const [ordering, setOrdering] = useState('-created_at');
  const [totalRows, setTotalRows] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const statusStats = [
    {
      key: 'scheduled',
      label: 'Agendado',
      icon: <AssignmentTurnedIn />,
      value: indicators?.installations_status_count?.Agendado || 0,
      color: '#E3F2FD',
      filter: { installation_status__in: 'Agendado' }
    },
    {
      key: 'blocked',
      label: 'Bloqueado',
      icon: <Lock />,
      value: indicators?.installations_status_count?.Bloqueado || 0,
      color: '#FFEBEE',
      filter: { installation_status__in: 'Bloqueado' }
    },
    {
      key: 'cancelled',
      label: 'Cancelado',
      icon: <Cancel />,
      value: indicators?.installations_status_count?.Cancelado || 0,
      color: '#FFCDD2',
      filter: { installation_status__in: 'Cancelado' }
    },
    {
      key: 'in_construction',
      label: 'Em obra',
      icon: <ConstructionRounded />,
      value: indicators?.installations_status_count?.['Em obra'] || 0,
      color: '#FFF9C4',
      filter: { installation_status__in: 'Em obra' }
    },
    {
      key: 'installed',
      label: 'Instalado',
      icon: <CheckCircle />,
      value: indicators?.installations_status_count?.Instalado || 0,
      color: '#C8E6C9',
      filter: { installation_status__in: 'Instalado' }
    },
    {
      key: 'released',
      label: 'Liberado',
      icon: <LockOpen />,
      value: indicators?.installations_status_count?.Liberado || 0,
      color: '#E8F5E9',
      filter: { installation_status__in: 'Liberado' }
    }
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({
        fields:
          'id,project_number,status,sale.customer.complete_name,sale.signature_date,sale.status,journey_counter,sale.branch.name,installation_status,sale.id,sale.customer.address,sale.customer.neighborhood,inspection.final_service_opinion.name,team,supervisor,purchase_order_number,panels_count,delivery_status,is_released_to_installation,latest_installation',
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
  }, [fetchProjects, fetchIndicators, filters, ordering, refresh]);

  const handleSort = (field) => {
    console.log('Sorting by:', field);
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
      field: 'sale.status',
      headerName: 'Status da Venda',
      render: (r) => <StatusChip status={r.sale?.status} />,
    },
    {
      field: 'status',
      headerName: 'Status do Projeto',
      render: (r) => <StatusChip status={r.status} />,
    },
    {
      field: 'inspection.status',
      headerName: 'Status da Vistoria',
      render: (r) => <ScheduleOpinionChip status={r.inspection?.final_service_opinion?.name} />,
    },
    {
      field: 'is_released_to_installation',
      headerName: 'Liberado para Instalação',
      render: (r) => r.is_released_to_installation ? <Chip label="Sim" color="success" icon={<CheckCircle />} /> : <Chip label="Não" color="error" icon={<Cancel />} />,
    },
    {
      field: 'delivery_status',
      headerName: 'Status de Entrega',
      render: (r) => <DeliveryStatusChip status={r.delivery_status} />,
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
      field: 'latest_installation.product_description',
      headerName: 'Produto',
      render: (r) => r.latest_installation?.product_description || '-',
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
            background: '#f5f5f5',
            p: 2,
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
        <Table.Head>
          {columns.map((col) => (
            <Table.Cell
              key={col.field}
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                cursor: col.sortable ? 'pointer' : 'default',
              }}
              onClick={() => col.sortable && handleSort(col.field)}
            >
              {col.headerName}
              {col.sortable && (ordering === col.field ? ' ▲' : ordering === `-${col.field}` ? ' ▼' : '')}
            </Table.Cell>
          ))}
        </Table.Head>

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
