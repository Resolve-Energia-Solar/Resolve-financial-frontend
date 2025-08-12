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
  Search,
} from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { Chip, Tooltip, Box, Typography, useTheme, TextField, InputAdornment } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { formatDate, formatDateBR } from '@/utils/dateUtils';
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
  const [paginationLoading, setPaginationLoading] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

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
    // Se não é uma mudança de paginação, usar loading geral
    if (!paginationLoading) {
      setLoading(true);
    }

    try {
      const params = {
        expand: 'project,project.sale.customer,project.product,supplier',
        fields:
          'id,purchase_date,status,purchase_value,delivery_forecast,delivery_number,project,project.sale.customer.complete_name,project.product.name,project.address,supplier,supplier.complete_name,project.id,supplier.id',
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
        ...(searchTerm && { q: searchTerm }),
      };

      const response = await purchaseService.index(params);

      setPurchases(response.results);
      setTotalRows(response.meta.pagination.total_count);
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
      enqueueSnackbar('Erro ao carregar compras', { variant: 'error' });
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  }, [page, rowsPerPage, filters, searchTerm, paginationLoading, enqueueSnackbar]);

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

  // useEffect principal para carregar dados
  useEffect(() => {
    fetchPurchases();
    fetchIndicators();
  }, [refresh, filters, page, rowsPerPage, searchTerm]);

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Compras' }];

  const columns = [
    {
      field: 'purchase_date',
      headerName: 'Data da Compra',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {formatDateBR(row.purchase_date)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'project',
      headerName: 'Cliente',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {row.project?.sale?.customer?.complete_name || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'product',
      headerName: 'Produto',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.project.product.name || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'purchase_value',
      headerName: 'Valor',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: theme.palette.success.main,
              fontSize: '0.95rem',
            }}
          >
            {formatToBRL(row.purchase_value || 0)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'delivery_forecast',
      headerName: 'Previsão de Entrega',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.delivery_forecast ? formatDateBR(row.delivery_forecast) : '-'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (row) => {
        const statusConfig = {
          R: { label: 'Realizada', color: 'success', bgColor: theme.palette.success.light },
          C: { label: 'Cancelada', color: 'error', bgColor: theme.palette.error.light },
          D: { label: 'Distrato', color: 'warning', bgColor: theme.palette.warning.light },
          A: { label: 'Aguardando Pagamento', color: 'info', bgColor: theme.palette.info.light },
          P: { label: 'Pendente', color: 'default', bgColor: theme.palette.grey[300] },
          F: {
            label: 'Aguardando Entrega',
            color: 'secondary',
            bgColor: theme.palette.secondary.light,
          },
        };

        const config = statusConfig[row.status] || {
          label: row.status,
          color: 'default',
          bgColor: theme.palette.grey[300],
        };

        return (
          <Chip
            label={config.label}
            size="small"
            sx={{
              backgroundColor: config.bgColor,
              color: theme.palette.getContrastText(config.bgColor),
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        );
      },
    },
    {
      field: 'supplier',
      headerName: 'Fornecedor',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.supplier?.complete_name || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'address',
      headerName: 'Endereço',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem' }}
          >
            {row.project?.address || '-'}
          </Typography>
        </Box>
      ),
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

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(searchInput);
    setPage(0); // Reset para primeira página quando buscar
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleSearchBlur = () => {
    handleSearchSubmit();
  };

  // const handleDelete = async () => {
  //   if (!selectedPurchase?.id) {
  //     console.error('Nenhuma compra selecionada ou ID não encontrado');
  //     enqueueSnackbar('Erro: Nenhuma compra selecionada', { variant: 'error' });
  //     return;
  //   }

  //   const purchaseValue = selectedPurchase.purchase_value
  //     ? parseFloat(selectedPurchase.purchase_value).toLocaleString('pt-BR', {
  //         style: 'currency',
  //         currency: 'BRL',
  //       })
  //     : 'R$ 0,00';

  //   const confirmed = window.confirm(
  //     `Tem certeza que deseja excluir esta compra?\n\nCliente: ${
  //       selectedPurchase.project?.sale?.customer?.complete_name || 'N/A'
  //     }\nValor: ${purchaseValue}\nData: ${formatDateBR(selectedPurchase.purchase_date) || 'N/A'}`,
  //   );

  //   if (!confirmed) return;

  //   try {
  //     await purchaseService.delete(selectedPurchase.id);
  //     enqueueSnackbar('Compra excluída com sucesso', { variant: 'success' });
  //     fetchPurchases();
  //     setEditModalOpen(false);
  //     setSelectedPurchase(null);
  //   } catch (error) {
  //     console.error('Erro ao excluir compra:', error);
  //     enqueueSnackbar('Erro ao excluir compra', { variant: 'error' });
  //   }
  // };

  const handlePageChange = useCallback((event, newPage) => {
    setPaginationLoading(true); // Ativar loading específico da paginação
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setPaginationLoading(true); // Ativar loading específico da paginação
    setRowsPerPage(parseInt(event.target?.value, 10));
    setPage(0);
  }, []);

  return (
    <PageContainer title={'Compras'} description={'Dashboard de Compras'}>
      <Breadcrumb items={BCrumb} />

      {/* Header da página */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderRadius: 2,
          p: 3,
          mb: 3,
          color: 'white',
          boxShadow: theme.shadows[4],
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Gestão de Compras
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Gerencie todas as compras do sistema de forma eficiente
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                minWidth: 120,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {totalRows}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {totalRows === 1 ? 'Compra' : 'Compras'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Indicadores */}
      {/* <Box sx={{ width: '100%', mb: 2 }}>
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
      </Box> */}

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

      {/* Controles e Busca */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: 2,
          p: 3,
          mb: 3,
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
            <TextField
              placeholder="Buscar compras por cliente, fornecedor, número..."
              value={searchInput}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              onBlur={handleSearchBlur}
              size="small"
              sx={{
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TableHeader.Button
              buttonLabel="Filtros Avançados"
              icon={<FilterAlt />}
              onButtonClick={() => {
                setFilterDrawerOpen(true);
              }}
              sx={{
                background: theme.palette.grey[100],
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  background: theme.palette.grey[200],
                },
              }}
            />
            <TableHeader.Button
              buttonLabel="Nova Compra"
              icon={<Add />}
              onButtonClick={handleCreateNew}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                color: 'white',
                boxShadow: theme.shadows[2],
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                  boxShadow: theme.shadows[4],
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Tabela de Compras */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.divider}`,
          minHeight: 400,
        }}
      >
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                border: `3px solid ${theme.palette.primary.light}`,
                borderTop: `3px solid ${theme.palette.primary.main}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Carregando compras...
            </Typography>
          </Box>
        )}

        {!loading && purchases.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.grey[200]} 0%, ${theme.palette.grey[300]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Search sx={{ fontSize: 40, color: theme.palette.grey[500] }} />
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Nenhuma compra encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {searchTerm || Object.keys(filters).length > 0
                ? 'Tente ajustar os filtros ou termos de busca'
                : 'Comece criando sua primeira compra'}
            </Typography>
          </Box>
        )}
        {!loading && purchases.length > 0 && (
          <Box sx={{ position: 'relative' }}>
            {paginationLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    border: `3px solid ${theme.palette.primary.light}`,
                    borderTop: `3px solid ${theme.palette.primary.main}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              </Box>
            )}
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
              loading={paginationLoading}
            >
              <Table.Head columns={columns} onSort={handleSort} ordering={ordering} />
              <Table.Body
                loading={loading || paginationLoading}
                columns={columns.length}
                onRowClick={handleRowClick}
                sx={{
                  cursor: 'pointer',
                  '& tr:hover': {
                    backgroundColor: theme.palette.action.hover,
                    transform: 'translateY(-1px)',
                    boxShadow: theme.shadows[2],
                    transition: 'all 0.2s ease-in-out',
                  },
                  '& tr': {
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                {columns.map((col) => (
                  <Table.Cell key={col.field} render={col.render} sx={col.sx} />
                ))}
              </Table.Body>
              <Table.Pagination
                disabled={paginationLoading}
                sx={{
                  opacity: paginationLoading ? 0.6 : 1,
                  pointerEvents: paginationLoading ? 'none' : 'auto',
                }}
              />
            </Table.Root>
          </Box>
        )}
      </Box>
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
        // onDelete={handleDelete}
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
