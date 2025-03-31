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
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentChip from '../PaymentChip';
import paymentService from '@/services/paymentService';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';
import { FilterContext } from '@/context/FilterContext';
import saleService from '@/services/saleService';
import PaymentDocBadge from '../accordeon-components/PaymentDocBadge';


const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

const SalePaymentList = ({ onClick }) => {
  // Estados para dados, loading, erro e paginação
  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // Estados para o diálogo de exclusão
  const [open, setOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const { filters, refresh } = useContext(FilterContext);

  useEffect(() => {
    setPage(0);
  }, [filters, refresh]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await saleService.index({
          page: page + 1,
          limit: rowsPerPage,
          expand: 'customer,payments.borrower,payments,sale,payments.financier',
          fields:
            'id,total_value,payments.payment_type,payments.is_paid,customer.complete_name,signature_date,payments.borrower.complete_name,payments.installments,payments.invoice_status,status,payment_status,payments.financier.name,is_pre_sale',
          ...filters,
        });
        setPaymentsList(response.results);
        setTotalCount(response.meta.pagination.total_count || 0);
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
                  Doc.
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Venda
                </Typography>
              </TableCell>
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
                  Tipos de Pagamento
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Financiadora
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Valor
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          {loading ? (
            <TableSkeleton rows={rowsPerPage} columns={7} />
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
                        <PaymentDocBadge saleId={item.id} contentType={CONTEXT_TYPE_SALE_ID} />
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px">
                        {item?.is_pre_sale ? (
                          <CancelIcon fontSize="small" color="error" />
                        ) : (
                          <CheckCircleIcon fontSize="small" color="success" />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px">{item?.customer?.complete_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px">
                        {Array.isArray(item?.payments) && item.payments.length > 0 ? (
                          <>
                            {item.payments
                              .map((p) => p?.borrower?.complete_name)
                              .filter(Boolean)
                              .slice(0, 2)
                              .join(', ')}
                            {item.payments.filter((p) => p?.borrower?.complete_name).length > 2 &&
                              ` +${item.payments.length - 2}`}
                          </>
                        ) : (
                          '-'
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(item?.payments) && item.payments.length > 0 ? (
                        <>
                          {item.payments
                            .map((p) => p?.payment_type)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((type, index) => (
                              <PaymentChip key={index} paymentType={type} />
                            ))}
                          {item.payments.filter((p) => p?.payment_type).length > 2 && (
                            <Typography component="span" fontSize="14px" ml={1}>
                              +{item.payments.filter((p) => p?.payment_type).length - 2}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography fontSize="14px">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px">
                        {Array.isArray(item?.payments) && item.payments.length > 0 ? (
                          <>
                            {item.payments
                              .map((p) => p?.financier?.name)
                              .filter(Boolean)
                              .slice(0, 2)
                              .join(', ')}
                            {item.payments.filter((p) => p?.financier?.name).length > 2 &&
                              ` +${item.payments.length - 2}`}
                          </>
                        ) : (
                          '-'
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="14px">
                        {Number(item?.total_value).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </Typography>
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
        rowsPerPageOptions={[10, 20, 30]}
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

export default SalePaymentList;
