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
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import PaymentChip from '../PaymentChip';
import paymentService from '@/services/paymentService';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import EditInvoicePage from '../../Edit-invoice';
import DetailInvoicePage from '../../Invoice-detail';

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
  const [paymentsList, setPaymentsList] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false); // Estado para o modal de detalhes
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [invoiceToView, setInvoiceToView] = useState(null); // Estado para ID de visualização
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await paymentService.getPayments({ sale });
        setPaymentsList(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };

    fetchData();
  }, [sale]);

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
      <Grid container spacing={3}>
        { /* verificando se a lista de pagamentos está vazia */ }
        {paymentsList.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" color="textSecondary">
              Nenhuma fatura encontrada
            </Typography>
          </Grid>
        )}
        {paymentsList.map((payment) => {
          const progressValue = 50;

          return (
            <Grid item xs={12} sm={6} md={4} key={payment.id}>
              <Card elevation={10}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography fontSize="14px" color="text.secondary">
                        {payment.installments.length}x parcelas
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
                    <BorderLinearProgress variant="determinate" value={progressValue} sx={{ mt: 1 }} />
                  </Box>
                </CardContent>
                <CardActions disableSpacing>
                  <CustomCheckbox />
                  <Tooltip title="Ações">
                    <IconButton size="small" onClick={(event) => handleMenuClick(event, payment.id)}>
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

      {/* Modal de Confirmação de Exclusão */}
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

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Fatura</DialogTitle>
        <DialogContent>
          <EditInvoicePage payment_id={invoiceToEdit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="md" fullWidth>
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
