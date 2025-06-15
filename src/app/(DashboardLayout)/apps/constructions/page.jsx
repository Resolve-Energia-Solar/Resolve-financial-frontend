'use client';
import { useState, useEffect, useCallback, useContext } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import projectService from '@/services/projectService';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';

import {
  AssignmentTurnedIn,
  Cancel,
  FilterAlt,
  HourglassBottom,
  PendingActions,
  Person,
  HourglassEmpty,
  RemoveCircleOutline,
} from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { Chip, Tooltip, Button, Box, Typography, Skeleton, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { formatDate } from '@/utils/dateUtils';
import { FilterContext } from '@/context/FilterContext';
import { IconBuilding, IconTools, IconUserBolt } from '@tabler/icons-react';
import { KPICard } from '@/app/components/charts/KPICard';
import JourneyCounterChip from '@/app/components/apps/project/Costumer-journey/JourneyCounterChip';

const CONSTRUCTION_STATUS_MAP = {
  P: { label: 'Pendente', color: 'default', icon: <HourglassEmpty /> },
  F: { label: 'Finalizada', color: 'success', icon: <CheckCircleIcon /> },
  C: { label: 'Cancelada', color: 'error', icon: <Cancel /> },
  EA: { label: 'Em Andamento', color: 'warning', icon: <HourglassBottom /> },
};

const WORK_RESPONSIBILITY_MAP = {
  C: { label: 'Cliente', color: 'success', icon: <Person /> },
  F: { label: 'Franquia', color: 'primary', icon: <IconBuilding /> },
  O: { label: 'Centro de Operações', color: 'warning', icon: <IconUserBolt /> },
};

const ConstructionsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [indicators, setIndicators] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const statusStats = [
    {
      key: 'total_pending',
      label: 'Pendente',
      value: indicators.total_pending,
      icon: <PendingActions />,
      color: '#fff3cd',
      filter: { construction_status__in: 'P' },
    },
    {
      key: 'total_in_progress',
      label: 'Em Andamento',
      value: indicators.total_in_progress,
      icon: <HourglassBottom />,
      color: '#d1ecf1',
      filter: { construction_status__in: 'EA' },
    },
    {
      key: 'total_finished',
      label: 'Finalizada',
      value: indicators.total_finished,
      icon: <CheckCircleIcon />,
      color: '#d4edda',
      filter: { construction_status__in: 'F' },
    },
    {
      key: 'total_canceled',
      label: 'Cancelada',
      value: indicators.total_canceled,
      icon: <Cancel />,
      color: '#f8d7da',
      filter: { construction_status__in: 'C' },
    },
    {
      key: 'total_without_construction',
      label: 'Sem Obras Cadastradas',
      value: indicators.total_without_construction,
      icon: <AssignmentTurnedIn />,
      color: '#d1ecf1',
      filter: { construction_status__in: 'S' },
    },
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({
        fields:
          'id,project_number,sale.customer.complete_name,sale.signature_date,sale.status,sale.branch.name,inspection.status,inspection.service_opinion,inspection.schedule_date,inspection.final_service_opinion.name,inspection.final_service_opinion_date,inspection.final_service_opinion_user,civil_construction.work_responsibility,civil_construction.status,civil_construction.is_customer_aware,civil_construction.start_date,civil_construction.end_date,constructions-indicators.total_pending,constructions-indicators.total_in_progress,civil_construction.repass_value,constructions-indicators.total_finished,constructions-indicators.total_canceld,constructions-indicators.total_without_construction,constructions-indicators.total_not_applicable,journey_counter',
        expand:
          'sale,sale.customer,sale.branch,inspection,inspection.final_service_opinion,inspection.final_service_opinion_date,inspection,civil_construction,constructions-indicators',
        in_construction: true,
        metrics: 'in_construction,construction_status,journey_counter',
        page: page + 1,
        limit: rowsPerPage,
        remove_termination_cancelled_and_pre_sale: true,
        ...filters,
      });
      setProjects(response.results);
      setTotalRows(response.meta.pagination.total_count);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar projetos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters, enqueueSnackbar]);

  const fetchIndicators = useCallback(async () => {
    setLoadingIndicators(true);
    try {
      const { indicators } = await projectService.constructionsIndicators({
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
      field: 'journey_counter',
      headerName: 'Contador',
      render: (r) => <JourneyCounterChip count={r.journey_counter} />
    },
    {
      field: 'inspection.final_service_opinion.name',
      headerName: 'Parecer da vistoria',
      render: (r) => {
        const text = r.inspection?.final_service_opinion?.name || '-';
        return (
          <Tooltip title={text.length > 25 ? text : ''} arrow>
            <Chip label={text.length > 25 ? `${text.substring(0, 25)}...` : text} />
          </Tooltip>
        );
      },
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
          <Chip
            label="Responsabilidade Indefinida"
            color="default"
            icon={<RemoveCircleOutline />}
          />
        ),
    },
    {
      field: 'ciivil_construction.is_customer_aware',
      headerName: 'Cliente ciente?',
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
      field: 'civil_construction.start_date',
      headerName: 'Previsão de início',
      render: (r) => formatDate(r?.civil_construction[0]?.start_date),
    },
    {
      field: 'civil_construction.end_date',
      headerName: 'Previsão de término',
      render: (r) => formatDate(r?.civil_construction[0]?.end_date),
    },
    {
      field: 'civil_construction.status',
      headerName: 'Status da obra',
      render: (r) =>
        r.civil_construction[0]?.status ? (
          <Chip
            label={CONSTRUCTION_STATUS_MAP[r?.civil_construction[0]?.status].label}
            color={CONSTRUCTION_STATUS_MAP[r?.civil_construction[0]?.status].color}
            icon={CONSTRUCTION_STATUS_MAP[r?.civil_construction[0]?.status].icon}
          />
        ) : (
          <Chip label="Sem Obra" color="default" icon={<RemoveCircleOutline />} />
        ),
    },
    {
      field: 'civil_construction.repass_value',
      headerName: 'Valor de Repasse',
      render: (r) =>
        r?.civil_construction[0]?.repass_value !== undefined
          ? new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(r.civil_construction[0]?.repass_value || 0)
          : '-',
    },
  ];

  const handleKPIClick = (kpiType) => {
    const kpiFilter = statusStats.find((stat) => stat.key === kpiType)?.filter;

    if (!kpiFilter) {
      return;
    }

    const filterKey = Object.keys(kpiFilter)[0];

    if (filters && filters[filterKey] === kpiFilter[filterKey]) {
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      setFilters(newFilters);
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...kpiFilter,
      }));
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
    <PageContainer title={'Obras'} description={'Dashboard de Obras'}>
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
            p: 2,
            background: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5'
          }}
        >
          <Typography variant="h6" sx={{ width: '100%' }}>
            Status da Obra
          </Typography>
          {statusStats.map(({ key, label, value, icon, color, filter, format }) => {
            const isActive =
              filter &&
              Object.entries(filter).some(
                ([filterKey, filterValue]) => filters?.[filterKey] === filterValue,
              );

            return (
              <KPICard
                key={key}
                label={label}
                value={value}
                icon={icon}
                color={color}
                active={isActive}
                format={format}
                onClick={() => handleKPIClick(key)}
                loading={loadingIndicators}
              />
            );
          })}
        </Box>
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
          <Typography variant="h6" sx={{ width: '100%' }}>
            Clientes Cientes da Obra
          </Typography>
          <KPICard
            key="total_customer_aware"
            label="Cientes"
            value={indicators.total_customer_aware}
            icon={<CheckCircleIcon />}
            color={theme.palette.success.main}
            active={
              Object.entries({ is_customer_aware_of_construction: true }).some(
                ([filterKey, filterValue]) => filters?.[filterKey] === filterValue,
              )
            }
            loading={loadingIndicators}
          />
          <KPICard
            key="total_not_customer_aware"
            label="Não-cientes"
            value={indicators.total_not_customer_aware}
            icon={<RemoveCircleOutline />}
            color={theme.palette.error.main}
            active={
              Object.entries({ is_customer_aware_of_construction: false }).some(
                ([filterKey, filterValue]) => filters?.[filterKey] === filterValue,
              )
            }
            loading={loadingIndicators}
          />
        </Box>
      </Box>
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
        <Typography variant="h6" sx={{ width: '100%' }}>
          Responsabilidade da Obra
        </Typography>
        <KPICard
          key="total_customer_responsible"
          label="Cliente"
          value={indicators.total_customer_responsible}
          icon={<CheckCircleIcon />}
          color={theme.palette.success.main}
          active={
            Object.entries({ total_customer_responsible: 'true' }).some(
              ([filterKey, filterValue]) => filters?.[filterKey] === filterValue,
            )
          }
          loading={loadingIndicators}
        />
        <KPICard
          key="total_branch_responsible"
          label="Franquia"
          value={indicators.total_branch_responsible}
          icon={<RemoveCircleOutline />}
          color={theme.palette.error.main}
          active={
            Object.entries({ total_branch_responsible: false }).some(
              ([filterKey, filterValue]) => filters?.[filterKey] === filterValue,
            )
          }
          loading={loadingIndicators}
        />
        <KPICard
          key="total_operational_center_responsible"
          label="Centro de Operações"
          value={indicators.total_operational_center_responsible}
          icon={<RemoveCircleOutline />}
          color={theme.palette.error.main}
          active={
            Object.entries({ total_operational_center_responsible: false }).some(
              ([filterKey, filterValue]) => filters?.[filterKey] === filterValue,
            )
          }
          loading={loadingIndicators}
        />
      </Box>
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
        <Typography variant="h6" sx={{ width: '100%' }}>
          Valores
        </Typography>
        <KPICard
          key="total_repass_value"
          label="Total de Valor de Repasse"
          value={indicators.total_repass_value?.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
          icon={<CheckCircleIcon />}
          color={theme.palette.success.main}
          active={
            Object.entries({ total_repass_value: true }).some(
              ([filterKey, filterValue]) => filters?.[filterKey] === filterValue,
            )
          }
          loading={loadingIndicators}
        />
        <KPICard
          key="total_budget_value"
          label="Total de Orçamento"
          value={indicators.total_budget_value?.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
          icon={<RemoveCircleOutline />}
          color={theme.palette.error.main}
          active={
            Object.entries({ total_budget_value: false }).some(
              ([filterKey, filterValue]) => filters?.[filterKey] === filterValue,
            )
          }
          loading={loadingIndicators}
        />
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

export default ConstructionsDashboard;
