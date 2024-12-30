'use client';
import React, { useContext, useState, useEffect } from 'react';
import { InvoiceContext } from '@/app/context/InvoiceContext/index';
import { usePathname, useRouter } from 'next/navigation';
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
} from '@mui/material';
import { format, isValid } from 'date-fns';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { IconSquareRoundedPlus, IconTrash } from '@tabler/icons-react';

import usePaymentForm from '@/hooks/payments/usePaymentForm';
import AutoCompleteSale from '../../comercial/sale/components/auto-complete/Auto-Input-Sales';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import AutoCompleteFinancier from '../components/auto-complete/Auto-Input-financiers';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import CustomFieldMoney from '../components/CustomFieldMoney';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import AutoCompleteUser from '../../comercial/sale/components/auto-complete/Auto-Input-User';
import { useSelector } from 'react-redux';

const CreateInvoice = ({ sale = null, onClosedModal = null, onRefresh = null }) => {
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    response,
    loading: formLoading,
    handleInstallmentChange,
    handleAddItem,
    handleDeleteItem,
  } = usePaymentForm();

  const userPermissions = useSelector((state) => state.user.permissions);

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      } else {
        router.push(`/apps/invoice/${response.id}/update`);
      }
    }
  }, [response, success]);

  const statusOptions = [
    { value: 'C', label: 'Crédito' },
    { value: 'D', label: 'Débito' },
    { value: 'B', label: 'Boleto' },
    { value: 'F', label: 'Financiamento' },
    { value: 'PI', label: 'Parcelamento Interno'},
    { value: 'P', label: 'Pix' },
  ];

  sale ? (formData.sale_id = sale) : null;

  if (formData.payment_type !== 'F' && formData.payment_type !== 'C') {
    formData.installments_number = 1;
  }

  useEffect(() => {
    if (formData.payment_type !== 'F') formData.financier_id = null;
  }, [formData.payment_type]);

  const orderDate = new Date();
  const parsedDate = isValid(new Date(orderDate)) ? new Date(orderDate) : new Date();
  const formattedOrderDate = format(parsedDate, 'EEEE, MMMM dd, yyyy');

  return (
    <Box>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Criar Pagamento</Typography>
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

      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <FormSelect
            label="Tipo de Pagamento"
            options={statusOptions}
            value={formData.payment_type}
            onChange={(e) => handleChange('payment_type', e.target.value)}
            {...(formErrors.payment_type && { error: true, helperText: formErrors.payment_type })}
          />
        </Box>
        <Box textAlign="right">
          <CustomFormLabel htmlFor="demo-simple-select">Data do Registro</CustomFormLabel>
          <Typography variant="body1"> {formattedOrderDate}</Typography>
        </Box>
      </Stack>
      <Divider></Divider>

      <Grid container spacing={3} mb={4}>
        {!sale && (
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="name">Venda</CustomFormLabel>
            <AutoCompleteSale
              onChange={(id) => handleChange('sale_id', id)}
              value={formData.sale_id}
              {...(formErrors.sale_id && { error: true, helperText: formErrors.sale_id })}
              disabled={!!sale}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <CustomFormLabel htmlFor="name">Tomador</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('borrower_id', id)}
            value={formData.borrower_id}
            {...(formErrors.borrower_id && { error: true, helperText: formErrors.borrower_id })}
          />
        </Grid>
        {formData.payment_type === 'F' && (
          <Grid item xs={12} sm={6}>
            <CustomFormLabel htmlFor="name">Financiadora</CustomFormLabel>
            <AutoCompleteFinancier
              onChange={(id) => handleChange('financier_id', id)}
              value={formData.financier_id}
              {...(formErrors.financier_id && { error: true, helperText: formErrors.financier_id })}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <CustomFormLabel htmlFor="valor">Valor</CustomFormLabel>
          <CustomFieldMoney
            value={formData.value}
            onChange={(value) => handleChange('value', value)}
            {...(formErrors.value && { error: true, helperText: formErrors.value })}
            fullWidth
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
        {(formData.payment_type === 'F' || formData.payment_type === 'C') && (
          <>
            {formData.create_installments && (
              <Grid item xs={12} sm={12}>
                <CustomFormLabel htmlFor="valor">Número de Parcelas</CustomFormLabel>
                <CustomTextField
                  name="value"
                  placeholder="1"
                  variant="outlined"
                  fullWidth
                  value={formData.installments_number}
                  onChange={(e) => handleChange('installments_number', e.target.value)}
                  {...(formErrors.installments_number && {
                    error: true,
                    helperText: formErrors.installments_number,
                  })}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={formData.create_installments}
                    onChange={(e) => handleChange('create_installments', e.target.checked)}
                  />
                }
                label={formData.create_installments ? 'Gerar parcelas' : 'Não gerar parcelas'}
              />
            </Grid>
          </>
        )}
      </Grid>
      {!formData.create_installments && (
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
                              disabled={!hasPermission(['financial.change_is_paid_field'])}
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
      )}

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

export default CreateInvoice;
