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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import { AddBoxRounded, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import formatDate from '@/utils/formatDate';
import financialRecordService from '@/services/financialRecordService';

import { FilterContext } from '@/context/FilterContext';

import AutoCompleteBeneficiary from "@/app/components/apps/financial-record/beneficiaryInput";
import AutoCompleteDepartment from "@/app/components/apps/financial-record/departmentInput";
import AutoCompleteCategory from "@/app/components/apps/financial-record/categoryInput";
import AutoCompleteProject from "@/app/components/apps/inspections/auto-complete/Auto-input-Project";
import FinancialRecordDetailDrawer from "@/app/components/apps/financial-record/detailDrawer";
import GenericFilterDrawer from "@/app/components/filters/GenericFilterDrawer";
import PulsingBadge from "@/app/components/shared/PulsingBadge";
import BlankCard from "@/app/components/shared/BlankCard";
import PageContainer from "@/app/components/container/PageContainer";
import SaleCards from "@/app/components/apps/inforCards/InforCards";
import TableSkeleton from "@/app/components/apps/comercial/sale/components/TableSkeleton";

const financialRecordList = () => {
  const router = useRouter();
  const { filters, setFilters } = useContext(FilterContext);
  const { enqueueSnackbar } = useSnackbar();
  const [financialRecordList, setFinancialRecordList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [financialRecordToDelete, setFinancialRecordToDelete] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [errorRequestsCount, setErrorRequestsCount] = useState(0);

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
          ...filters,
        });
        setFinancialRecordList(data.results);
        setTotalRows(data.meta.pagination.total_count);

        // Atualizar KPIs globais
        await fetchKPIs();
      } catch (err) {
        setError('Erro ao carregar Contas a Receber/Pagar');
      } finally {
        setLoading(false);
      }
    };

    const fetchKPIs = async () => {
      try {
        const kpiData = await financialRecordService.index({
          fields: 'value,responsible_status,payment_status,integration_code',
          ...filters,
        });

        setTotalRequests(kpiData.meta.pagination.total_count);
        setTotalAmount(kpiData.results.reduce((acc, item) => acc + parseFloat(item.value), 0));
        setInProgressCount(
          kpiData.results.filter(
            (item) => item.responsible_status === 'A' && item.payment_status === 'P',
          ).length,
        ); // Em Andamento
        // Solicitações com erro: status A, pagamento P e integration_code null
        setErrorRequestsCount(
          kpiData.results.filter(
            (item) =>
              item.responsible_status === 'A' &&
              item.payment_status === 'P' &&
              item.integration_code === null,
          ).length,
        );
      } catch (err) {
        setError('Erro ao carregar KPIs');
      }
    };

    fetchFinancialRecords();
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

  const financialRecordFilterConfig = [
    // **Informações Gerais**
    {
      key: 'client_supplier_code',
      label: 'Beneficiário (Omie)',
      type: 'custom',
      customComponent: AutoCompleteBeneficiary,
      customTransform: (value) =>
        value && typeof value === 'object' ? value.codigo_cliente : value,
    },
    {
      key: 'category_code__icontains',
      label: 'Categoria (Omie)',
      type: 'custom',
      customComponent: AutoCompleteCategory,
      customTransform: (value) => (value && typeof value === 'object' ? value.codigo : value),
    },

    // **Protocolos e Fatura**
    {
      key: 'protocol__in',
      label: 'Protocolo(s)',
      type: 'async-multiselect',
      endpoint: '/api/financial-records/',
      queryParam: 'protocol__icontains',
      extraParams: { fields: 'protocol,client_supplier_name' },
      mapResponse: (data) =>
        data.results.map((financialRecord) => ({
          label: `${financialRecord.protocol} - ${financialRecord.client_supplier_name}`,
          value: financialRecord.protocol,
        })),
    },
    { key: 'invoice_number__icontains', label: 'Número da Fatura (Contém)', type: 'text' },

    // **Status e Situação**
    {
      key: 'bug',
      label: 'Com Erro?',
      type: 'checkbox',
      inputType: 'checkbox',
      trueLabel: 'Com erro',
      falseLabel: 'Sem erro',
    },
    {
      key: 'status__in',
      label: 'Status',
      type: 'multiselect',
      options: [
        { label: 'Solicitada', value: 'S' },
        { label: 'Em Andamento', value: 'E' },
        { label: 'Paga', value: 'P' },
        { label: 'Cancelada', value: 'C' },
      ],
    },
    {
      key: 'payment_status__in',
      label: 'Status de Pagamento',
      type: 'multiselect',
      options: [
        { label: 'Paga', value: 'PG' },
        { label: 'Pendente', value: 'P' },
        { label: 'Cancelada', value: 'C' },
      ],
    },
    {
      key: 'responsible_status__in',
      label: 'Status do Responsável',
      type: 'multiselect',
      options: [
        { label: 'Aprovada', value: 'A' },
        { label: 'Pendente', value: 'P' },
        { label: 'Reprovada', value: 'R' },
      ],
    },

    // **Datas**
    {
      key: 'service_date__range',
      label: 'Serviço realizado entre',
      type: 'range',
      inputType: 'date',
    },
    { key: 'due_date__range', label: 'Vencimento entre', type: 'range', inputType: 'date' },
    { key: 'created_at__range', label: 'Criado entre', type: 'range', inputType: 'date' },
    {
      key: 'responsible_response_date__range',
      label: 'Aprovada entre',
      type: 'range',
      inputType: 'date',
    },
    { key: 'paid_at__range', label: 'Paga entre', type: 'range', inputType: 'date' },

    // **Valores**
    {
      key: 'value_range',
      label: 'Valor',
      type: 'number-range',
      subkeys: { min: 'value__gte', max: 'value__lte' },
    },

    // **Outros**
    { key: 'notes__icontains', label: 'Observação (Contém)', type: 'text' },
    {
      key: 'requester',
      label: 'Solicitante',
      type: 'async-autocomplete',
      endpoint: '/api/users/',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: 'complete_name,id' },
      mapResponse: (data) =>
        data.results.map((user) => ({ label: user.complete_name, value: user.id })),
    },
    {
      key: 'responsible',
      label: 'Gestor',
      type: 'async-autocomplete',
      endpoint: '/api/users/',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: 'complete_name,id' },
      mapResponse: (data) =>
        data.results.map((user) => ({ label: user.complete_name, value: user.id })),
    },
    { key: 'responsible_notes__icontains', label: 'Observação do Gestor (Contém)', type: 'text' },
    {
      key: 'project',
      label: 'Projeto (Cliente)',
      type: 'custom',
      customComponent: AutoCompleteProject,
      customTransform: (value) => (value && typeof value === 'object' ? value.id : value),
    },

    // **Departamentos**
    { key: 'requesting_department', label: 'Departamento Solicitante', type: 'text' },
    {
      key: 'department_code__icontains',
      label: 'Departamento Causador (Omie)',
      type: 'custom',
      customComponent: AutoCompleteDepartment,
      customTransform: (value) =>
        value && typeof value === 'object'
          ? { codigo: value.codigo, descricao: value.descricao }
          : value,
    },
  ];

  // Função para lidar com o clique nos KPIs e aplicar filtros,
  const handleKPIClick = (kpiType) => {
    let newFilters = {};

    switch (kpiType) {
      case 'inProgress':
        newFilters = {
          responsible_status__in: 'A,',
          payment_status__in: 'P,',
        };
        break;
      case 'error':
        newFilters = {
          bug: 'true',
        };
        break;
      case 'totalRequests':
        break;
      default:
        break;
    }

    setFilters(newFilters);
  };

  // Dados para os KPI cards usando o componente SaleCard
  const cardsData = [
    {
      backgroundColor: 'lightblue',
      iconColor: '#1976d2',
      IconComponent: AssignmentIcon,
      title: 'Solicitações',
      value: totalRequests,
      count: null,
      isCurrency: false,
      onClick: () => handleKPIClick('totalRequests'),
    },
    {
      backgroundColor: 'lightgreen',
      iconColor: '#2e7d32',
      IconComponent: AttachMoneyIcon,
      title: 'Valor Total',
      value: totalAmount,
      count: totalRequests,
      isCurrency: true,
      onClick: () => handleKPIClick('totalAmount'),
    },
    {
      backgroundColor: 'lightyellow',
      iconColor: '#ed6c02',
      IconComponent: AutorenewIcon,
      title: 'Em Andamento',
      value: inProgressCount,
      count: null,
      isCurrency: false,
      onClick: () => handleKPIClick('inProgress'),
    },
    {
      backgroundColor: 'lightcoral',
      iconColor: '#d32f2f',
      IconComponent: ErrorOutlineIcon,
      title: 'Erro',
      value: errorRequestsCount,
      count: null,
      isCurrency: false,
      onClick: () => handleKPIClick('error'),
      permission: 'financial.change_financialrecord',
    },
  ];

  const user = useSelector((state) => state.user?.user);
  const userPermissions = user?.permissions || user?.user_permissions || [];

  useEffect(() => {
    if (!userPermissions.includes('financial.add_financialrecord')) {
      enqueueSnackbar('Você não tem permissão para acessar essa página!', { variant: 'error' });
      router.push('/apps/commercial/sale');
    }
  }, [userPermissions, router]);

  return (
    <PageContainer title="Contas a Receber/Pagar" description="Lista de Contas a Receber/Pagar">
      <BlankCard>
        <CardContent>
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

          {/* Renderização dos KPIs utilizando o componente ProjectCards */}
          <SaleCards cardsData={cardsData} user_permissions={user.user_permissions} />

          <GenericFilterDrawer
            filters={financialRecordFilterConfig}
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
