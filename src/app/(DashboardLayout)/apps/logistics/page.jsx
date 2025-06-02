'use client';
// React and hooks
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';

// Material UI Components
import { Box, Chip, Typography, useTheme } from '@mui/material';

// Material UI Icons
import {
  FilterAlt,
  LockOpen,
  RemoveCircleOutline,
  AccessTime as AccessTimeIcon,
  Block as BlockIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  CreditCard as CreditCardIcon,
  Event as EventIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';

// App components
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';
import { KPICard } from '@/app/components/charts/KPICard';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';

// Services and utilities
import projectService from '@/services/projectService';
import StatusChip from '@/utils/status/DocumentStatusIcon';
import DeliveryStatusChip from '@/app/components/apps/logistics/DeliveryStatusChip';
import PurchaseStatusChip from '@/app/components/apps/logistics/PurchaseStatusChip';
import { formatDate } from '@/utils/dateUtils';

// Filter Config
import filterConfig from './filterConfig';

const LogisticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [indicators, setIndicators] = useState({
    purchase_status: {},
    delivery_status: {},
    total_count: 0,
  });
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [filters, setFilters] = useState({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({
        user_types: 3,
        fields:
          'id,project_number,sale.signature_date,sale.customer.complete_name,product.description,address.complete_address,sale.status,sale.signature_date,purchase_status,delivery_status,sale.id,delivery_type,distance_to_matriz_km',
        expand: 'sale.customer,product,address,expected_delivery_date',
        metrics: 'purchase_status,delivery_status,expected_delivery_date',
        page: page + 1,
        limit: rowsPerPage,
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
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(0);
  };

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Logística' }];

  // Build purchase indicators with vivid icon colors
  const purchaseStats = Object.entries(indicators.purchase_status).map(([status, count]) => {
    let icon;
    let color;
    switch (status) {
      case 'Bloqueado':
        icon = <BlockIcon />;
        color = '#dc3545';
        break;
      case 'Liberado':
        icon = <LockOpen />;
        color = '#17a2b8';
        break;
      case 'Pendente':
        icon = <HourglassEmptyIcon />;
        color = '#ffc107';
        break;
      case 'Compra Realizada':
        icon = <CheckCircleIcon />;
        color = '#28a745';
        break;
      case 'Cancelado':
        icon = <CancelIcon />;
        color = '#dc3545';
        break;
      case 'Distrato':
        icon = <RemoveCircleOutline />;
        color = '#6c757d';
        break;
      case 'Aguardando Previsão de Entrega':
        icon = <AccessTimeIcon />;
        color = '#007bff';
        break;
      case 'Aguardando Pagamento':
        icon = <CreditCardIcon />;
        color = '#fd7e14';
        break;
      default:
        icon = <BuildCircleIcon />;
        color = '#6f42c1';
    }
    return {
      key: status,
      label: status,
      value: count,
      icon,
      color: color,
      filter: { purchase_status: status },
    };
  });

  // Build delivery indicators with vivid icon colors
  const deliveryStats = Object.entries(indicators.delivery_status).map(([status, count]) => {
    let icon;
    let color;
    switch (status) {
      case 'Bloqueado':
        icon = <BlockIcon />;
        color = '#dc3545';
        break;
      case 'Liberado':
        icon = <LockOpen />;
        color = '#17a2b8';
        break;
      case 'Agendado':
        icon = <EventIcon />;
        color = '#007bff';
        break;
      case 'Entregue':
        icon = <CheckCircleIcon />;
        color = '#28a745';
        break;
      case 'Cancelado':
        icon = <CancelIcon />;
        color = '#dc3545';
        break;
      default:
        icon = <BuildCircleIcon />;
        color = '#6f42c1';
    }
    return {
      key: status,
      label: status,
      value: count,
      icon,
      color: color,
      filter: { delivery_status: status },
    };
  });

  const columns = [
    {
      field: 'sale.signature_date',
      headerName: 'Data da Assinatura',
      render: (r) => formatDate(r.sale?.signature_date) || '-',
      sx: { width: 150, textAlign: 'center' },
    },
    {
      field: 'project_number',
      headerName: 'Projeto',
      render: (r) => `${r.project_number} - ${r.sale?.customer?.complete_name}` || 'SEM NÚMERO',
      sx: { opacity: 0.7 },
    },
    {
      field: 'product.description',
      headerName: 'Produto',
      render: (r) => r.product?.description || '-',
    },
    {
      field: 'address',
      headerName: 'Endereço',
      render: (r) => r.address?.complete_address || '-',
    },
    {
      field: 'distance_to_matriz_km',
      headerName: 'Distância à CD',
      render: (r) =>
        r.distance_to_matriz_km !== undefined && r.distance_to_matriz_km !== null
          ? `${r.distance_to_matriz_km} km`
          : '-',
      sx: { fontWeight: 500, textAlign: 'center' },
    },
    {
      field: 'sale.status',
      headerName: 'Status da Venda',
      render: (r) => <StatusChip status={r.sale?.status} />,
    },
    {
      field: 'purchase_status',
      headerName: 'Status da Compra',
      render: (r) => <PurchaseStatusChip status={r.purchase_status} />,
    },
    {
      field: 'delivery_status',
      headerName: 'Status da Entrega',
      render: (r) => <DeliveryStatusChip status={r.delivery_status} />,
    },
    {
      field: 'delivery_type',
      headerName: 'Tipo de Entrega',
      render: (r) =>
        r.delivery_type === 'C' ? 'Entrega CD' : r.delivery_type === 'D' ? 'Entrega Direta' : '-',
    },
    {
      field: 'expected_delivery_date',
      headerName: 'Previsão de Entrega',
      render: (r) => formatDate(r.expected_delivery_date) || '-',
    },
  ];

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
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
    <PageContainer title={'Logística'} description={'Dashboard de Logística'}>
      <Breadcrumb items={BCrumb} />

      {/* Indicadores */}
      <Box sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6">Indicadores de Compra</Typography>
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
          {purchaseStats.map(({ key, label, value, icon, color, filter }) => {
            const isActive = filters.purchase_status === filter.purchase_status;
            return (
              <KPICard
                key={key}
                label={label}
                value={value}
                icon={icon}
                color={color}
                active={isActive}
                loading={loadingIndicators}
                onClick={() => handleKpiClick('purchase_status', filter.purchase_status)}
              />
            );
          })}
        </Box>

        <Typography variant="h6">Indicadores de Entrega</Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
            gap: 2,
            flexWrap: 'wrap',
            mt: 1,
            p: 2,
            background: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5'
          }}
        >
          {deliveryStats.map(({ key, label, value, icon, color, filter }) => {
            const isActive = filters.delivery_status === filter.delivery_status;
            return (
              <KPICard
                key={key}
                label={label}
                value={value}
                icon={icon}
                color={color}
                active={isActive}
                loading={loadingIndicators}
                onClick={() => handleKpiClick('delivery_status', filter.delivery_status)}
              />
            );
          })}
        </Box>
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
          objNameNumberReference={totalRows === 1 ? 'Projeto' : 'Projetos'}
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
        <Table.Head columns={columns} />
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

export default LogisticsDashboard;
