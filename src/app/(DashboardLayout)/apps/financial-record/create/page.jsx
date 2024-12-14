'use client';
import { Grid, Button, Stack, Select, MenuItem } from '@mui/material';
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
            <CustomFormLabel htmlFor="requester_id">Solicitante</CustomFormLabel>
            <Select
              name="requester_id"
              variant="outlined"
              fullWidth
              value={user.id}
              disabled
            >
              <MenuItem value={user.id}>{user.complete_name}</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="responsible_id">Responsável</CustomFormLabel>
            <Select
              name="responsible_id"
              variant="outlined"
              fullWidth
              value={user.id}
              disabled
            >
              <MenuItem value={user.id}>{user.complete_name}</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="integration_code">Código de Integração</CustomFormLabel>
            <CustomTextField
              name="integration_code"
              variant="outlined"
              fullWidth
              value={formData.integration_code}
              onChange={(e) => handleChange('integration_code', e.target.value)}
              {...(formErrors.integration_code && { error: true, helperText: formErrors.integration_code })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="protocol">Protocolo</CustomFormLabel>
            <CustomTextField
              name="protocol"
              variant="outlined"
              fullWidth
              value={formData.protocol}
              onChange={(e) => handleChange('protocol', e.target.value)}
              {...(formErrors.protocol && { error: true, helperText: formErrors.protocol })}
            />
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
            <CustomTextField
              name="status"
              variant="outlined"
              fullWidth
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              {...(formErrors.status && { error: true, helperText: formErrors.status })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="value">Valor</CustomFormLabel>
            <CustomTextField
              name="value"
              variant="outlined"
              fullWidth
              value={formData.value}
              onChange={(e) => handleChange('value', e.target.value)}
              {...(formErrors.value && { error: true, helperText: formErrors.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="due_date">Data de Vencimento</CustomFormLabel>
            <CustomTextField
              name="due_date"
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
              variant="outlined"
              fullWidth
              value={formData.service_date}
              onChange={(e) => handleChange('service_date', e.target.value)}
              {...(formErrors.service_date && { error: true, helperText: formErrors.service_date })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="department_code">Código do Departamento</CustomFormLabel>
            <CustomTextField
              name="department_code"
              variant="outlined"
              fullWidth
              value={formData.department_code}
              onChange={(e) => handleChange('department_code', e.target.value)}
              {...(formErrors.department_code && { error: true, helperText: formErrors.department_code })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="category_code">Código da Categoria</CustomFormLabel>
            <CustomTextField
              name="category_code"
              variant="outlined"
              fullWidth
              value={formData.category_code}
              onChange={(e) => handleChange('category_code', e.target.value)}
              {...(formErrors.category_code && { error: true, helperText: formErrors.category_code })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="client_supplier_code">Código do Cliente/Fornecedor</CustomFormLabel>
            <CustomTextField
              name="client_supplier_code"
              variant="outlined"
              fullWidth
              value={formData.client_supplier_code}
              onChange={(e) => handleChange('client_supplier_code', e.target.value)}
              {...(formErrors.client_supplier_code && { error: true, helperText: formErrors.client_supplier_code })}
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
            <CustomFormLabel htmlFor="notes">Notas</CustomFormLabel>
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
            <CustomFormLabel htmlFor="approved_at">Data de Aprovação</CustomFormLabel>
            <CustomTextField
              name="approved_at"
              variant="outlined"
              fullWidth
              value={formData.approved_at}
              onChange={(e) => handleChange('approved_at', e.target.value)}
              {...(formErrors.approved_at && { error: true, helperText: formErrors.approved_at })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="paid_at">Data de Pagamento</CustomFormLabel>
            <CustomTextField
              name="paid_at"
              variant="outlined"
              fullWidth
              value={formData.paid_at}
              onChange={(e) => handleChange('paid_at', e.target.value)}
              {...(formErrors.paid_at && { error: true, helperText: formErrors.paid_at })}
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