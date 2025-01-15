import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Skeleton,
  useTheme,
  FormControl,
  TextField,
  CircularProgress,
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility, Add } from '@mui/icons-material';
import PaymentChip from '../PaymentChip';
import paymentService from '@/services/paymentService';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import EditInvoicePage from '../../Edit-invoice';
import DetailInvoicePage from '../../Invoice-detail';
import CreateInvoice from '../../Add-invoice';
import saleService from '@/services/saleService';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}));

const PaymentCard = ({ sale = null }) => {
  const theme = useTheme();
  const router = useRouter();

  const [paymentsList, setPaymentsList] = useState([]);
  const [saleData, setSaleData] = useState(null);
  const [originalTotalValue, setOriginalTotalValue] = useState(0);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [invoiceToView, setInvoiceToView] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [majoracao, setMajoracao] = useState(0);
  const [desconto, setDesconto] = useState(0);

  const [isMajoracaoDisabled, setIsMajoracaoDisabled] = useState(false);
  const [isDescontoDisabled, setIsDescontoDisabled] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleUpdateSaleValue = async () => {
    try {
      const baseValue = originalTotalValue;

      console.log('Updating sale value with:', {
        baseValue,
        majoracao,
        desconto,
      });

      // Passa o valor de majoracao diretamente (sem a necessidade de %)
      await saleService.updateSaleValue(sale, baseValue, majoracao, desconto);

      const data = await saleService.getTotalPaidSales(sale);
      setSaleData(data);

      const numericValue = Number(data.total_value || 0);
      setOriginalTotalValue(numericValue);

      setMajoracao(0); // Resetar o valor da majoração após a atualização
      setDesconto(0); // Resetar o valor do desconto após a atualização
      setIsMajoracaoDisabled(false);
      setIsDescontoDisabled(false);

      handleRefresh();
    } catch (err) {
      console.log('Erro ao atualizar o valor da venda: ', err);
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await paymentService.getPaymentsBySale(sale);
        setPaymentsList(response.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSaleData = async () => {
      try {
        const data = await saleService.getTotalPaidSales(sale);
        setSaleData(data);
        const numericValue = Number(data.total_value || 0);
        setOriginalTotalValue(numericValue);
      } catch (err) {
        setError('Erro ao carregar a venda');
      } finally {
        setLoading(false);
      }
    };

    if (sale) {
      fetchPayments();
      fetchSaleData();
    }
  }, [sale, refresh]);

  const valorMajoracao = majoracao;
  const valorDesconto = desconto;
  const totalCalculado = originalTotalValue + valorMajoracao - valorDesconto;

  const handleAddPayment = () => {
    setCreateModalOpen(true);
  };

  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
  };

  const handleEditClick = (id) => {
    setInvoiceToEdit(id);
    setEditModalOpen(true);
  };

  const handleDetailClick = (id) => {
    setInvoiceToView(id);
    setDetailModalOpen(true);
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setInvoiceToDelete(id);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await paymentService.deletePayment(invoiceToDelete);
      setPaymentsList((prev) => prev.filter((payment) => payment.id !== invoiceToDelete));
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <Box
        mb={4}
        mt={8}
        display="flex"
        flexDirection="row"
        gap={3}
       
        alignItems="center"
       
      >
        <FormControl sx={{ minWidth: 120 }}>
          <TextField
            id="majoracao"
            label="Majoração"
            type="number"
            value={majoracao}
            onChange={(e) => setMajoracao(Number(e.target.value) || 0)}
            disabled={isMajoracaoDisabled}
            inputProps={{ min: 0 }}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: '#f8f8f8',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
            helperText={
              majoracao
                ? Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    majoracao,
                  )
                : ''
            }
          />
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <TextField
            id="desconto"
            label="Desconto"
            type="number"
            value={desconto}
            onChange={(e) => setDesconto(Number(e.target.value) || 0)}
            disabled={isDescontoDisabled}
            inputProps={{ min: 0 }}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: '#f8f8f8',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
            helperText={
              desconto
                ? Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    desconto,
                  )
                : ''
            }
          />
        </FormControl>

        <Box alignSelf="center">
          <Button
            variant="contained"
            onClick={handleUpdateSaleValue}
            sx={{
              backgroundColor: '#1a90ff',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#1573e6',
              },
              borderRadius: '8px',
              padding: '12px 25px',
              fontWeight: '600',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={15} sx={{ color: '#fff' }} /> : 'Atualizar Valor'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={10}
            onClick={handleCreateClick}
            sx={{
              cursor: 'pointer',
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CardContent>
              <Add fontSize="large" color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                Adicionar Pagamento
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {loading
          ? [...Array(3)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={10}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 2 }} />
                  </CardContent>
                  <CardActions disableSpacing>
                    <Skeleton variant="circular" width={24} height={24} />
                  </CardActions>
                </Card>
              </Grid>
            ))
          : paymentsList.map((payment) => {
              const progressValue = payment?.percentual_paid * 100 || 0;

              return (
                <Grid item xs={12} sm={6} md={4} key={payment.id}>
                  <Card elevation={10}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography fontSize="14px" color="text.secondary">
                            {payment?.installments?.length}x parcelas
                          </Typography>
                          <Typography fontSize="14px">
                            {Number(payment?.value).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </Typography>
                        </Box>
                        <PaymentChip paymentType={payment.payment_type} />
                      </Box>
                      <Box mt={2}>
                        <Typography variant="caption" color="text.secondary" fontSize="12px">
                          {progressValue}% Pago
                        </Typography>
                        <BorderLinearProgress
                          variant="determinate"
                          value={progressValue}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </CardContent>
                    <CardActions disableSpacing>
                      <Tooltip title="Ações">
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuClick(event, payment.id)}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={menuOpenRowId === payment.id}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleDetailClick(payment.id);
                            handleMenuClose();
                          }}
                        >
                          <Visibility fontSize="small" sx={{ mr: 1 }} />
                          Visualizar
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleEditClick(payment.id);
                            handleMenuClose();
                          }}
                        >
                          <Edit fontSize="small" sx={{ mr: 1 }} />
                          Editar
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleDeleteClick(payment.id);
                            handleMenuClose();
                          }}
                        >
                          <Delete fontSize="small" sx={{ mr: 1 }} />
                          Excluir
                        </MenuItem>
                      </Menu>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
      </Grid>

      {sale && (
        <Box p={3} backgroundColor="primary.light" mt={3}>
          <Box display="flex" justifyContent="flex-end" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="end" gap={2}>
              <Typography variant="body1" fontWeight={600}>
                Pago:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(saleData?.total_paid || 0)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="end" gap={2}>
              <Typography variant="body1" fontWeight={600}>
                Valor da Majoração:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(valorMajoracao)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="end" gap={2}>
              <Typography variant="body1" fontWeight={600}>
                Valor do Desconto:
              </Typography>
              <Typography variant="body1" fontWeight={600} color="error">
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(valorDesconto)}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="end" gap={2}>
              <Typography variant="body1" fontWeight={600}>
                Total a Pagar:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalCalculado)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Adicionar Pagamento</DialogTitle>
        <DialogContent>
          <CreateInvoice
            sale={sale}
            onClosedModal={() => setCreateModalOpen(false)}
            onRefresh={handleRefresh}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Excluir */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmação de Exclusão</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja excluir esta fatura? Esta ação não pode ser desfeita.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Fatura</DialogTitle>
        <DialogContent>
          <EditInvoicePage
            payment_id={invoiceToEdit}
            onClosedModal={() => setEditModalOpen(false)}
            onRefresh={handleRefresh}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <DetailInvoicePage payment_id={invoiceToView} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailModalOpen(false)} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentCard;
