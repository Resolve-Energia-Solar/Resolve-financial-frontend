'use client';
import React from 'react';
import { Grid, Button, Stack, FormControlLabel, Box } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteBranch from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteLead from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Leads';
import AutoCompleteCampaign from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Campaign';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDate from '@/app/components/forms/form-custom/FormDateTime';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { useSelector } from 'react-redux';

import useSaleForm from '@/hooks/sales/useSaleForm';

const CreateSale = ({ onClosedModal = null }) => {
  const userPermissions = useSelector((state) => state.user.permissions);

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  const { formData, handleChange, handleSave, formErrors, success } = useSaleForm();

  const { formattedValue, handleValueChange } = useCurrencyFormatter();

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
  }, [success]);

  return (
    <Box>
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
            disabled={!hasPermission(['accounts.change_branch_field'])}
            {...(formErrors.branch_id && { error: true, helperText: formErrors.branch_id })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Vendedor</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('sellerId', id)}
            value={formData.sellerId}
            disabled={!hasPermission(['accounts.change_seller_field'])}
            {...(formErrors.seller_id && { error: true, helperText: formErrors.seller_id })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Supervisor de Vendas</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('salesSupervisorId', id)}
            value={formData.salesSupervisorId}
            disabled={!hasPermission(['accounts.change_supervisor_field'])}
            {...(formErrors.sales_supervisor_id && {
              error: true,
              helperText: formErrors.sales_supervisor_id,
            })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Gerente de Vendas</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('salesManagerId', id)}
            value={formData.salesManagerId}
            disabled={!hasPermission(['accounts.change_usermanager_field'])}
            {...(formErrors.sales_manager_id && {
              error: true,
              helperText: formErrors.sales_manager_id,
            })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="branch">Campanha de Marketing</CustomFormLabel>
          <AutoCompleteCampaign
            onChange={(id) => handleChange('marketingCampaignId', id)}
            value={formData.marketingCampaignId}
            {...(formErrors.marketing_campaign_id && {
              error: true,
              helperText: formErrors.marketing_campaign_id,
            })}
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
            {...(formErrors.document_completion_date && {
              error: true,
              helperText: formErrors.document_completion_date,
            })}
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
            {onClosedModal && (
              <Button variant="contained" color="primary" onClick={onClosedModal}>
                Fechar
              </Button>
            )}
            <Button variant="contained" color="primary" onClick={handleSave}>
              Criar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateSale;
