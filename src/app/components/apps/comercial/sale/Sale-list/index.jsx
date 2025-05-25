'use client';
import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Box,
  TablePagination,
  Chip,
  Grid,
  useTheme,
} from '@mui/material';
import { AddBoxRounded, Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import saleService from '@/services/saleService';
import useSendContract from '@/hooks/clicksign/useClickSign';
import TableSkeleton from '../components/TableSkeleton';
import StatusPreSale from '../components/StatusPreSale';
import OnboardingCreateSale from '../Add-sale/onboarding';
import { useSelector } from 'react-redux';
import useSale from '@/hooks/sales/useSale';
import EditSaleTabs from '../Edit-sale';
import SideDrawer from '@/app/components/shared/SideDrawer';
import InforCards from '../../../inforCards/InforCards';
import {
  IconX,
  IconClock,
  IconCheckbox,
  IconRoute,
  IconUserX,
  IconFilter,
} from '@tabler/icons-react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatusChip from '@/utils/status/DocumentStatusIcon';
import ChipSigned from '@/utils/status/ChipSigned';
import PulsingBadge from '@/app/components/shared/PulsingBadge';
import TableSortLabel from '@/app/components/shared/TableSortLabel';
import CounterChip from '../CounterChip';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { FilterContext } from '@/context/FilterContext';

const SaleList = () => {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [openCreateSale, setOpenCreateSale] = useState(false);
  const [indicators, setIndicators] = useState({});

  const { handleRowClick, openDrawer, rowSelected, toggleDrawerClosed } = useSale();

  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);
  const activeCount = Object.keys(filters || {}).filter((key) => {
    const v = filters[key];
    return v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0);
  }).length;
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);

  const user = useSelector((state) => state?.user?.user);

  const userRole = {
    user: user?.id,
    role: user?.is_superusers ? 'Superuser' : user?.employee?.role?.name,
    branch: user?.employee?.branch?.id,
  };

  const {
    isSendingContract,
    error: errorContract,
    setError: setErrorContract,
    success: successContract,
    setSuccess: setSuccessContract,
  } = useSendContract();

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);

  const [proposalHTML, setProposalHTML] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderDirection, setOrderDirection] = useState('asc');

  const [open, setOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const router = useRouter();

  useEffect(() => {
    setPage(0);
    setSalesList([]);
  }, [order, orderDirection, filters, refresh]);

  const fetchSales = async () => {
    const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
    try {
      setLoading(true);

      const data = await saleService.index({
        userRole,
        ordering: orderingParam,
        limit: rowsPerPage,
        page: page + 1,
        expand: 'customer,branch,documents_under_analysis,projects',
        fields: 'id,documents_under_analysis,customer.complete_name,contract_number,signature_date,total_value,signature_status,is_pre_sale,status,final_service_opinion,is_released_to_engineering,created_at,branch.name,projects.journey_counter',
        ...filters,
      });

      setIndicators(data?.meta?.indicators);
      setSalesList(data?.results);
      setTotalRows(data?.meta?.pagination?.total_count);
      setIndicators(data?.meta?.indicators);
      setSalesList(data?.results);
      setTotalRows(data?.meta?.pagination?.total_count);
    } catch (err) {
      console.error('Erro ao carregar Vendas:', err);
      setError('Erro ao carregar Vendas');
      showAlert('Erro ao carregar Vendas', 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSales();
  }, [page, rowsPerPage, order, orderDirection, filters, refresh]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleEditClick = (id) => {
    router.push(`/apps/commercial/sale/${id}/update`);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSaleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await saleService.delete(saleToDelete);
      setSalesList(salesList.filter((item) => item.id !== saleToDelete));
      showAlert('Venda excluída com sucesso', 'success');
    } catch (err) {
      setError('Erro ao excluir a venda');
      showAlert('Erro ao excluir a venda', 'error');
      console.error('Erro ao excluir a venda:', err);
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProposalHTML('');
  };

  const handleSort = (field) => {
    if (order === field) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrder(field);
      setOrderDirection('asc');
    }
  };

  const theme = useTheme();

  const getBgColor = (counter, homologado) => {
    if (homologado) return theme.palette.success.main;
    const ratio = Math.min(counter, 40) / 40;
    const hue = (1 - ratio) * 120;
    return `hsl(${hue}, 100%, 40%)`;
  };

  return (
    <Box>
      <Accordion defaultExpanded sx={{ marginBottom: 4 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="sale-cards-content"
          id="sale-cards-header"
        >
          <Typography variant="h6">
            Total
            <Chip
              sx={{ marginLeft: 1 }}
              label={Number(indicators?.total_value_sum || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <InforCards
            cardsData={[
              {
                backgroundColor: 'primary.light',
                iconColor: 'primary.main',
                IconComponent: IconRoute,
                title: 'Em andamento',
                onClick: () => setFilters({ ...filters, status__in: 'EA' }),
                value: indicators?.pending_total_value || 0,
                count: indicators?.pending_count || '-',
              },
              {
                backgroundColor: 'success.light',
                iconColor: 'success.main',
                IconComponent: IconCheckbox,
                title: 'Finalizado',
                onClick: () => setFilters({ ...filters, status__in: 'F' }),
                value: indicators?.finalized_total_value || 0,
                count: indicators?.finalized_count || '-',
              },
              {
                backgroundColor: 'secondary.light',
                iconColor: 'secondary.main',
                IconComponent: IconClock,
                title: 'Pendente',
                onClick: () => setFilters({ ...filters, status__in: 'P' }),
                value: indicators?.pending_total_value || 0,
                count: indicators?.pending_count || '-',
              },
              {
                backgroundColor: 'warning.light',
                iconColor: 'warning.main',
                IconComponent: IconX,
                title: 'Cancelado',
                onClick: () => setFilters({ status__in: 'C' }),
                value: indicators?.canceled_total_value || 0,
                count: indicators?.canceled_count || '-',
              },
              {
                backgroundColor: 'warning.light',
                iconColor: 'warning.main',
                IconComponent: IconUserX,
                title: 'Distrato',
                onClick: () => setFilters({ status__in: 'D' }),
                value: indicators?.terminated_total_value || 0,
                count: indicators?.terminated_count || '-',
              },
            ]}
          />
        </AccordionDetails>
      </Accordion>

      <Typography variant="h6" gutterBottom>
        Lista de Vendas
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          sx={{ marginTop: 1, marginBottom: 2 }}
          onClick={() => setOpenCreateSale(true)}
        >
          Adicionar Venda
        </Button>
        <Grid container xs={2} justifyContent="flex-end" alignItems="center">
          {activeCount > 0 && (
            <Chip
              label={`${activeCount} filtro${activeCount > 1 ? 's' : ''} ativo${activeCount > 1 ? 's' : ''
                }`}
              onDelete={clearFilters}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          <Button
            variant="outlined"
            startIcon={<IconFilter />}
            sx={{ marginTop: 1, marginBottom: 2 }}
            onClick={() => {
              setOpenFilterDrawer(true);
            }}
          >
            Filtros
          </Button>
          <GenericFilterDrawer
            open={openFilterDrawer}
            filters={filterConfig}
            initialValues={filters}
            onApply={(newFilters) => {
              setFilters(newFilters);
              setOpenFilterDrawer(false);
            }}
            onClose={() => setOpenFilterDrawer(false)}
            setFilters={setFilters}
          />
        </Grid>
      </Box>

      <Box>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doc.</TableCell>
                <TableCell>Contador</TableCell>
                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    label="Nome contratante"
                    orderBy={order}
                    headCell="customer.complete_name"
                    onRequestSort={() => handleSort('customer.complete_name')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    label="Número de contrato"
                    orderBy={order}
                    headCell="contract_number"
                    onRequestSort={() => handleSort('contract_number')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell
                  sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('status')}
                >
                  <TableSortLabel
                    label="Status da Venda"
                    orderBy={order}
                    headCell="status"
                    onRequestSort={() => handleSort('status')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    label="Data de Assinatura"
                    orderBy={order}
                    headCell="signature_date"
                    onRequestSort={() => handleSort('signature_date')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    label=" Valor Total (R$)"
                    orderBy={order}
                    headCell="total_value"
                    onRequestSort={() => handleSort('total_value')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    label="Status da Assinatura"
                    orderBy={order}
                    headCell="signature_status"
                    onRequestSort={() => handleSort('signature_status')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    label="Venda / Pré-venda"
                    orderBy={order}
                    headCell="is_pre_sale"
                    onRequestSort={() => handleSort('is_pre_sale')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    label="Parecer da Vistoria"
                    orderBy={order}
                    headCell="final_service_opinion"
                    onRequestSort={() => handleSort('final_service_opinion')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    label="Liberado p/Engenharia"
                    orderBy={order}
                    headCell="is_released_to_engineering"
                    onRequestSort={() => handleSort('is_released_to_engineering')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <TableSortLabel
                    label="Data de Criação"
                    orderBy={order}
                    headCell="created_at"
                    onRequestSort={() => handleSort('created_at')}
                    orderDirection={orderDirection}
                  />
                </TableCell>

                <TableCell>
                  <TableSortLabel
                    label="Unidade"
                    orderBy={order}
                    headCell="branch.name"
                    onRequestSort={() => handleSort('branch.name')}
                    orderDirection={orderDirection}
                  />
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableSkeleton rows={rowsPerPage} columns={12} />
              ) : error && page === 1 ? (
                <Typography color="error">{error}</Typography>
              ) : (
                (salesList || []).map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    hover
                    sx={{ backgroundColor: rowSelected?.id === item.id && '#cecece' }}
                  >
                    <TableCell align="center">
                      {item.documents_under_analysis?.length > 0 && (
                        <PulsingBadge color="#FFC008" />
                      )}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(item.projects) && item.projects.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {item.projects.map((project) => {
                            const bg = getBgColor(project.journey_counter || 0, item.is_homologated);
                            return (
                              <Chip
                                key={project.id}
                                label={`${project.journey_counter || 0} dias`}
                                size="small"
                                sx={{
                                  bgcolor: bg,
                                  color: theme.palette.getContrastText(bg),
                                }}
                              />
                            );
                          })}
                        </Box>
                      ) : (
                        <Chip label="-" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>{item.customer.complete_name}</TableCell>
                    <TableCell>{item.contract_number}</TableCell>
                    <TableCell>
                      <StatusChip status={item.status} />
                    </TableCell>
                    <TableCell>
                      {item.signature_date
                        ? new Date(item.signature_date).toLocaleString()
                        : 'Sem contrato assinado'}
                    </TableCell>
                    <TableCell>
                      {Number(item.total_value).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell>{<ChipSigned status={item?.signature_status} />}</TableCell>
                    <TableCell>
                      <StatusPreSale status={item.is_pre_sale} />
                    </TableCell>
                    <TableCell>
                      {Array.isArray(item.final_service_opinion) &&
                        item.final_service_opinion[0].name ? (
                        <Chip
                          label={item.final_service_opinion[0].name}
                          color={
                            item.final_service_opinion[0].name.toLowerCase().includes('aprovado')
                              ? 'success'
                              : 'default'
                          }
                        />
                      ) : (
                        <Chip label="Sem P.F" color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          item.is_released_to_engineering === true ? 'Liberado' : 'Não-Liberado'
                        }
                        color={item.is_released_to_engineering === true ? 'success' : 'default'}
                        icon={
                          item.is_released_to_engineering === true ? <LockOpenIcon /> : <LockIcon />
                        }
                      />
                    </TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleString() || '-'}</TableCell>
                    <TableCell>{item.branch.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
      </Box>

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir esta venda? Esta ação não pode ser desfeita.
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

      <Dialog open={errorContract !== null} onClose={() => setErrorContract(null)}>
        <DialogTitle>Erro ao enviar contrato</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorContract}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorContract(null)} color="success">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successContract !== null} onClose={() => setSuccessContract(null)}>
        <DialogTitle>Contrato</DialogTitle>
        <DialogContent>
          <DialogContentText>O contrato foi enviado com sucesso.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessContract(null)} color="success">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Proposta Gerada</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: proposalHTML }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCreateSale}
        onClose={() => setOpenCreateSale(false)}
        fullWidth
        maxWidth="lg"
      >
        <OnboardingCreateSale onClose={() => setOpenCreateSale(false)} onEdit={handleEditClick} />
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSendingContract}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Enviando Contrato...
        </Typography>
      </Backdrop>
      <SideDrawer
        open={openDrawer}
        onClose={() => toggleDrawerClosed(false)}
        title="Detalhamento da Venda"
      >
        <EditSaleTabs saleId={rowSelected?.id} onRefresh={fetchSales} />
      </SideDrawer>
    </Box>
  );
};

export default SaleList;
