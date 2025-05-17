'use client';
import { useState, useEffect, useCallback, useContext } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import projectService from '@/services/projectService';
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import StatusChip from '@/utils/status/DocumentStatusIcon';
import { FilterAlt } from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { Chip, Box, Typography } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { formatDate } from '@/utils/dateUtils';
import ScheduleOpinionChip from '@/app/components/apps/inspections/schedule/StatusChip/ScheduleOpinionChip';
import { FilterContext } from '@/context/FilterContext';
import UserCard from '@/app/components/apps/users/userCard';
import { KPICard } from '@/app/components/charts/KPICard';

const InspectionsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [indicators, setIndicators] = useState({ purchase_status: {}, delivery_status: {}, total_count: 0 });
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
      key: 'total_finished',
      label: 'Vistorias Finalizadas',
      value: indicators.total_finished,
      icon: <CheckCircleIcon />,
      color: '#d4edda',
      filter: { inspection_is_finished: true }
    },
    {
      key: 'total_pending',
      label: 'Vistorias Pendentes',
      value: indicators.total_pending,
      icon: <HourglassEmptyIcon />,
      color: '#fff3cd',
      filter: { inspection_is_pending: true }
    },
    {
      key: 'total_not_scheduled',
      label: 'Sem Vistoria Vinculada',
      value: indicators.total_not_scheduled,
      icon: <RemoveCircleOutlineIcon />,
      color: '#f8d7da',
      filter: { inspection_isnull: true }
    }
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({ fields: 'id,project_number,sale.customer.complete_name,sale.signature_date,sale.status,sale.treadmill_counter,sale.branch.name,inspection.schedule_date,inspection.final_service_opinion.name,inspection.final_service_opinion_date,inspection.final_service_opinion_user', expand: 'sale,sale.customer,sale.branch,inspection', metrics: '', page: page + 1, limit: rowsPerPage, remove_termination_cancelled_and_pre_sale: true, ...filters });
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
      const { indicators } = await projectService.inspectionsIndicators({ remove_termination_cancelled_and_pre_sale: true, ...filters });
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

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Vistoria' },
  ];

  const columns = [
    {
      field: 'project',
      headerName: 'Projeto',
      render: r => `${r.project_number} - ${r.sale?.customer?.complete_name}` || 'SEM NÚMERO',
      sx: { opacity: 0.7 }
    },
    {
      field: 'sale.signature_date',
      headerName: 'Data de Assinatura',
      render: r => formatDate(r.sale?.signature_date),
    },
    {
      field: 'sale.status',
      headerName: 'Status',
      render: r => <StatusChip status={r.sale?.status} />,
    },
    {
      field: 'sale.treadmill_counter',
      headerName: 'Contador',
      render: r => <Chip label={r.sale?.treadmill_counter || '-'} variant='outlined' />,
    },
    {
      field: 'sale.branch',
      headerName: 'Unidade',
      render: r => r.sale?.branch?.name || '-',
    },
    {
      field: 'inspection.date',
      headerName: 'Data de Vistoria',
      render: r => formatDate(r.inspection?.schedule_date),
    },
    {
      field: 'inspection.final_service_opinion.name',
      headerName: 'Status de Vistoria',
      render: r => <ScheduleOpinionChip status={r.inspection?.final_service_opinion?.name} />,
    },
    {
      field: 'inspection.final_service_opinion_date',
      headerName: 'Data de Finalização',
      render: r => r.inspection?.final_service_opinion_date ? new Date(r.inspection.final_service_opinion_date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-',
    },
    {
      field: 'inspection.final_service_opinion_user',
      headerName: 'Responsável',
      render: r => { return r.inspection?.final_service_opinion_user ? <UserCard userId={r.inspection?.final_service_opinion_user} /> : '-'; },
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

  const handlePageChange = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target?.value, 10));
    setPage(0);
  }, []);

  return (
    <PageContainer title={'Vistorias'} description={'Dashboard de Vistorias'}>
      <Breadcrumb items={BCrumb} />

      {/* Indicadores */}
      <Box sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6">Indicadores</Typography>
        <Box sx={{
          width: '100%', display: 'flex', justifyContent: 'space-evenly',
          gap: 2, flexWrap: 'wrap', mt: 1, mb: 4, background: '#f5f5f5', p: 2,
        }}>
          {stats.map(({ key, label, value, icon, color, filter, format }) => {
            const isActive = filter && Object.entries(filter).some(
              ([filterKey, filterValue]) => filters?.[filterKey] === filterValue
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
          objNameNumberReference={totalRows === 1 ? "Projeto" : "Projetos"}
          loading={loading}
        />
        <TableHeader.Button
          buttonLabel="Filtros"
          icon={<FilterAlt />}
          onButtonClick={() => { setFilterDrawerOpen(true); }}
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
        onClose={() => { setOpenDrawer(false); setSelectedRow(null); }}
        noWrap={true}
      >
        <Table.Head>
          {columns.map(c => (
            <Table.Cell key={c.field} sx={{ fontWeight: 600, fontSize: '14px' }}>
              {c.headerName}
            </Table.Cell>
          ))}
        </Table.Head>

        <Table.Body
          loading={loading}
          onRowClick={handleRowClick}
          sx={{ cursor: "pointer", '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' } }}
        >
          {columns.map(col => (
            <Table.Cell key={col.field} render={col.render} sx={col.sx} />
          ))}
        </Table.Body>
        <Table.Pagination />
      </Table.Root>
      <ProjectDetailDrawer projectId={selectedRow} open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </PageContainer>
  );
};

export default InspectionsDashboard;
