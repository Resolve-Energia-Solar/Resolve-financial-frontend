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
import PaymentStatusChip from '../components/PaymentStatusChip';

const DetailInvoicePage = ({ payment_id = null }) => {
  const theme = useTheme();
  const params = useParams();
  let id = payment_id;
  if (!payment_id) id = params.id;

  const { loading, error, paymentData } = usePayment(id);
  const { formattedValue } = useCurrencyFormatter(paymentData?.value);

  const statusLabels = {
    C: 'Crédito',
    D: 'Débito',
    B: 'Boleto',
    F: 'Financiamento',
    PI: 'Parcelamento Interno',
  };

  const orderDate = paymentData?.created_at;
  const parsedDate = isValid(new Date(orderDate)) ? new Date(orderDate) : new Date();
  const formattedOrderDate = format(parsedDate, 'EEEE, MMMM dd, yyyy');

  // Função para formatar valores em BRL
  const formatToBRL = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) return <Typography>Loading...</Typography>;
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
          <Typography variant="subtitle1">Status do Pagamento</Typography>
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
            {paymentData?.sale.contract_number} - {paymentData?.sale.customer.complete_name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Financiador</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {paymentData?.financier.name}
          </Typography>
        </Grid>
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
              {paymentData.installments.map((installment) => (
                <TableRow key={installment.id}>
                  <TableCell>{formatToBRL(installment.installment_value)}</TableCell>
                  <TableCell>{installment.installment_number}</TableCell>
                  <TableCell>{format(new Date(installment.due_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell><PaymentStatusChip isPaid={installment.is_paid} /></TableCell>
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
