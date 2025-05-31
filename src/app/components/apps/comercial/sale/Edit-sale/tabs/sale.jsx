// EditSale.jsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Stack,
  FormControlLabel,
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useParams } from 'next/navigation';
import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteBranch from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteCampaign from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Campaign';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { useSelector } from 'react-redux';
import useSale from '@/hooks/sales/useSale';
import useSaleForm from '@/hooks/sales/useSaleForm';
import HasPermission from '@/app/components/permissions/HasPermissions';
import SaleProductItem from '@/app/components/apps/saleProduct/SaleProductItem';
import AutoCompleteReasonMultiple from '../../components/auto-complete/Auto-Input-Reasons';
import ProductService from '@/services/productsService';

const EditSale = ({
  saleId = null,
  onClosedModal = null,
  refresh = null,
  onSubmit = null,
  viewOnly = false,
  ...props
}) => {
  const params = useParams();
  let id = saleId;
  if (!saleId) id = params.id;

  const userPermissions = useSelector((state) => state.user.permissions);
  const { enqueueSnackbar } = useSnackbar();

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  useEffect(() => {
    if (onSubmit) {
      onSubmit(handleSave);
    }
  }, [onSubmit]);

  const { loading, error, saleData } = useSale(saleId);
  const [productNames, setProductNames] = useState({});

  useEffect(() => {
    const fetchProductName = async (productId, index) => {
      if (productId) {
        try {
          const product = await ProductService.find(productId);
          setProductNames((prev) => ({
            ...prev,
            [index]: product.name,
          }));
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };
    saleData?.sale_products.forEach((saleProduct, index) => {
      fetchProductName(saleProduct.product, index);
    });
  }, [saleData?.sale_products]);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    successData,
    loading: formLoading,
    success,
  } = useSaleForm(saleData, id);

  const { formattedValue, handleValueChange } = useCurrencyFormatter(
    formData.totalValue,
    (newValue) => handleChange('totalValue', newValue),
  );

  const statusOptions = [
    { value: 'P', label: 'Pendente' },
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
    { value: 'ED', label: 'Em Processo de Distrato' },
  ];

  // Snackbar on success
  useEffect(() => {
    if (successData && success) {
      enqueueSnackbar('Venda salva com sucesso!', { variant: 'success' });
      if (onClosedModal) {
        onClosedModal();
        refresh();
      }
    }
  }, [successData, success]);

  // Snackbar on error
  useEffect(() => {
    if (Object.keys(formErrors).length > 0 && !formLoading) {
      enqueueSnackbar('Erro ao salvar venda. Verifique os campos.', { variant: 'error' });
    }
  }, [formErrors, formLoading]);

  return (
    <Box {...props}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Cliente</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('customerId', id)}
            value={formData.customerId}
            {...(formErrors.customer_id && {
              error: true,
              helperText: formErrors.customer_id,
            })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="branch">Franquia</CustomFormLabel>
          <AutoCompleteBranch
            onChange={(id) => handleChange('branchId', id)}
            disabled={!hasPermission(['accounts.change_branch_field'])}
            value={formData.branchId}
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
            disabled={!hasPermission(['resolve_crm.change_marketing_campaign_field'])}
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
            disabled={!hasPermission(['accounts.change_total_value_field'])}
            onChange={handleValueChange}
            {...(formErrors.total_value && {
              error: true,
              helperText: formErrors.total_value,
            })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status da Venda"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={!hasPermission(['accounts.change_status_sale_field'])}
          />
        </Grid>

        {(formData.status === 'D' || formData.status === 'C') && (
          <Grid item xs={12} sm={12} lg={8}>
            <CustomFormLabel htmlFor="Motivo">
              Motivo do {formData.status === 'C' ? 'Cancelamento' : 'Distrato'}
            </CustomFormLabel>
            <AutoCompleteReasonMultiple
              onChange={(id) => handleChange('cancellationReasonsIds', id)}
              value={formData.cancellationReasonsIds}
              {...(formErrors.cancellationReasonsIds && {
                error: true,
                helperText: formErrors.cancellationReasonsIds,
              })}
            />
          </Grid>
        )}
        <HasPermission
          permissions={['accounts.change_pre_sale_field']}
          userPermissions={userPermissions}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={12}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ margin: 0 }}>
              <CustomFormLabel>Venda</CustomFormLabel>
              <FormControlLabel
                sx={{ margin: 0 }}
                control={
                  <CustomSwitch
                    sx={{ margin: 0 }}
                    checked={formData.isSale}
                    onChange={(e) => handleChange('isSale', e.target.checked)}
                  />
                }
                label={formData.isSale ? 'Pré-Venda' : 'Venda'}
              />
            </Box>
            {hasPermission(['resolve_crm.can_change_fineshed_sale']) && !onSubmit && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={formLoading}
                endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {formLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </Grid>
        </HasPermission>

        {(() => {
          // 1. Monta o dicionário projectByProductId
          const projectByProductId = {};
          saleData?.projects?.forEach((project) => {
            if (project.product) {
              projectByProductId[project.product] = project;
            }
          });

          // 2. Renderiza cada SaleProductItem, passando o project correspondente (ou null)
          return (saleData?.sale_products || []).map((saleProduct, index) => (
            <SaleProductItem
              key={saleProduct.id}
              initialData={saleProduct}
              productName={productNames[index]}
              project={projectByProductId[saleProduct.product] || null}
            />
          ));
        })()}

      </Grid>
    </Box>
  );
};

export default EditSale;
