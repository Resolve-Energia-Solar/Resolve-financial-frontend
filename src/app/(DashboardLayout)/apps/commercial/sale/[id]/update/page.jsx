'use client';
import { Grid, Button, Stack, FormControlLabel } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useParams } from 'next/navigation';
import Alert from '@mui/material/Alert';

import AutoCompleteUser from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-User';
import AutoCompleteBranch from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-Branch';
import AutoCompleteLead from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-Leads';
import AutoCompleteCampaign from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-Campaign';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDateTime from '@/app/components/forms/form-custom/FormDateTime';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';

import useSale from '@/hooks/sales/useSale';
import useSaleForm from '@/hooks/sales/useSaleForm';

export default function FormCustom() {
  const params = useParams();
  const { id } = params;
  
  const { loading, error, saleData } = useSale(id);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useSaleForm(saleData, id);

  const {
    formattedValue,
    handleValueChange,
  } = useCurrencyFormatter(formData.totalValue);

  const statusOptions = [
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Edição de venda" description="Editor de Vendas">
      <Breadcrumb title="Editar venda" />
      {success && <Alert severity="success" sx={{ marginBottom: 3 }}>A venda foi atualizada com sucesso!</Alert>}
      <ParentCard title="Venda">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="leads">Leads</CustomFormLabel>
            <AutoCompleteLead 
              onChange={(id) => handleChange('leadId', id)} 
              value={formData.leadId} 
              {...(formErrors.lead_id && { error: true, helperText: formErrors.lead_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Cliente</CustomFormLabel>
            <AutoCompleteUser 
              onChange={(id) => handleChange('customerId', id)} 
              value={formData.customerId} 
              {...(formErrors.customer_id && { error: true, helperText: formErrors.customer_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="branch">Franquia</CustomFormLabel>
            <AutoCompleteBranch 
              onChange={(id) => handleChange('branchId', id)}
              value={formData.branchId} 
              {...(formErrors.branch_id && { error: true, helperText: formErrors.branch_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Vendedor</CustomFormLabel>
            <AutoCompleteUser 
              onChange={(id) => handleChange('sellerId', id)} 
              value={formData.sellerId} 
              {...(formErrors.seller_id && { error: true, helperText: formErrors.seller_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Supervisor de Vendas</CustomFormLabel>
            <AutoCompleteUser 
              onChange={(id) => handleChange('salesSupervisorId', id)} 
              value={formData.salesSupervisorId} 
              {...(formErrors.sales_supervisor_id && { error: true, helperText: formErrors.sales_supervisor_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Gerente de Vendas</CustomFormLabel>
            <AutoCompleteUser 
              onChange={(id) => handleChange('salesManagerId', id)} 
              value={formData.salesManagerId} 
              {...(formErrors.sales_manager_id && { error: true, helperText: formErrors.sales_manager_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="branch">Campanha de Marketing</CustomFormLabel>
            <AutoCompleteCampaign 
              onChange={(id) => handleChange('marketingCampaignId', id)}
              value={formData.marketingCampaignId} 
              {...(formErrors.marketing_campaign_id && { error: true, helperText: formErrors.marketing_campaign_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="valor">Valor</CustomFormLabel>
            <CustomTextField
              name="total_value"
              placeholder="R$ 20.000,00"
              variant="outlined"
              fullWidth
              value={formattedValue}
              onChange={(e) => handleValueChange(e, handleChange)}
              {...(formErrors.total_value && { error: true, helperText: formErrors.total_value })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormSelect
              label="Status da Venda"
              options={statusOptions}
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormDateTime
              label="Conclusão do Documento"
              name="document_completion_date"
              value={formData.documentCompletionDate}
              onChange={(newValue) => handleChange('documentCompletionDate', newValue)}
              {...(formErrors.document_completion_date && { error: true, helperText: formErrors.document_completion_date })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel>Venda</CustomFormLabel>
            <FormControlLabel
              control={
                <CustomSwitch 
                  checked={formData.isSale} 
                  onChange={(e) => handleChange('isSale', e.target.checked)} 
                />
              }
              label={formData.isSale ? 'Pré-Venda' : 'Venda'}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Editar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}