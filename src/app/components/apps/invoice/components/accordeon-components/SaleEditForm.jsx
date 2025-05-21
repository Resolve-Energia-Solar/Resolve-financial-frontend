import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, FormControlLabel, Button, Autocomplete, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import HasPermission from '@/app/components/permissions/HasPermissions';
import saleService from '@/services/saleService';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import NumberFormatCustom from '@/app/components/shared/NumberFormatCustom';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import FormSkeleton from '../../../comercial/sale/components/salesList/FormSkeleton';

const SaleEditForm = ({ id_sale }) => {
  const [formData, setFormData] = useState({
    customer: '',
    branch: '',
    seller: '',
    sales_supervisor: '',
    sales_manager: '',
    marketing_campaign: '',
    total_value: '',
    status: '',
    payment_status: '',
    billing_date: null,
    cancellation_reasons: [],
    reference_table: '',
    is_pre_sale: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const userPermissions = useSelector((state) => state.user.permissions);
  const { enqueueSnackbar } = useSnackbar();

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const { formattedValue, handleValueChange } = useCurrencyFormatter(
    formData.total_value,
    (newValue) => handleChange('total_value', newValue),
  );

  const statusOptions = [
    { value: 'P', label: 'Pendente' },
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  const financialOptions = [
    { value: 'P', label: 'Pendente' },
    { value: 'L', label: 'Liberada' },
    { value: 'C', label: 'Concluído' },
    { value: 'CA', label: 'Cancelado' },
  ];

  // Buscar dados da venda
  useEffect(() => {
    const fetchSaleData = async () => {
      setLoading(true);
      try {
        const response = await saleService.find(id_sale, {
          fields:
            'customer.id,customer.complete_name,branch,seller,sales_supervisor,sales_manager,marketing_campaign,total_value,status,payment_status,billing_date,cancellation_reasons,reference_table,is_pre_sale',
        });
        console.log('Response:', response);
        setFormData({
          customer: response.customer || '',
          branch: response.branch || '',
          seller: response.seller || '',
          sales_supervisor: response.sales_supervisor || '',
          sales_manager: response.sales_manager || '',
          marketing_campaign: response.marketing_campaign || '',
          total_value: response.total_value || '',
          status: response.status || '',
          payment_status: response.payment_status || '',
          billing_date: response.billing_date || null,
          cancellation_reasons: response.cancellation_reasons || [],
          reference_table: response.reference_table || '',
          is_pre_sale: response.is_pre_sale,
        });
      } catch (err) {
        console.error('Erro ao buscar dados da venda:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaleData();
  }, [id_sale]);

  const handleSave = useCallback(async () => {
    try {
      setSaveLoading(true);
      await saleService.update(id_sale, formData);
      enqueueSnackbar('Dados salvos com sucesso!', { variant: 'success' });
    } catch (error) {
      setFormErrors(error.response.data);
      console.error('Erro ao salvar dados:', error);
      enqueueSnackbar('Erro ao salvar dados.', { variant: 'error' });
    } finally {
      setSaveLoading(false);
    }
  }, [id_sale, formData, enqueueSnackbar]);

  const customerExtraParams = useMemo(() => ({ fields: 'id,complete_name' }), []);
  const mapCustomerResponse = useCallback(
    (data) =>
      data.results.map((item) => ({
        label: item.complete_name,
        value: item.id,
      })),
    [],
  );
  const handleCustomerChange = useCallback(
    (option) => {
      handleChange('customer', option ? option.value : '');
    },
    [handleChange],
  );

  // Franquia
  const branchExtraParams = useMemo(() => ({ fields: 'id,name' }), []);
  const mapBranchResponse = useCallback(
    (data) =>
      data.results.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [],
  );
  const handleBranchChange = useCallback(
    (option) => {
      handleChange('branch', option ? option.value : '');
    },
    [handleChange],
  );

  // Vendedor
  const sellerExtraParams = useMemo(() => ({ fields: 'id,complete_name' }), []);
  const mapSellerResponse = useCallback(
    (data) =>
      data.results.map((item) => ({
        label: item.complete_name,
        value: item.id,
      })),
    [],
  );
  const handleSellerChange = useCallback(
    (option) => {
      handleChange('seller', option ? option.value : '');
    },
    [handleChange],
  );

  // Supervisor de Vendas
  const supervisorExtraParams = useMemo(() => ({ fields: 'id,complete_name' }), []);
  const mapSupervisorResponse = useCallback(
    (data) =>
      data.results.map((item) => ({
        label: item.complete_name,
        value: item.id,
      })),
    [],
  );
  const handleSupervisorChange = useCallback(
    (option) => {
      handleChange('sales_supervisor', option ? option.value : '');
    },
    [handleChange],
  );

  // Gerente de Vendas
  const managerExtraParams = useMemo(() => ({ fields: 'id,complete_name' }), []);
  const mapManagerResponse = useCallback(
    (data) =>
      data.results.map((item) => ({
        label: item.complete_name,
        value: item.id,
      })),
    [],
  );
  const handleManagerChange = useCallback(
    (option) => {
      handleChange('sales_manager', option ? option.value : '');
    },
    [handleChange],
  );

  // Campanha de Marketing
  const campaignExtraParams = useMemo(() => ({ fields: 'id,name' }), []);
  const mapCampaignResponse = useCallback(
    (data) =>
      data.results.map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [],
  );
  const handleCampaignChange = useCallback(
    (option) => {
      handleChange('marketing_campaign', option ? option.value : '');
    },
    [handleChange],
  );

  // Motivo do Cancelamento/Distrato
  const cancellationExtraParams = useMemo(() => ({}), []);
  const mapCancellationResponse = useCallback(
    (data) =>
      data.results.map((item) => ({
        label: item.reason,
        value: item.id,
      })),
    [],
  );
  const handleCancellationChange = useCallback((option) => {
    setFormData((prev) => ({
      ...prev,
      cancellation_reasons: option ? option.map((opt) => opt.value) : [],
    }));
  }, []);

  if (loading) {
    return <FormSkeleton fields={6} />;
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        padding: 2,
        flexDirection: 'column',
      }}
    >
      <Grid container spacing={1} sx={{ mt: 0 }}>
        {/* Cliente */}
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="customer">Cliente</CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Cliente"
            noOptionsText="Nenhum cliente encontrado"
            endpoint="/api/users"
            queryParam="complete_name__icontains"
            extraParams={customerExtraParams}
            value={formData.customer}
            onChange={handleCustomerChange}
            mapResponse={mapCustomerResponse}
            {...(formErrors.customer_id && { error: true, helperText: formErrors.customer_id })}
          />
        </Grid>

        {/* Franquia */}
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="branch">Franquia</CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Franquia"
            noOptionsText="Nenhuma franquia encontrada"
            endpoint="/api/branches"
            queryParam="name__icontains"
            extraParams={branchExtraParams}
            value={formData.branch}
            onChange={handleBranchChange}
            mapResponse={mapBranchResponse}
            {...(formErrors.branch_id && { error: true, helperText: formErrors.branch_id })}
          />
        </Grid>

        {/* Vendedor */}
        <HasPermission
          permissions={['accounts.change_seller_field']}
          userPermissions={userPermissions}
        >
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="seller">Vendedor</CustomFormLabel>
            <GenericAsyncAutocompleteInput
              label="Vendedor"
              noOptionsText="Nenhum vendedor encontrado"
              endpoint="/api/users"
              queryParam="complete_name__icontains"
              extraParams={sellerExtraParams}
              value={formData.seller}
              onChange={handleSellerChange}
              mapResponse={mapSellerResponse}
              {...(formErrors.seller_id && { error: true, helperText: formErrors.seller_id })}
            />
          </Grid>
        </HasPermission>

        {/* Supervisor de Vendas */}
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="salesSupervisor">Supervisor de Vendas</CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Supervisor de Vendas"
            noOptionsText="Nenhum supervisor encontrado"
            endpoint="/api/users"
            queryParam="complete_name__icontains"
            extraParams={supervisorExtraParams}
            value={formData.sales_supervisor}
            onChange={handleSupervisorChange}
            mapResponse={mapSupervisorResponse}
            {...(formErrors.sales_supervisor_id && {
              error: true,
              helperText: formErrors.sales_supervisor_id,
            })}
          />
        </Grid>

        {/* Gerente de Vendas */}
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="salesManager">Gerente de Vendas</CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Gerente de Vendas"
            noOptionsText="Nenhum gerente encontrado"
            endpoint="/api/users"
            queryParam="complete_name__icontains"
            extraParams={managerExtraParams}
            value={formData.sales_manager}
            onChange={handleManagerChange}
            mapResponse={mapManagerResponse}
            {...(formErrors.sales_manager_id && {
              error: true,
              helperText: formErrors.sales_manager_id,
            })}
          />
        </Grid>

        {/* Campanha de Marketing */}
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="marketingCampaign">Campanha de Marketing</CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Campanha de Marketing"
            noOptionsText="Nenhuma campanha encontrada"
            endpoint="/api/marketing-campaigns"
            queryParam="name__icontains"
            extraParams={campaignExtraParams}
            value={formData.marketing_campaign}
            onChange={handleCampaignChange}
            mapResponse={mapCampaignResponse}
            {...(formErrors.marketing_campaign_id && {
              error: true,
              helperText: formErrors.marketing_campaign_id,
            })}
          />
        </Grid>

        {/* Valor */}
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="total_value">Valor</CustomFormLabel>
          <CustomTextField
            name="total_value"
            placeholder="R$ 20.000,00"
            variant="outlined"
            fullWidth
            value={formattedValue}
            disabled={!hasPermission(['accounts.change_total_value_field'])}
            onChange={handleValueChange}
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
            {...(formErrors.total_value && { error: true, helperText: formErrors.total_value })}
          />
        </Grid>

        {/* Status da Venda */}
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status da Venda"
            options={statusOptions}
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value,
                cancellation_reasons:
                  e.target.value !== 'C' && e.target.value !== 'D' ? [] : prev.cancellation_reasons,
              }))
            }
            disabled={!hasPermission(['accounts.change_status_sale_field'])}
          />
        </Grid>

        {/* Status Financeiro */}
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status Financeiro"
            options={financialOptions}
            value={formData.payment_status}
            onChange={(e) => setFormData((prev) => ({ ...prev, payment_status: e.target.value }))}
            disabled={!hasPermission(['financial.change_status_financial'])}
          />
        </Grid>

        {/* Data de Competência */}
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="billing_date">Data de competência</CustomFormLabel>
          <CustomTextField
            type="date"
            name="billing_date"
            variant="outlined"
            fullWidth
            value={formData.billing_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, billing_date: e.target.value }))}
            disabled={!hasPermission(['resolve_crm.can_change_billing_date'])}
            {...(formErrors.billing_date && { error: true, helperText: formErrors.billing_date })}
          />
        </Grid>

        {/* Motivo do Cancelamento/Distrato (condicional) */}
        {(formData.status === 'D' || formData.status === 'C') && formData.is_pre_sale === false && (
          <Grid item xs={12} sm={12} lg={8}>
            <CustomFormLabel htmlFor="cancellation_reason">
              Motivo do {formData.status === 'C' ? 'Cancelamento' : 'Distrato'}
            </CustomFormLabel>
            <GenericAsyncAutocompleteInput
              label={`Motivo do ${formData.status === 'C' ? 'Cancelamento' : 'Distrato'}`}
              noOptionsText="Nenhum motivo encontrado"
              endpoint="/api/cancellation_reasons"
              queryParam="name__icontains"
              extraParams={cancellationExtraParams}
              multiple
              value={formData.cancellation_reasons}
              onChange={handleCancellationChange}
              mapResponse={mapCancellationResponse}
              {...(formErrors.cancellation_reasons && {
                error: true,
                helperText: formErrors.cancellation_reasons,
              })}
            />
          </Grid>
        )}

        {/* Tabela de Referência */}
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="reference_table">Tabela de Referência</CustomFormLabel>
          <Autocomplete
            freeSolo
            options={[
              '1º Feirão 2025 - Pará',
              '1º Feirão 2025 - Nordeste',
              '1º Feirão 2025 - Amapá',
              'Retenção 12%',
              'Retenção 15%',
              'Retenção 17%',
            ]}
            value={formData.reference_table || ''}
            onChange={(event, newValue) =>
              setFormData((prev) => ({ ...prev, reference_table: newValue }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Tabela de Referência" variant="outlined" />
            )}
            disabled={!hasPermission(['resolve_crm.can_change_billing_date'])}
          />
        </Grid>

        {/* Pré-Venda / Venda */}
        <HasPermission
          permissions={['accounts.change_pre_sale_field']}
          userPermissions={userPermissions}
        >
          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel>Venda</CustomFormLabel>
            <FormControlLabel
              control={
                <CustomSwitch
                  checked={formData.is_pre_sale}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_pre_sale: e.target.checked }))
                  }
                />
              }
              label={formData.is_pre_sale ? 'Pré-Venda' : 'Venda'}
            />
          </Grid>
        </HasPermission>
      </Grid>

      {/* Botão de Salvar */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saveLoading}>
          {saveLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  );
};

export default SaleEditForm;
