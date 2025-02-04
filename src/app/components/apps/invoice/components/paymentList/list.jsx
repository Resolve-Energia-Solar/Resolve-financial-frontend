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
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import PaymentChip from '../PaymentChip';
import PaymentStatusChip from '../../../../../../utils/status/PaymentStatusChip';
import paymentService from '@/services/paymentService';
import { useRouter } from 'next/navigation';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';
import { InvoiceContext } from '@/app/context/InvoiceContext';

const PaymentList = ({ onClick }) => {
  // Estados para dados, loading, erro e paginação
  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Estados para o diálogo de exclusão
  const [open, setOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const router = useRouter();
  const { filters, refresh } = useContext(InvoiceContext);

  // Sempre que os filtros ou o refresh mudarem, reseta a página
  useEffect(() => {
    setPage(0);
  }, [filters, refresh]);

  // Busca os pagamentos sempre que os filtros, refresh, página ou linhas por página mudarem
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await paymentService.getPayments({
          ...filters,
          page: page + 1,
          limit: rowsPerPage,
        });
        setPaymentsList(response.results.results);
        setTotalCount(response.count || 0);
      } catch (err) {
        console.error('Erro ao carregar pagamentos:', err);
        setError('Erro ao carregar pagamentos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, refresh, page, rowsPerPage]);

  // Handlers para paginação
  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers para exclusão
  const handleDeleteClick = (id) => {
    setInvoiceToDelete(id);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await paymentService.deletePayment(invoiceToDelete);
      setPaymentsList((prev) => prev.filter((item) => item.id !== invoiceToDelete));
    } catch (err) {
      console.error('Erro ao excluir pagamento:', err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <TableContainer component={Paper} elevation={10} sx={{ overflowX: 'auto' }}>
        <Table stickyHeader aria-label="payments table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Cliente
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Tomador
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
            </TableRow>
          </TableHead>

          {loading ? (
            <TableSkeleton rows={rowsPerPage} cols={6} />
          ) : error ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="error" align="center">
                    {error}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {paymentsList && paymentsList.length > 0 ? (
                paymentsList.map((item) => (
                  <TableRow key={item.id} onClick={() => onClick(item)} hover>
                    <TableCell>
                      <Typography fontSize="14px">
                        {item?.sale?.customer?.complete_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px">
                        {item?.borrower?.complete_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px">
                        {item?.installments.length}x
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px">
                        {Number(item?.value).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <PaymentChip paymentType={item?.payment_type} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusChip paymentType={item?.is_paid} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="h6" align="center">
                      Nenhum pagamento encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {/* Controles de paginação */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmação de Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este pagamento? Esta ação não pode ser desfeita.
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
