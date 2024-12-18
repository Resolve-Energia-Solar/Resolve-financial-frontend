import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { MoreVert, Edit, Delete, Visibility } from '@mui/icons-material';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import PaymentChip from '../PaymentChip';
import PaymentStatusChip from '../PaymentStatusChip';
import paymentService from '@/services/paymentService';
import { useRouter } from 'next/navigation';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';

const PaymentList = () => {
  const [paymentsList, setPaymentsList] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);
  const [open, setOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await paymentService.getPayments();
        setPaymentsList(response.results);
      } catch (error) {
        setError('Erro ao carregar faturas');
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
  };

  const handleEditClick = (id) => {
    router.push(`/apps/invoice/${id}/update`);
  };

  const handleCreateClick = () => {
    router.push('/apps/invoice/create');
  };

  const handleDetailClick = (id) => {
    router.push(`/apps/invoice/${id}/view`);
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
      <TableContainer component={Paper} elevation={10} sx={{ overflowX: 'auto' }}>
        <Table stickyHeader aria-label="sales table">
          <TableHead>
            <TableRow>
              {/* <TableCell padding="checkbox">
                <CustomCheckbox />
              </TableCell> */}
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Cliente
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Parcelas
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Valor
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Tipo Pagamento
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6" fontSize="14px">
                  Ações
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {paymentsList.map((payment) => (
                <TableRow key={payment.id}>
                  {/* <TableCell padding="checkbox">
                    <CustomCheckbox />
                  </TableCell> */}
                  <TableCell>
                    <Typography fontSize="14px">
                      {payment?.sale?.customer?.complete_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="14px">{payment.installments.length}x</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="14px">
                      {Number(payment?.value).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <PaymentChip paymentType={payment.payment_type} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusChip paymentType={payment.is_paid} />
                  </TableCell>
                  <TableCell align="center">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmação de Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir esta fatura? Esta ação não pode ser desfeita.
          </DialogContentText>
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
    </>
  );
};

export default PaymentList;
