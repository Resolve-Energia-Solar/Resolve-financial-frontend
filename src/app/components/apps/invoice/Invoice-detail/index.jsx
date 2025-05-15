'use client';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Stack,
  Divider,
  Grid,
  useTheme,
} from '@mui/material';
import { format, isValid } from 'date-fns';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { useParams } from 'next/navigation';

import usePayment from '@/hooks/payments/usePayment';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import PaymentStatusChip from '../../../../../utils/status/PaymentStatusChip';
import EditInvoiceSkeleton from '../components/EditInvoiceSkeleton';
import { ptBR } from 'date-fns/locale';

const DetailInvoicePage = ({ payment_id = null }) => {
  const theme = useTheme();
  const params = useParams();
  let id = payment_id;
  if (!payment_id) id = params.id;

  const { loading, error, paymentData } = usePayment(id, {
    expand: 'sale.customer,borrower,installments,sale,financier',
    fields:
      'id,value,payment_type,is_paid,sale.customer.complete_name,sale.signature_date,sale.reference_value,sale.total_value,borrower.complete_name,installments,invoice_status,sale.status,sale.payment_status,due_date,executor_work,financier.name',
  });
  const { formattedValue } = useCurrencyFormatter(paymentData?.value);

  const statusLabels = {
    C: 'Crédito',
    D: 'Débito',
    B: 'Boleto',
    F: 'Financiamento',
    PI: 'Parcelamento Interno',
    P: 'Pix',
    T: 'Transferência',
    DI: 'Dinheiro',
  };

  const invoiceStatus = {
    E: 'Emitida',
    L: 'Liberada',
    P: 'Pendente',
    C: 'Cancelada',
  };

  const executorWorkStatus = {
    C: 'Cliente',
    F: 'Franquia',
    CO: 'Centro de Operações',
  };

  const orderDate = paymentData?.created_at;
  const parsedDate = isValid(new Date(orderDate)) ? new Date(orderDate) : new Date();
  const formattedOrderDate = format(parsedDate, 'EEEE, dd/MMMM/yyyy', { locale: ptBR });

  const formatToBRL = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) {
    return <EditInvoiceSkeleton />;
  }

  if (error) return <Typography>Error loading payment details.</Typography>;

  return (
    <Box>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Detalhes do Pagamento # {id}</Typography>
      </Stack>
      <Divider />

      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="subtitle1">Tipo de Pagamento</Typography>
          <Typography>{statusLabels[paymentData?.payment_type] || 'Desconhecido'}</Typography>
        </Box>
        <Box textAlign="right">
          <CustomFormLabel>Data do Registro</CustomFormLabel>
          <Typography variant="body1"> {formattedOrderDate}</Typography>
        </Box>
      </Stack>
      <Divider />

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Venda</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {paymentData?.sale?.contract_number} - {paymentData?.sale.customer?.complete_name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Tomador</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {paymentData?.borrower?.complete_name}
          </Typography>
        </Grid>
        {paymentData?.financier && (
          <Grid item xs={12} sm={6}>
            <CustomFormLabel>Financiadora</CustomFormLabel>
            <Typography
              sx={{
                fontStyle: 'italic',
                fontWeight: 'light',
                borderBottom: `1px dashed ${theme.palette.divider}`,
              }}
            >
              {paymentData?.financier?.name}
            </Typography>
          </Grid>
          )}
        {paymentData?.executor_work && (
          <Grid item xs={12} sm={6}>
            <CustomFormLabel>Executor de Obra</CustomFormLabel>
            <Typography
              sx={{
                fontStyle: 'italic',
                fontWeight: 'light',
                borderBottom: `1px dashed ${theme.palette.divider}`,
              }}
            >
              {executorWorkStatus[paymentData?.executor_work] || 'Desconhecido'}
            </Typography>
          </Grid>
        )}  
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Valor</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {formattedValue}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Data do Pagamento</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {format(new Date(paymentData?.due_date), 'dd/MM/yyyy')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Nota Fiscal</Typography>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {invoiceStatus[paymentData?.invoice_status] || 'Desconhecido'}
          </Typography>
        </Grid>
      </Grid>

      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    Valor
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    Número da Parcela
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    Vencimento
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentData.installments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2">Nenhuma parcela cadastrada</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2">Parcelas disponíveis</Typography>
                  </TableCell>
                </TableRow>
              )}
              {paymentData.installments.map((installment) => (
                <TableRow key={installment.id}>
                  <TableCell>{formatToBRL(installment.installment_value)}</TableCell>
                  <TableCell>{installment.installment_number}</TableCell>
                  <TableCell>{format(new Date(installment.due_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <PaymentStatusChip isPaid={installment.is_paid} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DetailInvoicePage;
