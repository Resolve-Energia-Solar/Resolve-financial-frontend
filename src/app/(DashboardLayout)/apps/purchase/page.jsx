'use client';
import { useState, useEffect, useCallback, useContext } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import projectService from '@/services/projectService';
import purchaseService from '@/services/purchaseService';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';
import PurchaseEditModal from '@/app/components/apps/purchase/PurchaseEditModal';
import PurchaseCreateModal from '@/app/components/apps/purchase/PurchaseCreateModal';
import {
  AssignmentTurnedIn,
  Cancel,
  FilterAlt,
  HourglassBottom,
  PendingActions,
  Person,
  HourglassEmpty,
  RemoveCircleOutline,
  Add,
} from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { Chip, Tooltip, Box, Typography, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { formatDate } from '@/utils/dateUtils';
import { formatToBRL } from '@/utils/currency';
import { FilterContext } from '@/context/FilterContext';
import { IconBuilding, IconUserBolt } from '@tabler/icons-react';
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

const PurchaseDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [indicators, setIndicators] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);
  const [ordering, setOrdering] = useState('-created_at');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // const statusStats = [
  //   {
  //     key: 'total_pending',
  //     label: 'Pendente',
  //     value: indicators.total_pending,
  //     icon: <PendingActions />,
  //     color: '#fff3cd',
  //     filter: { construction_status__in: 'P' },
  //   },
  //   {
  //     key: 'total_in_progress',
  //     label: 'Em Andamento',
  //     value: indicators.total_in_progress,
  //     icon: <HourglassBottom />,
  //     color: '#d1ecf1',
  //     filter: { construction_status__in: 'EA' },
  //   },
  //   {
  //     key: 'total_finished',
  //     label: 'Finalizada',
  //     value: indicators.total_finished,
  //     icon: <CheckCircleIcon />,
  //     color: '#d4edda',
  //     filter: { construction_status__in: 'F' },
  //   },
  //   {
  //     key: 'total_canceled',
  //     label: 'Cancelada',
  //     value: indicators.total_canceled,
  //     icon: <Cancel />,
  //     color: '#f8d7da',
  //     filter: { construction_status__in: 'C' },
  //   },
  //   {
  //     key: 'total_without_construction',
  //     label: 'Sem Obras Cadastradas',
  //     value: indicators.total_without_construction,
  //     icon: <AssignmentTurnedIn />,
  //     color: '#d1ecf1',
  //     filter: { construction_status__in: 'S' },
  //   },
  // ];

  const handleSort = (field) => {
    setPage(0);
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else {
      setOrdering(field);
    }
  };

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await purchaseService.index({
        expand: 'project,project.sale.customer,project.product,supplier',
        fields:
          'id,purchase_date,status,purchase_value,delivery_forecast,delivery_number,project,project.sale.customer.complete_name,project.product.name,project.address,supplier,supplier.complete_name,project.id,supplier.id',
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
      });

      setPurchases(response.results);
      setTotalRows(response.meta.pagination.total_count);
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
      enqueueSnackbar('Erro ao carregar compras', { variant: 'error' });
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
    fetchPurchases();
    fetchIndicators();
  }, [fetchIndicators, refresh, filters]);

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Compras' }];

  const columns = [
    {
      field: 'purchase_date',
      headerName: 'Data da Compra',
      render: (row) => formatDate(row.purchase_date),
    },
    {
      field: 'project',
      headerName: 'Nome do Cliente',
      render: (row) => row.project?.sale?.customer?.complete_name || 'N/A',
    },
    {
      field: 'product',
      headerName: 'Produto',
      render: (row) => row.project.product.name || 'N/A',
    },
    {
      field: 'purchase_value',
      headerName: 'Valor da Compra',
      render: (row) => formatToBRL(row.purchase_value || 0),
    },
    {
      field: 'status',
      headerName: 'Status da Compra',
      render: (row) => {
        const map = {
          R: 'Compra realizada',
          C: 'Cancelada',
          D: 'Distrato',
          A: 'Aguardando pagamento',
          P: 'Pendente',
          F: 'Aguardando Previsão de Entrega',
        };
        return map[row.status] || row.status;
      },
    },
    {
      field: 'supplier',
      headerName: 'Fornecedor',
      render: (row) => row.supplier?.complete_name || 'N/A',
    },
    {
      field: 'address',
      headerName: 'Endereço',
      render: (row) => row.project?.address || '-',
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
    setEditModalOpen(true);
    setSelectedPurchase(row);
    setSelectedSaleId(row.project?.sale?.id);
  };

  const handleCreateNew = () => {
    setCreateModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPurchase?.id) {
      console.error('Nenhuma compra selecionada ou ID não encontrado');
      enqueueSnackbar('Erro: Nenhuma compra selecionada', { variant: 'error' });
      return;
    }

    const purchaseValue = selectedPurchase.purchase_value
      ? parseFloat(selectedPurchase.purchase_value).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
      : 'R$ 0,00';

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir esta compra?\n\nCliente: ${
        selectedPurchase.project?.sale?.customer?.complete_name || 'N/A'
      }\nValor: ${purchaseValue}\nData: ${formatDate(selectedPurchase.purchase_date) || 'N/A'}`,
    );

    if (!confirmed) return;

    try {
      await purchaseService.delete(selectedPurchase.id);
      enqueueSnackbar('Compra excluída com sucesso', { variant: 'success' });
      fetchPurchases();
      setEditModalOpen(false);
      setSelectedPurchase(null);
    } catch (error) {
      console.error('Erro ao excluir compra:', error);
      enqueueSnackbar('Erro ao excluir compra', { variant: 'error' });
    }
  };

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target?.value, 10));
    setPage(0);
  }, []);

  return (
    <PageContainer title={'Compras'} description={'Dashboard de Compras'}>
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
            background: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
          }}
        >
          <Typography variant="h6" sx={{ width: '100%' }}>
            Indicadores
          </Typography>
          {/* {statusStats.map(({ key, label, value, icon, color, filter, format }) => {
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
          })} */}
        </Box>
      </Box>

      {/* <Box
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
          color={theme.palette.error.main}
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
      </Box> */}

      {/* Filtros */}
      <GenericFilterDrawer
        filters={filterConfig}
        initialValues={filters}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />

      {/* Tabela de Compras */}
      <TableHeader.Root>
        <TableHeader.Title
          title="Total"
          totalItems={totalRows}
          objNameNumberReference={totalRows === 1 ? 'Compra' : 'Compras'}
          loading={loading}
        />
        <TableHeader.Button
          buttonLabel="Nova Compra"
          icon={<Add />}
          onButtonClick={handleCreateNew}
          sx={{ width: 100 }}
        />
        <TableHeader.Button
          buttonLabel="Filtros"
          icon={<FilterAlt />}
          onButtonClick={() => {
            setFilterDrawerOpen(true);
          }}
          sx={{ width: 100, marginRight: 20 }}
        />
      </TableHeader.Root>

      <Table.Root
        data={purchases}
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
        <Table.Head columns={columns} onSort={handleSort} ordering={ordering} />
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

      <PurchaseEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
        }}
        purchase={selectedPurchase}
        onSave={fetchPurchases}
        onDelete={handleDelete}
      />

      <PurchaseCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={fetchPurchases}
      />
    </PageContainer>
  );
};

export default PurchaseDashboard;
