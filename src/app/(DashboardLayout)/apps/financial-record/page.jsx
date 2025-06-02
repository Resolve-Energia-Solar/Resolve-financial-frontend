'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

import {
  Box,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';

import { AddBoxRounded, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { formatDate } from '@/utils/dateUtils';
import financialRecordService from '@/services/financialRecordService';

import { FilterContext } from '@/context/FilterContext';

import FinancialRecordDetailDrawer from "@/app/components/apps/financial-record/detailDrawer";
import GenericFilterDrawer from "@/app/components/filters/GenericFilterDrawer";
import PulsingBadge from "@/app/components/shared/PulsingBadge";
import BlankCard from "@/app/components/shared/BlankCard";
import PageContainer from "@/app/components/container/PageContainer";
import filterConfig from './filterConfig';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { KPICard } from '@/app/components/charts/KPICard';

const financialRecordList = () => {
  const router = useRouter();
  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);
  const { enqueueSnackbar } = useSnackbar();
  const [financialRecordList, setFinancialRecordList] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [financialRecordToDelete, setFinancialRecordToDelete] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const theme = useTheme();

  const stats = [
    {
      key: 'total_records',
      label: 'Total de registros',
      value: indicators?.total_records,
      icon: <InsertDriveFileIcon />,
      color: '#e3f2fd',
      filter: {},
      format: v => v.toLocaleString('pt-BR'),
    },
    {
      key: 'total_value',
      label: 'Valor total',
      value: indicators?.total_value,
      icon: <MonetizationOnIcon />,
      color: '#e8f5e9',
      filter: {},
      format: v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
    {
      key: 'total_in_progress',
      label: 'Em andamento',
      value: indicators?.total_in_progress,
      icon: <HourglassEmptyIcon />,
      color: '#fff3e0',
      filter: { responsible_status__in: 'A', payment_status__in: 'P' },
      format: v => v.toLocaleString('pt-BR'),
    },
    {
      key: 'total_with_error',
      label: 'Com erro',
      value: indicators?.total_with_error,
      icon: <ErrorOutlineIcon />,
      color: '#ffebee',
      filter: { bug: true },
      format: v => v.toLocaleString('pt-BR'),
    },
  ];

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchFinancialRecords = async () => {
      try {
        setLoading(true);
        const data = await financialRecordService.index({
          limit: rowsPerPage,
          page: page + 1,
          // fields: "protocol,client_supplier_name,value,due_date,status,paid_at",
          expand: 'bank_details',
          ...filters,
        });
        setFinancialRecordList(data.results);
        setTotalRows(data.meta.pagination.total_count);
      } catch (err) {
        setError('Erro ao carregar Contas a Receber/Pagar');
      } finally {
        setLoading(false);
      }
    };
    fetchFinancialRecords();

    const fetchKPIs = async () => {
      setLoadingIndicators(true);
      try {
        const kpiData = await financialRecordService.getIndicators({
          ...filters,
        });
        setIndicators(kpiData.indicators);
      } catch (err) {
        setError('Erro ao carregar KPIs');
      } finally {
        setLoadingIndicators(false);
      }
    };
    fetchKPIs();
  }, [filters, rowsPerPage, page]);

  const handleCreateClick = () => {
    router.push('/apps/financial-record/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/financial-record/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setFinancialRecordToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setFinancialRecordToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await financialRecordService.delete(financialRecordToDelete);
      setFinancialRecordList(
        financialRecordList.filter((item) => item.id !== financialRecordToDelete),
      );
      console.log('Conta a Receber/Pagar excluído com sucesso');
    } catch (err) {
      setError('Erro ao excluir o Conta a Receber/Pagar');
      console.error('Erro ao excluir o Conta a Receber/Pagar', err);
    } finally {
      handleCloseModal();
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'S':
        return 'Solicitada';
      case 'E':
        return 'Em Andamento';
      case 'P':
        return 'Paga';
      case 'C':
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedRecord(null);
  };

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

  const user = useSelector((state) => state.user?.user);
  const userPermissions = user?.permissions || user?.user_permissions || [];

  useEffect(() => {
    if (!userPermissions.includes('financial.add_financialrecord')) {
      enqueueSnackbar('Você não tem permissão para acessar essa página!', { variant: 'error' });
      router.push('/apps/project');
    }
  }, [userPermissions, router]);

  return (
    <PageContainer title="Contas a Receber/Pagar" description="Lista de Contas a Receber/Pagar">
      <BlankCard>
        <CardContent>
          {/* Indicadores */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="h6">Indicadores</Typography>
            <Box sx={{
              width: '100%', display: 'flex', justifyContent: 'space-evenly', gap: 2, flexWrap: 'wrap', mt: 1, mb: 4, p: 2, background: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5'
            }}>
              {stats.map(({ key, label, value, icon, color, filter, format }) => {
                const isActive = filters && Object.keys(filters).some((filterKey) => filterKey in filter);
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

          <Typography variant="h6" gutterBottom>
            Lista de Contas a Receber/Pagar
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            {userPermissions.includes('financial.add_financialrecord') && (
              <Button
                variant="outlined"
                startIcon={<AddBoxRounded />}
                sx={{ mt: 1, mb: 2 }}
                onClick={handleCreateClick}
              >
                Criar Conta a Receber/Pagar
              </Button>
            )}
            <Button
              variant="outlined"
              sx={{ mt: 1, mb: 2 }}
              onClick={() => setFilterDrawerOpen(true)}
            >
              Abrir Filtros
            </Button>
          </Box>

          <GenericFilterDrawer
            filters={filterConfig}
            initialValues={filters}
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            onApply={(newFilters) => setFilters(newFilters)}
          />

          {loading ? (
            <Typography>Carregando...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table aria-label="table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Protocolo</TableCell>
                    <TableCell>Beneficiário</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Data de Vencimento</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {financialRecordList.map((item) => (
                    <TableRow key={item.id} hover onClick={() => handleRowClick(item)}>
                      <TableCell>
                        {item.paid_at &&
                          new Date(item.paid_at).getFullYear() === new Date().getFullYear() &&
                          new Date(item.paid_at).getMonth() === new Date().getMonth() &&
                          new Date(item.paid_at).getDate() === new Date().getDate() ? (
                          <PulsingBadge />
                        ) : (
                          <>
                            {item.paid_at && new Date() - new Date(item.paid_at) > 86400000 ? (
                              <PulsingBadge noPulse />
                            ) : (
                              <>
                                {item.responsible_status === 'A' &&
                                  item.payment_status === 'P' &&
                                  item.integration_code === null && (
                                    <PulsingBadge color="#FF2C2C" />
                                  )}
                                {item.responsible_status === 'P' &&
                                  item.payment_status !== 'PG' &&
                                  user.id === item.responsible.id && (
                                    <PulsingBadge color="#FFC008" />
                                  )}
                              </>
                            )}
                          </>
                        )}
                      </TableCell>
                      <TableCell>{item.protocol}</TableCell>
                      <TableCell>{item.client_supplier_name}</TableCell>
                      <TableCell>
                        R${' '}
                        {parseFloat(item.value).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>{formatDate(item.due_date)}</TableCell>
                      <TableCell>{getStatusLabel(item.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Linhas por página"
          />

          {/* Legenda explicativa */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
              <strong>Legenda</strong>
            </Typography>
            <Table
              sx={{
                mt: 2,
                tableLayout: 'fixed',
                fontSize: '0.75rem',
                width: 'min-content',
                textWrap: 'nowrap',
              }}
              aria-label="Legenda"
            >
              <TableBody>
                <TableRow>
                  <TableCell sx={{ padding: '4px' }}>
                    <PulsingBadge noPulse />
                  </TableCell>
                  <TableCell sx={{ padding: '4px' }}>
                    :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Solicitação paga.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ padding: '4px' }}>
                    <PulsingBadge />
                  </TableCell>
                  <TableCell sx={{ padding: '4px' }}>
                    :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Solicitação paga hoje.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ padding: '4px' }}>
                    <PulsingBadge color="#FF2C2C" />
                  </TableCell>
                  <TableCell sx={{ padding: '4px' }}>
                    :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Solicitação com Erro
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ padding: '4px' }}>
                    <PulsingBadge color="#FFC008" />
                  </TableCell>
                  <TableCell sx={{ padding: '4px' }}>
                    :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Pendente de sua aprovação
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </BlankCard>

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este Conta a Receber/Pagar? Esta ação não pode ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <FinancialRecordDetailDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        record={selectedRecord}
      />
    </PageContainer>
  );
};

export default financialRecordList;
