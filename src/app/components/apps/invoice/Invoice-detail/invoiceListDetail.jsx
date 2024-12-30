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
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility, Add } from '@mui/icons-material';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import paymentService from '@/services/paymentService';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import DetailInvoicePage from '@/app/components/apps/invoice/Invoice-detail';
import saleService from '@/services/saleService';
import PaymentChip from '../components/PaymentChip';

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

const PaymentCardDetail = ({ sale = null }) => {
  const [paymentsList, setPaymentsList] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [saleData, setSaleData] = useState(null);

  const [error, setError] = useState(null);


  const [invoiceToView, setInvoiceToView] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await paymentService.getPayments({ sale });
        setPaymentsList(response.results);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const fetchSale = async () => {
      try {
        const data = await saleService.getTotalPaidSales(sale);
        console.log(data);
        setSaleData(data);
      } catch (err) {
        setError('Erro ao carregar a venda');
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, []);


  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
  };

  const handleDetailClick = (id) => {
    setInvoiceToView(id);
    setDetailModalOpen(true);
  };

  return (
    <>
      <Grid container spacing={3}>

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
                      </Menu>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
      </Grid>

      <Box p={3} backgroundColor="primary.light" mt={3}>
        <Box display="flex" justifyContent="end" gap={3} mb={3}>
          <Typography variant="body1" fontWeight={600}>
            Pago:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              saleData?.total_paid || 0,
            )}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="end" gap={3}>
          <Typography variant="body1" fontWeight={600}>
            Total a Pagar:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
          {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              saleData?.total_value || 0,
            )}
          </Typography>
        </Box>
      </Box>

      {/* Modal de Detalhes */}
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

export default PaymentCardDetail;
