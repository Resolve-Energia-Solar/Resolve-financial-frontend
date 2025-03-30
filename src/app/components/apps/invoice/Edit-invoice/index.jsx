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
  FormControlLabel,
  Snackbar,
} from '@mui/material';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { IconSquareRoundedPlus, IconTrash } from '@tabler/icons-react';
import { useParams } from 'next/navigation';

import usePayment from '@/hooks/payments/usePayment';
import usePaymentForm from '@/hooks/payments/usePaymentForm';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import AutoCompleteFinancier from '../components/auto-complete/Auto-Input-financiers';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import CustomFieldMoney from '../components/CustomFieldMoney';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import EditInvoiceSkeleton from '../components/EditInvoiceSkeleton';
import { useEffect, useState } from 'react';
import AutoCompleteUser from '../../comercial/sale/components/auto-complete/Auto-Input-User';
import { useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import paymentInstallmentService from '@/services/paymentInstallmentService';

const EditInvoicePage = ({ payment_id = null, onClosedModal = null, onRefresh = null }) => {
  const params = useParams();
  let id = payment_id;
  if (!payment_id) id = params.id;

  const userPermissions = useSelector((state) => state.user.permissions);
  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const { loading, error, paymentData, refreshPayment } = usePayment(id, {
    expand: 'borrower,financier,installments',
    fields:
      'id,borrower.id,barrower.complete_name,financier.id,financier.name,payment_type,value,due_date,invoice_status,installments,created_at,sale,installments.installment_value,installments.installment_number,installments.due_date,installments.is_paid,installments.id',
  });

  const {
    formData,
    handleChange,
    formErrors,
    success,
    loading: formLoading,
    handleInstallmentChange,
    handleAddItem,
    handleDeleteItem,
    handleSave,
  } = usePaymentForm(paymentData, id);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Atualiza o campo sale_id a partir do paymentData
  useEffect(() => {
    handleChange('sale_id', paymentData?.sale);
  }, [paymentData]);

  useEffect(() => {
    if (success) {
      setOpenSnackbar(true);
      if (onClosedModal) onClosedModal();
      if (onRefresh) onRefresh();
    }
  }, [success]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  // Função para salvar (criar ou atualizar) uma parcela e recarregar os dados
  const handleSaveInstallment = async (installment, index) => {
    if (!installment.id) {
      // Parcela nova: cria via API
      try {
        console.log('Criando parcela:', installment);
        const response = await paymentInstallmentService.create(installment);
        console.log('Parcela criada com sucesso:', response);
        const updatedInstallments = [...formData.installments];
        updatedInstallments[index] = response.data;
        handleChange('installments', updatedInstallments);
        refreshPayment();
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Erro ao criar parcela:', error);
      }
    } else {
      // Parcela existente: atualiza via API
      try {
        console.log('Atualizando parcela:', installment);
        const response = await paymentInstallmentService.update(installment.id, installment);
        console.log('Parcela atualizada com sucesso:', response);
        refreshPayment();
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Erro ao atualizar parcela:', error);
      }
    }
  };

  // Função para remover a parcela
  // Se a remoção for bem-sucedida, apenas remove a parcela sem refresh;
  // Se ocorrer erro, chama refreshPayment.
  const handleRemoveInstallment = async (installment, index) => {
    if (!installment.id) {
      handleDeleteItem(index);
    } else {
      try {
        console.log('Deletando parcela:', installment);
        await paymentInstallmentService.delete(installment.id);
        console.log('Parcela deletada com sucesso');
        handleDeleteItem(index);
      } catch (error) {
        console.error('Erro ao deletar parcela:', error);
        refreshPayment();
        if (onRefresh) onRefresh();
      }
    }
  };

  // Função personalizada para adicionar nova parcela sem gerar id
  const customHandleAddItem = () => {
    const newInstallment = {
      id: null,
      installment_value: '',
      installment_number: '',
      due_date: '',
      is_paid: false,
      payment: id,
    };
    handleChange('installments', [...formData.installments, newInstallment]);
  };

  // Botão para marcar todas as parcelas como pagas
  const markAllPaid = () => {
    const updated = formData.installments.map(inst => ({
      ...inst,
      is_paid: true,
    }));
    handleChange('installments', updated);
  };

  // Botão para salvar todas as parcelas de uma vez
  const saveAllInstallments = async () => {
    for (let i = 0; i < formData.installments.length; i++) {
      await handleSaveInstallment(formData.installments[i], i);
    }
    refreshPayment();
    if (onRefresh) onRefresh();
  };

  const statusOptions = [
    { value: 'C', label: 'Crédito' },
    { value: 'D', label: 'Débito' },
    { value: 'B', label: 'Boleto' },
    { value: 'F', label: 'Financiamento' },
    { value: 'PI', label: 'Parcelamento Interno' },
    { value: 'P', label: 'Pix' },
    { value: 'T', label: 'Transferência' },
    { value: 'DI', label: 'Dinheiro' },
    { value: 'PA', label: 'Poste Auxiliar' },
    { value: 'RO', label: 'Repasse de Obra' },
  ];

  const invoiceStatus = [
    { value: 'E', label: 'Emitida' },
    { value: 'L', label: 'Liberada' },
    { value: 'P', label: 'Pendente' },
    { value: 'C', label: 'Cancelada' },
  ];

  useEffect(() => {
    if (formData.payment_type !== 'F') {
      handleChange('financier_id', null);
    }
  }, [formData.payment_type]);

  const orderDate = paymentData?.created_at;
  const parsedDate = isValid(new Date(orderDate)) ? new Date(orderDate) : new Date();
  const formattedOrderDate = format(parsedDate, 'EEEE, MMMM dd, yyyy', { locale: ptBR });

  if (loading) return <EditInvoiceSkeleton />;

  return (
    <Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Pagamento atualizado com sucesso!
        </Alert>
      </Snackbar>

      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <FormSelect
            label="Tipo do Pagamento"
            options={statusOptions}
            value={formData.payment_type}
            onChange={(e) => handleChange('payment_type', e.target.value)}
            {...(formErrors.payment_type && { error: true, helperText: formErrors.payment_type })}
          />
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box textAlign="right">
            <CustomFormLabel htmlFor="demo-simple-select">Data do Registro</CustomFormLabel>
            <Typography variant="body1">{formattedOrderDate}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={formLoading}
          >
            Salvar
          </Button>
        </Stack>
      </Stack>
      <Divider />

      <Grid container spacing={3} mb={4}>
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
        <Grid item xs={12} sm={6}>
          <FormSelect
            label="Nota Fiscal"
            options={invoiceStatus}
            disabled={!hasPermission(['financial.change_invoice_status'])}
            value={formData.invoice_status}
            onChange={(e) => handleChange('invoice_status', e.target.value)}
            {...(formErrors.invoice_status && { error: true, helperText: formErrors.invoice_status })}
          />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={markAllPaid}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 400,
            fontSize: '0.875rem',
          }}
        >
          Marcar Todos como Pago
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={saveAllInstallments}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 400,
            fontSize: '0.875rem',
          }}
        >
          Salvar Todos
        </Button>
      </Stack>

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
              {formData.installments.map((installment, index) => (
                <TableRow key={installment?.id ?? index}>
                  <TableCell>
                    <CustomFieldMoney
                      value={installment?.installment_value}
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
                      value={installment?.installment_number}
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
                      value={installment?.due_date}
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
                          checked={installment?.is_paid}
                          disabled={!hasPermission(['financial.change_is_paid_field'])}
                          onChange={(e) =>
                            handleInstallmentChange(index, 'is_paid', e.target.checked)
                          }
                        />
                      }
                      label={installment?.is_paid ? 'Pago' : 'Pendente'}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Salvar Parcela">
                      <IconButton
                        onClick={() => {
                          handleSaveInstallment(installment, index);
                          refreshPayment();
                        }}
                        color="primary"
                      >
                        <SaveIcon width={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Apagar Parcela">
                      <IconButton
                        onClick={() => {
                          handleRemoveInstallment(installment, index);
                          onRefresh();
                        }}
                        color="error"
                      >
                        <IconTrash width={22} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {/* Linha para adicionar nova parcela com botão delicado */}
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={customHandleAddItem}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 400,
                      fontSize: '0.875rem',
                    }}
                  >
                    Adicionar nova parcela
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EditInvoicePage;
