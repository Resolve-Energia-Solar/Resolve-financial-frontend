'use client';
import React from 'react';
import { Grid, Button, Stack, FormControlLabel } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';

import AutoCompleteUser from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-User';
import AutoCompleteBranch from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-Branch';
import AutoCompleteLead from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-Leads';
import AutoCompleteCampaign from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-Campaign';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDate from '@/app/components/forms/form-custom/FormDateTime';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';

import useSaleForm from '@/hooks/sales/useSaleForm';

export default function FormCustom() {
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useSaleForm();

  const {
    formattedValue,
    handleValueChange,
  } = useCurrencyFormatter();

  const statusOptions = [
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  const router = useRouter();
  useEffect(() => {
    if (success) {
      router.push('/apps/commercial/sale');
    }
  }
  , [success]);

  return (
    <PageContainer title="Criação de venda" description="Criador de Vendas">
      <Breadcrumb title="Criar venda" />
      {success && <Alert severity="success" sx={{ marginBottom: 3 }}>A venda foi criada com sucesso!</Alert>}
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
              onChange={(e) => handleChange('status', e.target.value)}
              {...(formErrors.status && { error: true, helperText: formErrors.status })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormDate
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
                Criar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}