'use client';
import { Grid, Button, Stack, FormControlLabel, Tabs, Tab, Box, Typography } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useParams } from 'next/navigation';

import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteBranch from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteLead from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Leads';
import AutoCompleteCampaign from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Campaign';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDateTime from '@/app/components/forms/form-custom/FormDateTime';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import DocumentAttachments from '@/app/components/apps/comercial/sale/components/attachments/attachments';
import { useSelector } from 'react-redux';
import FormPageSkeleton from '../components/FormPageSkeleton';

import useSale from '@/hooks/sales/useSale';
import useSaleForm from '@/hooks/sales/useSaleForm';
import { useState } from 'react';

const EditSalePage = () => {
  const userPermissions = useSelector((state) => state.user.permissions);

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  const params = useParams();
  const { id } = params;

  const id_sale = id;
  const context_type_sale = 44;

  const { loading, error, saleData } = useSale(id);
  const { formData, handleChange, handleSave, formErrors, success } = useSaleForm(saleData, id);

  const { formattedValue, handleValueChange } = useCurrencyFormatter(formData.totalValue);

  const statusOptions = [
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChangeTab}>
        <Tab label="Venda" />
        <Tab label="Anexos" />
      </Tabs>
      {loading ? (
        <FormPageSkeleton />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {value === 0 && (
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
                  disabled={!hasPermission(['accounts.can_change_branch_field'])}
                  value={formData.branchId}
                  {...(formErrors.branch_id && { error: true, helperText: formErrors.branch_id })}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Vendedor</CustomFormLabel>
                <AutoCompleteUser
                  onChange={(id) => handleChange('sellerId', id)}
                  value={formData.sellerId}
                  disabled={!hasPermission(['accounts.can_change_seller_field'])}
                  {...(formErrors.seller_id && { error: true, helperText: formErrors.seller_id })}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Supervisor de Vendas</CustomFormLabel>
                <AutoCompleteUser
                  onChange={(id) => handleChange('salesSupervisorId', id)}
                  value={formData.salesSupervisorId}
                  disabled={!hasPermission(['accounts.can_change_supervisor_field'])}
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
                  disabled={!hasPermission(['accounts.can_change_usermanger_field'])}
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
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Salvar Alterações
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          )}
        </>
      )}

      {value === 1 && <DocumentAttachments objectId={id_sale} contentType={context_type_sale} />}
    </Box>
  );
};

export default EditSalePage;
