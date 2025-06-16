'use client';
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
  Autocomplete,
  TextField,
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
import FormPageSkeleton from '@/app/components/apps/comercial/sale/components/FormPageSkeleton';
import useSale from '@/hooks/sales/useSale';
import useSaleForm from '@/hooks/sales/useSaleForm';
import { use, useEffect, useState } from 'react';
import PaymentCard from '@/app/components/apps/invoice/components/paymentList/card';
import documentTypeService from '@/services/documentTypeService';
import Attachments from '@/app/components/shared/Attachments';
import ChecklistSales from '../../../checklist/Checklist-list/ChecklistSales';
import HasPermission from '@/app/components/permissions/HasPermissions';
import SendContractButton from '../../../contractSubmissions/Send-contract';
import ContractSubmissions from '../../../contractSubmissions/contract-list';
import SchedulesInspections from '../../../project/components/SchedulesInspections';
import History from '@/app/components/apps/history';
import Comment from '../../../comment';
import TagList from '@/app/components/tags/TagList';
import AutoCompleteReasonMultiple from '../components/auto-complete/Auto-Input-Reasons';
import Customer from '../../../sale/Customer';
import Phones from '../../../sale/phones';
import Addresses from '../../../sale/Adresses';
import useCanEditUser from '@/hooks/users/userCanEdit';
import productService from '@/services/productsService';
import SaleProductItem from '../../../saleProduct/SaleProductItem';
import getContentType from '@/utils/getContentType';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      <Box>{children}</Box>
    </div>
  );
}

const EditSaleTabs = ({
  saleId = null,
  onClosedModal = null,
  refresh = null,
  onRefresh,
  ...props
}) => {
  const params = useParams();
  let id = saleId;
  if (!saleId) id = params.id;

  const { canEdit } = useCanEditUser(saleId);

  const { enqueueSnackbar } = useSnackbar();

  const formatFieldName = (fieldName) => {
    const fieldLabels = {
      customer_id: 'Cliente',
      seller_id: 'Vendedor',
      sales_supervisor_id: 'Supervisor de Vendas',
      sales_manager_id: 'Gerente de Vendas',
      branch_id: 'Franquia',
    };

    return fieldLabels[fieldName] || fieldName;
  };

  const userPermissions = useSelector((state) => state.user.permissions);

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  const id_sale = id;

  const { loading, error, saleData, fetchSale } = useSale(id);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    successData,
    loading: formLoading,
    success,
  } = useSaleForm(saleData, id);

  const [saleContentTypeId, setSaleContentTypeId] = useState(null);

  useEffect(() => {
    getContentType('resolve_crm', 'sale')
      .then((contentTypeId) => {
        setSaleContentTypeId(contentTypeId);
      })
      .catch((error) => {
        console.error('Error fetching content type ID:', error);
      });
  }, []);

  const [documentTypes, setDocumentTypes] = useState([]);

  const { formattedValue, numericValue, handleValueChange } = useCurrencyFormatter(
    formData.totalValue,
    (newValue) => handleChange('totalValue', newValue)
  );

  const statusOptions = [
    { value: 'P', label: 'Pendente' },
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
    { value: 'ED', label: 'Em Processo de Distrato' },
  ];

  const financialOptions = [
    { value: 'P', label: 'Pendente' },
    { value: 'L', label: 'Liberada' },
    { value: 'C', label: 'Concluído' },
    { value: 'CA', label: 'Cancelado' },
  ];

  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await documentTypeService.index({
          app_label__in: 'contracts',
          limit: 30,
        });
        setDocumentTypes(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (successData && success) {
      if (onClosedModal) {
        onClosedModal();
        refresh();
      }
    }
  }, [successData, success]);

  const [productNames, setProductNames] = useState({});

  useEffect(() => {
    const fetchProductName = async (productId, index) => {
      if (productId) {
        try {
          const product = await productService.find(productId);
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

  return (
    <Box {...props}>
      <Tabs
        value={value}
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Abas de edição da venda"
      >
        <Tab label="Info. Gerais" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Vistoria" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label="Venda" id="tab-2" aria-controls="tabpanel-2" />
        <Tab label="Anexos" id="tab-3" aria-controls="tabpanel-3" />
        <Tab label="Pagamentos" id="tab-4" aria-controls="tabpanel-4" />
        <Tab label="Checklist" id="tab-5" aria-controls="tabpanel-5" />
        <Tab label="Envios" id="tab-6" aria-controls="tabpanel-6" />
        <Tab label="Histórico" id="tab-7" aria-controls="tabpanel-7" />
        <Tab label="Comentários" id="tab-8" aria-controls="tabpanel-8" />
      </Tabs>

      {loading ? (
        <FormPageSkeleton />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box
          sx={{
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <TabPanel value={value} index={0}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                display: 'flex',
                padding: 0,
                flexDirection: 'column',
              }}
            >
              <Customer data={saleData.customer} onRefresh={onRefresh} />
              <Phones
                data={saleData?.customer?.phone_numbers}
                onRefresh={fetchSale}
                userId={saleData.customer?.id}
              />
              <Addresses
                data={saleData.customer?.addresses}
                onRefresh={fetchSale}
                userId={saleData.customer?.id}
              />
            </Box>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <SchedulesInspections userId={saleData.customer?.id} saleId={id_sale} />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                display: 'flex',
                padding: 0,
                flexDirection: 'column',
              }}
            >
              <TagList appLabel="resolve_crm" model="sale" objectId={id_sale} />
              <Grid container spacing={1} sx={{ mt: 0 }}>
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
                <HasPermission
                  permissions={['accounts.change_seller_field']}
                  userPermissions={userPermissions}
                >
                  <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="name">Vendedor</CustomFormLabel>
                    <AutoCompleteUser
                      onChange={(id) => handleChange('sellerId', id)}
                      value={formData.sellerId}
                      disabled={!hasPermission(['accounts.change_seller_field'])}
                      {...(formErrors.seller_id && {
                        error: true,
                        helperText: formErrors.seller_id,
                      })}
                    />
                  </Grid>
                </HasPermission>
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
                    name="totalValue"
                    placeholder="R$ 20.000,00"
                    variant="outlined"
                    fullWidth
                    value={formattedValue}
                    disabled={!hasPermission(['accounts.change_total_value_field'])}
                    onChange={handleValueChange}
                    {...(formErrors.totalValue && {
                      error: true,
                      helperText: formErrors.totalValue,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <FormSelect
                    label="Status da Venda"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      handleChange('status', newStatus);
                      if (newStatus !== 'C' && newStatus !== 'D') {
                        handleChange('cancellationReasonsIds', []);
                      }
                    }}
                    disabled={!hasPermission(['accounts.change_status_sale_field'])}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <FormSelect
                    label="Status Financeiro"
                    options={financialOptions}
                    value={formData.payment_status}
                    onChange={(e) => handleChange('payment_status', e.target.value)}
                    disabled={!hasPermission(['financial.change_status_financial'])}
                  />
                </Grid>

                <HasPermission
                  permissions={['resolve_crm.can_change_billing_date']}
                  userPermissions={userPermissions}
                >
                  <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="billing_date">Data de competência</CustomFormLabel>
                    <CustomTextField
                      type="date"
                      name="billing_date"
                      variant="outlined"
                      fullWidth
                      value={formData.billing_date}
                      onChange={(e) => handleChange('billing_date', e.target.value)}
                      disabled={!hasPermission(['resolve_crm.can_change_billing_date'])}
                      {...(formErrors.billing_date && {
                        error: true,
                        helperText: formErrors.billing_date,
                      })}
                    />
                  </Grid>
                </HasPermission>

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
                    onChange={(event, newValue) => handleChange('reference_table', newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Tabela de Referência" variant="outlined" />
                    )}
                    disabled={!hasPermission(['resolve_crm.can_change_billing_date'])}
                  />
                </Grid>

                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="name">Premiação</CustomFormLabel>
                  <GenericAsyncAutocompleteInput
                    name="reward"
                    label="Premiação"
                    endpoint='api/rewards'
                    queryParam='name__icontains'
                    extraParams={{ fields: ['id', 'name', 'is_active'], limit: 30 }}
                    value={formData.reward?.id || formData.reward}
                    onChange={(value) => handleChange('reward', value?.value || value)}
                    mapResponse={(response => response.results.map(r => ({
                      value: r.id,
                      label: `${r.name}${r.is_active ? '' : ' (Inativo)'}`,
                    })))}
                  />
                </Grid>

                <HasPermission
                  permissions={['accounts.change_pre_sale_field']}
                  userPermissions={userPermissions}
                >
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
                  </Grid>
                </HasPermission>

                {(() => {
                  const projectByProductId = {};
                  saleData.projects?.forEach((project) => {
                    if (project.product) {
                      projectByProductId[project.product] = project;
                    }
                  });

                  return (saleData.sale_products || []).map((saleProduct, index) => (
                    <SaleProductItem
                      key={saleProduct.id}
                      initialData={saleProduct}
                      productName={productNames[index]}
                      onUpdated={fetchSale}
                      project={projectByProductId[saleProduct.product] || null}
                    />
                  ));
                })()}

              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={value} index={3}>
            <Attachments
              contentType={saleContentTypeId}
              objectId={id_sale}
              documentTypes={documentTypes}
              canEdit={canEdit}
            />
          </TabPanel>

          <TabPanel value={value} index={4}>
            <Box sx={{ mt: 3 }}>
              <PaymentCard sale={id_sale} />
            </Box>
          </TabPanel>

          <TabPanel value={value} index={5}>
            <ChecklistSales saleId={id_sale} />
          </TabPanel>

          <TabPanel value={value} index={6}>
            <ContractSubmissions sale={saleData} />
          </TabPanel>

          <TabPanel value={value} index={7}>
            <History contentType={saleContentTypeId} objectId={id_sale} />
          </TabPanel>

          <TabPanel value={value} index={8}>
            <Comment appLabel={'resolve_crm'} model={'sale'} objectId={id_sale} />
          </TabPanel>

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            {onClosedModal && (
              <Button variant="contained" color="primary" onClick={onClosedModal}>
                Fechar
              </Button>
            )}
            {value === 2 && (
              <Grid container spacing={2}>
                <Grid item>
                  <SendContractButton sale={saleData} />
                </Grid>
                {canEdit && (
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={async () => {
                        await handleSave();
                        if (formErrors && Object.keys(formErrors).length > 0) {
                          const errorMessages = Object.entries(formErrors)
                            .map(
                              ([field, messages]) =>
                                `${formatFieldName(field)}: ${messages.join(', ')}`,
                            )
                            .join(', ');
                          enqueueSnackbar(errorMessages, { variant: 'error' });
                        } else {
                          enqueueSnackbar('Alterações salvas com sucesso!', { variant: 'success' });
                        }
                      }}
                      disabled={formLoading}
                      endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {formLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </Grid>
                )}
              </Grid>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default EditSaleTabs;