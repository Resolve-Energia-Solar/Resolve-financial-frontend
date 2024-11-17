'use client';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Box,
  Stack,
  Divider,
  Grid,
  CircularProgress,
  FormControlLabel,
  Skeleton,
} from '@mui/material';
import { format, isValid } from 'date-fns';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { IconSquareRoundedPlus, IconTrash } from '@tabler/icons-react';
import { useParams } from 'next/navigation';

import usePayment from '@/hooks/payments/usePayment';
import usePaymentForm from '@/hooks/payments/usePaymentForm';
import AutoCompleteSale from '../../comercial/sale/components/auto-complete/Auto-Input-Sales';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import AutoCompleteFinancier from '../components/auto-complete/Auto-Input-financiers';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import CustomFieldMoney from '../components/CustomFieldMoney';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import EditInvoiceSkeleton from '../components/EditInvoiceSkeleton';
import { useEffect } from 'react';

const EditInvoicePage = ({payment_id=null, onClosedModal = null, onRefresh = null}) => {
  const params = useParams();
  let id = payment_id;
  if (!payment_id) id = params.id;

  const { loading, error, paymentData } = usePayment(id);
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading: formLoading,
    handleInstallmentChange,
    handleAddItem,
    handleDeleteItem,
  } = usePaymentForm(paymentData, id);

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      } 
    }
  }, [success]);

  const statusOptions = [
    { value: 'C', label: 'Crédito' },
    { value: 'D', label: 'Débito' },
    { value: 'B', label: 'Boleto' },
    { value: 'F', label: 'Financiamento' },
    { value: 'PI', label: 'Parcelamento Interno' },
  ];

  const { formattedValue, handleValueChange } = useCurrencyFormatter(formData.value);

  console.log(formErrors.installments);

  const orderDate = paymentData?.created_at;
  const parsedDate = isValid(new Date(orderDate)) ? new Date(orderDate) : new Date();
  const formattedOrderDate = format(parsedDate, 'EEEE, MMMM dd, yyyy');

  if (loading) {
    return <EditInvoiceSkeleton />;
  }

  return (
    <Box>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5"># {id}</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={formLoading}
            endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {formLoading ? 'Salvando...' : 'Salvar Alterações'}{' '}
          </Button>
        </Box>
      </Stack>
      <Divider></Divider>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Pagamento atualizado com sucesso!
        </Alert>
      )}

      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <FormSelect
            label="Status do Pagamento"
            options={statusOptions}
            value={formData.payment_type}
            onChange={(e) => handleChange('payment_type', e.target.value)}
          />
        </Box>
        <Box textAlign="right">
          <CustomFormLabel htmlFor="demo-simple-select">Data do Registro</CustomFormLabel>
          <Typography variant="body1"> {formattedOrderDate}</Typography>
        </Box>
      </Stack>
      <Divider></Divider>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel htmlFor="name">Venda</CustomFormLabel>
          <AutoCompleteSale
            onChange={(id) => handleChange('sale_id', id)}
            value={formData.sale_id}
            {...(formErrors.sale_id && { error: true, helperText: formErrors.sale_id })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel htmlFor="name">Financiador</CustomFormLabel>
          <AutoCompleteFinancier
            onChange={(id) => handleChange('financier_id', id)}
            value={formData.financier_id}
            {...(formErrors.financier_id && { error: true, helperText: formErrors.financier_id })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel htmlFor="valor">Valor</CustomFormLabel>
          <CustomTextField
            name="value"
            placeholder="R$ 1.000,00"
            variant="outlined"
            fullWidth
            value={formattedValue}
            onChange={(e) => handleValueChange(e, handleChange)}
            {...(formErrors.value && { error: true, helperText: formErrors.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormDate
            label="Data do Pagamento"
            name="due_date"
            value={formData.due_date}
            onChange={(newValue) => handleChange('due_date', newValue)}
            {...(formErrors.due_date && { error: true, helperText: formErrors.due_date })}
          />
        </Grid>
      </Grid>

      <Paper variant="outlined">
        <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
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
                <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    Ações
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.installments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleAddItem}>
                      Adicionar uma nova parcela
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                formData.installments.map((installment, index) => (
                  <TableRow key={installment.id}>
                    <TableCell>
                      <CustomFieldMoney
                        value={installment.installment_value}
                        onChange={(value) =>
                          handleInstallmentChange(index, 'installment_value', value)
                        }
                        {...(formErrors.installments &&
                          formErrors.installments[index]?.installment_value && {
                            error: true,
                            helperText: formErrors.installments[index].installment_value,
                          })}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        type="number"
                        value={installment.installment_number}
                        onChange={(e) =>
                          handleInstallmentChange(index, 'installment_number', e.target.value)
                        }
                        {...(formErrors.installments &&
                          formErrors.installments[index]?.installment_number && {
                            error: true,
                            helperText: formErrors.installments[index].installment_number,
                          })}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <FormDate
                        name="due_date"
                        value={installment.due_date}
                        onChange={(newValue) =>
                          handleInstallmentChange(index, 'due_date', newValue)
                        }
                        {...(formErrors.installments &&
                          formErrors.installments[index]?.due_date && {
                            error: true,
                            helperText: formErrors.installments[index].due_date,
                          })}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <CustomSwitch
                            checked={installment.is_paid}
                            onChange={(e) =>
                              handleInstallmentChange(index, 'is_paid', e.target.checked)
                            }
                          />
                        }
                        label={installment.is_paid ? 'Pago' : 'Pendente'}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Add Item">
                        <IconButton onClick={handleAddItem} color="primary">
                          <IconSquareRoundedPlus width={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Item">
                        <IconButton color="error" onClick={() => handleDeleteItem(index)}>
                          <IconTrash width={22} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* <Box p={3} backgroundColor="primary.light" mt={3}>
        <Box display="flex" justifyContent="end" gap={3} mb={3}>
          <Typography variant="body1" fontWeight={600}>
            Sub Total:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            0
          </Typography>
        </Box>
        <Box display="flex" justifyContent="end" gap={3} mb={3}>
          <Typography variant="body1" fontWeight={600}>
            VAT:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            0
          </Typography>
        </Box>
        <Box display="flex" justifyContent="end" gap={3}>
          <Typography variant="body1" fontWeight={600}>
            Grand Total:
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            0
          </Typography>
        </Box>
      </Box> */}
    </Box>
  );
};

export default EditInvoicePage;
