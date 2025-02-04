import React, { useState, useEffect, useContext } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TablePagination,
} from '@mui/material';
import PaymentChip from '../PaymentChip';
import PaymentStatusChip from '../../../../../../utils/status/PaymentStatusChip';
import paymentService from '@/services/paymentService';
import { useRouter } from 'next/navigation';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';
import { InvoiceContext } from '@/app/context/InvoiceContext';

const PaymentList = ({ onClick }) => {
  const [paymentsList, setPaymentsList] = useState([]);
  const [open, setOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const { filters, setFilters, refresh } = useContext(InvoiceContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Valor padrão

  useEffect(() => {
    setPaymentsList([]);
  }, [filters, refresh]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await paymentService.getPayments({
          ...filters,
          page: page + 1, // API espera página começando de 1
          limit: rowsPerPage,
        });

        setPaymentsList(response.results);
        setTotalCount(response.count || 0);
      } catch (error) {
        setError('Erro ao carregar faturas');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, refresh, page, rowsPerPage]);

  const handleDeleteClick = (id) => {
    setInvoiceToDelete(id);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await paymentService.deletePayment(invoiceToDelete);
      setPaymentsList((prev) => prev.filter((item) => item?.id !== invoiceToDelete));
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setOpen(false);
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper} elevation={10} sx={{ overflowX: 'auto' }}>
        <Table stickyHeader aria-label="payments table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" fontSize="14px">Cliente</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">Tomador</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">Parcelas</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">Valor</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">Tipo Pagamento</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">Status</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {paymentsList.map((item) => (
                <TableRow key={item?.id} onClick={() => onClick(item)} hover>
                  <TableCell>
                    <Typography fontSize="14px">{item?.sale?.customer?.complete_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="14px">{item?.borrower?.complete_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="14px">{item?.installments.length}x</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="14px">
                      {Number(item?.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <PaymentChip paymentType={item?.payment_type} />
                  </TableCell>
                  <TableCell>
                    <PaymentStatusChip paymentType={item?.is_paid} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {/* Paginação */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmação de Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir esta fatura? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentList;
