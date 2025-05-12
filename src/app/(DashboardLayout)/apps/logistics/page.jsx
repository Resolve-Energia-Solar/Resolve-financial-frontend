'use client';
import { useState, useEffect, useCallback } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import projectService from '@/services/projectService';
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import StatusChip from '@/utils/status/DocumentStatusIcon';
import { FilterAlt, LockOpen } from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { Chip, Box, Typography, Skeleton } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { formatDate } from '@/utils/dateUtils';

const INDICATORS_STATUS_COLORS = {
  error: { bg: '#F8D7DA', text: '#721C24' },
  warning: { bg: '#FFF3CD', text: '#856404' },
  success: { bg: '#D4EDDA', text: '#155724' },
  info: { bg: '#D1ECF1', text: '#0C5460' },
  grey: { bg: '#E2E3E5', text: '#41464B' }
};

const LogisticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [indicators, setIndicators] = useState({ purchase_status: {}, delivery_status: {}, total_count: 0 });
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [filters, setFilters] = useState({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({ user_types: 3, fields: 'id,project_number,sale.customer.complete_name,product.description,address.complete_address,sale.status,purchase_status,delivery_status', expand: 'sale.customer,product,address,expected_delivery_date', metrics: 'purchase_status,delivery_status,expected_delivery_date', page: page + 1, limit: rowsPerPage, ...filters });
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
      const { indicators } = await projectService.logisticsIndicators({ ...filters });
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
  }, [fetchProjects, fetchIndicators]);

  const handleKpiClick = (key, value) => {
    setFilters({ [key]: value });
    setPage(0);
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Logística' },
  ];

  const getPurchaseChipProps = (status) => {
    switch (status) {
      case 'Bloqueado':
        return { label: status, color: 'error', icon: <BlockIcon /> };
      case 'Liberado':
        return { label: status, color: 'info', icon: <LockOpen /> };
      case 'Pendente':
        return { label: status, color: 'warning', icon: <HourglassEmptyIcon /> };
      case 'Compra Realizada':
        return { label: status, color: 'success', icon: <CheckCircleIcon /> };
      case 'Cancelado':
        return { label: status, color: 'error', icon: <CancelIcon /> };
      case 'Distrato':
        return { label: status, color: 'default', icon: <RemoveCircleOutlineIcon /> };
      case 'Aguardando Previsão de Entrega':
        return { label: status, color: 'info', icon: <AccessTimeIcon /> };
      case 'Aguardando Pagamento':
        return { label: status, color: 'warning', icon: <CreditCardIcon /> };
      default:
        return { label: status, color: 'default' };
    }
  };

  const getDeliveryChipProps = (status) => {
    switch (status) {
      case 'Bloqueado':
        return { label: status, color: 'error', icon: <BlockIcon /> };
      case 'Liberado':
        return { label: status, color: 'info', icon: <LockOpen /> };
      case 'Agendado':
        return { label: status, color: 'info', icon: <EventIcon /> };
      case 'Entregue':
        return { label: status, color: 'success', icon: <CheckCircleIcon /> };
      case 'Cancelado':
        return { label: status, color: 'error', icon: <CancelIcon /> };
      default:
        return { label: status, color: 'default' };
    }
  };

  const columns = [
    {
      field: 'project_number',
      headerName: 'Projeto',
      render: r => `${r.project_number} - ${r.sale?.customer?.complete_name}` || 'SEM NÚMERO',
      sx: { opacity: 0.7 }
    },
    {
      field: 'product.description',
      headerName: 'Produto',
      render: r => r.product?.description || '-'
    },
    {
      field: 'address',
      headerName: 'Endereço',
      render: r => r.address?.complete_address || '-'
    },
    {
      field: 'sale.status',
      headerName: 'Status da Venda',
      render: r => <StatusChip status={r.sale?.status} />
    },
    {
      field: 'purchase_status',
      headerName: 'Status da Compra',
      render: r => <Chip {...getPurchaseChipProps(r.purchase_status)} />
    },
    {
      field: 'delivery_status',
      headerName: 'Status da Entrega',
      render: r => <Chip {...getDeliveryChipProps(r.delivery_status)} />
    },
    {
      field: 'expected_delivery_date',
      headerName: 'Previsão de Entrega',
      render: r => formatDate(r.expected_delivery_date) || '-',
    }
  ];

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
    <PageContainer title={'Logística'} description={'Dashboard de Logística'}>
      <Breadcrumb items={BCrumb} />

      {/* Indicadores */}
      <Box sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6">Indicadores de Compra</Typography>
        {loadingIndicators ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', gap: 2, flexWrap: 'wrap', mt: 1, mb: 4, background: '#f5f5f5', p: 2 }}>
            {Array.from({ length: 7 }).map((_, index) => (
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
                  backgroundColor: '#E2E3E5',
                  borderRadius: 1,
                  maxWidth: '170px',
                  aspectRatio: '4 / 3',
                  textAlign: 'center',
                  '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' }
                }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', gap: 2, flexWrap: 'wrap', mt: 1, mb: 4, background: '#f5f5f5', p: 2 }}>
            {Object.entries(indicators.purchase_status).map(([status, count]) => {
              const { label, color, icon } = getPurchaseChipProps(status);
              const colors = INDICATORS_STATUS_COLORS[color] || INDICATORS_STATUS_COLORS.grey;
              const isActive = filters.purchase_status === status;

              return (
                <Box key={status} sx={{
                  flex: '1 1 150px',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.bg,
                  border: isActive ? '2px solid green' : 'none',
                  color: colors.text,
                  borderRadius: 1,
                  maxWidth: '170px',
                  aspectRatio: '4 / 3',
                  textAlign: 'center',
                  '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' }
                }}
                  onClick={() => handleKpiClick('purchase_status', status)}
                >
                  {icon}
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>{label}</Typography>
                  <Typography variant="h6">{count}</Typography>
                </Box>
              );
            })}
          </Box>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>Indicadores de Entrega</Typography>
        {loadingIndicators ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', gap: 2, flexWrap: 'wrap', mt: 1, mb: 4, background: '#f5f5f5', p: 2 }}>
            {Array.from({ length: 5 }).map((_, index) => (
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
                  backgroundColor: '#E2E3E5',
                  borderRadius: 1,
                  maxWidth: '170px',
                  aspectRatio: '4 / 3',
                  textAlign: 'center',
                  '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' }
                }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly', gap: 2, flexWrap: 'wrap', mt: 1, background: '#f5f5f5', p: 2 }}>
            {Object.entries(indicators.delivery_status).map(([status, count]) => {
              const { label, color, icon } = getDeliveryChipProps(status);
              const colors = INDICATORS_STATUS_COLORS[color] || INDICATORS_STATUS_COLORS.grey;
              const isActive = filters.delivery_status === status;

              return (
                <Box key={status} sx={{
                  flex: '1 1 150px',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.bg,
                  border: isActive ? '2px solid green' : 'none',
                  color: colors.text,
                  borderRadius: 1,
                  maxWidth: '170px',
                  aspectRatio: '4 / 3',
                  textAlign: 'center',
                  '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' }
                }}
                  onClick={() => handleKpiClick('delivery_status', status)}
                >
                  {icon}
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>{label}</Typography>
                  <Typography variant="h6">{count}</Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

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

export default LogisticsDashboard;
