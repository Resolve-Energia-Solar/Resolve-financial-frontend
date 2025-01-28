'use client';
import { Grid, Button, Stack, Select, MenuItem, InputAdornment, FormHelperText } from '@mui/material';
import AutoCompleteDepartment from '@/app/components/apps/financial-record/departmentInput';
import AutoCompleteCategory from '@/app/components/apps/financial-record/categoryInput';
import AutoCompleteBeneficiary from '@/app/components/apps/financial-record/beneficiaryInput';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { useSelector } from 'react-redux';

import useFinancialRecordForm from '@/hooks/financial_record/useFinancialRecordForm';

export default function FormCustom() {
  const router = useRouter();
  const { formData, handleChange, handleSave, formErrors, success } = useFinancialRecordForm();
  const user = useSelector((state) => state.user?.user);

  if (success) {
    router.push('/apps/financial-record');
  }

  const getCurrentTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  return (
    <PageContainer title="Criação de Contas a Receber/Pagar" description="Formulário para criar nova conta a receber/pagar">
      <Breadcrumb title="Criar Contas a Receber/Pagar" />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          A conta a receber/pagar foi criada com sucesso!
        </Alert>
      )}
      <ParentCard title="Nova Conta a Receber/Pagar">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomFormLabel>Solicitante</CustomFormLabel>
            <Select
              variant="outlined"
              fullWidth
              value='1'
              disabled
            >
              <MenuItem value='1'>{user.complete_name}</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel>Responsável</CustomFormLabel>
            <Select
              variant="outlined"
              fullWidth
              value='1'
              disabled
            >
              <MenuItem value='1'>{user.employee.user_manager.complete_name}</MenuItem>
            </Select>
          </Grid>
          {/* <Grid item xs={12}>
            <CustomFormLabel htmlFor="is_receivable">A pagar / A receber</CustomFormLabel>
            <Stack direction="row" spacing={2}>
              <Button
                variant={formData.is_receivable === 'receivable' ? 'contained' : 'outlined'}
                color="success"
                onClick={() => handleChange('is_receivable', 'receivable')}
                startIcon={<IconArrowDown />}
              >
                A Receber
              </Button>
              <Button
                variant={formData.is_receivable === 'payable' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => handleChange('is_receivable', 'payable')}
                startIcon={<IconArrowUp />}
              >
                A Pagar
              </Button>
            </Stack>
          </Grid> */}
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="value">Valor</CustomFormLabel>
            <CustomTextField
              name="value"
              variant="outlined"
              fullWidth
              value={formData.value}
              onChange={(e) => handleChange('value', e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              {...(formErrors.value && { error: true, helperText: formErrors.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="due_date">Data de Vencimento</CustomFormLabel>
            <CustomTextField
              name="due_date"
              type="date"
              variant="outlined"
              fullWidth
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              {...(formErrors.due_date && { error: true, helperText: formErrors.due_date })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="service_date">Data de Serviço</CustomFormLabel>
            <CustomTextField
              name="service_date"
              type="date"
              variant="outlined"
              fullWidth
              value={formData.service_date}
              onChange={(e) => handleChange('service_date', e.target.value)}
              {...(formErrors.service_date && { error: true, helperText: formErrors.service_date })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="department_code">Departamento</CustomFormLabel>
            <AutoCompleteDepartment
              onChange={(value) => handleChange('department_code', value)}
              value={formData.department_code}
              error={formErrors.department_code}
              helperText={formErrors.department_code}
              disabled={false}
              // labeltitle="Departamento"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="category_code">Categoria</CustomFormLabel>
            <AutoCompleteCategory
              onChange={(value) => handleChange('category_code', value)}
              value={formData.category_code}
              error={formErrors.category_code}
              helperText={formErrors.category_code}
              disabled={false}
              // labeltitle="Categoria"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="client_supplier_code">Beneficiário</CustomFormLabel>
            <AutoCompleteBeneficiary
              name="client_supplier_code"
              value={formData.customer_code}
              error={formErrors.customer_code}
              helperText={formErrors.customer_code}
              disabled={false}
              onChange={(e) => handleChange('client_supplier_code', e.target.value)}
              // labeltitle="Beneficiário"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="invoice_number">Número da Fatura</CustomFormLabel>
            <CustomTextField
              name="invoice_number"
              variant="outlined"
              fullWidth
              value={formData.invoice_number}
              onChange={(e) => handleChange('invoice_number', e.target.value)}
              {...(formErrors.invoice_number && { error: true, helperText: formErrors.invoice_number })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="notes">Descrição</CustomFormLabel>
            <CustomTextField
              name="notes"
              variant="outlined"
              fullWidth
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              {...(formErrors.notes && { error: true, helperText: formErrors.notes })}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Criar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}