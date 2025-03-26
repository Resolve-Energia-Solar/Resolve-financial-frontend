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
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility, Add, Error, CheckCircle } from '@mui/icons-material';
import PaymentChip from '../PaymentChip';
import paymentService from '@/services/paymentService';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import EditInvoicePage from '../../Edit-invoice';
import DetailInvoicePage from '../../Invoice-detail';
import CreateInvoice from '../../Add-invoice';
import saleService from '@/services/saleService';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomFieldMoney from '../CustomFieldMoney';
import { IconDeviceFloppy } from '@tabler/icons-react';

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

  const [productValue, setProductValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [errorValue, setErrorValue] = useState(null);
  const [loadingValue, setLoadingValue] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
        const data = await saleService.getSaleById(sale);
        setSaleData(data);

        const calculatedValue = data.sale_products
          .map((product) => parseFloat(product.value))
          .reduce((a, b) => a + b, 0);

        console.log('calculatedValue', calculatedValue);
        setProductValue(calculatedValue);
        setTotalValue(data.total_value);
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

  const saveSaleTotalValue = async () => {
    setErrorValue(null);
    setLoadingValue(true);
    try {
      await saleService.updateSalePartial(sale, {
        total_value: totalValue,
      });
      handleRefresh();
    } catch (error) {
      setErrorValue('Erro ao atualizar o valor da venda');
      console.log('Error: ', error);
    } finally {
      setLoadingValue(false);
    }
  };

  console.log('totalValue', totalValue);

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
      {saleData && saleData.is_pre_sale && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <CustomFormLabel htmlFor="valor">Valor da Venda</CustomFormLabel>
          <Stack direction="row" spacing={2} alignItems="center">
            <CustomFieldMoney
              value={totalValue}
              onChange={(value) => setTotalValue(value)}
              {...(errorValue && { error: true, helperText: errorValue })}
            />
            <Button
              variant="contained"
              onClick={async () => {
                await saveSaleTotalValue();
                setSnackbarOpen(true);
              }}
              disabled={loadingValue}
              endIcon={loadingValue ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loadingValue ? 'Atualizando' : 'Atualizar'}
            </Button>
          </Stack>
        </Box>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ height: '100%' }}>
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
          </Box>
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
                Valor do produto:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(productValue)}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="end" gap={2}>
              <Typography variant="body1" fontWeight={600}>
                Majoração:
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                color={saleData?.total_value > productValue ? 'success.main' : 'inherit'}
              >
                {saleData?.total_value > productValue
                  ? `+ ${Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(saleData?.total_value - productValue)}`
                  : '-'}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="end" gap={2}>
              <Typography variant="body1" fontWeight={600}>
                Desconto:
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                color={saleData?.total_value < productValue ? 'error.main' : 'inherit'}
              >
                {saleData?.total_value < productValue
                  ? `- ${Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(productValue - (saleData?.total_value || 0))}`
                  : '-'}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="flex-end" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="end" gap={2}>
              <Typography variant="body1" fontWeight={600}>
                Valor da venda:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(saleData?.total_value)}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" justifyContent="end" gap={2}>
            <Typography variant="body1" fontWeight={600}>
              Valor pago:
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(saleData?.total_paid)}{' '}
              ({((saleData?.total_paid / saleData?.total_value) * 100).toFixed(2)}%)
            </Typography>
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
        <DialogTitle>Editar Pagamento</DialogTitle>
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={errorValue && Object.keys(errorValue).length > 0 ? 'error' : 'success'}
          sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
          iconMapping={{
            error: <Error style={{ verticalAlign: 'middle' }} />,
            success: <CheckCircle style={{ verticalAlign: 'middle' }} />,
          }}
        >
          {errorValue ? (
            <span>Ocorreu um erro ao atualizar o valor da venda. Por favor, tente novamente.</span>
          ) : (
            'O valor da venda foi atualizado com sucesso!'
          )}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PaymentCard;
