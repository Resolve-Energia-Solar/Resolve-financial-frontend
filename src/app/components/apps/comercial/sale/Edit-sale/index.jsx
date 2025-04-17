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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconTools } from '@tabler/icons-react';
import CustomFieldMoney from '../../../invoice/components/CustomFieldMoney';
import productService from '@/services/productsService';
import useSaleProductsForm from '@/hooks/saleProducts/saleProductsForm';
import useSaleProducts from '@/hooks/saleProducts/useSaleProducts';

const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

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

  const { 
    loading: saleLoading, 
    error: errorLoading, 
    saleData, 
    fetchSale 
  } = useSale(id);

  const { 
    loading: saleProductsLoading, 
    error: errorSaleProducts, 
    saleProductsData, 
    fetchSaleProducts,
  } = useSaleProducts(id);

  console.log('saleData', saleData);
  console.log('saleProductsData', saleProductsData);

  const {
    formData: saleFormData,
    handleChange: handleSaleChange,
    handleSave: handleSaleSave,
    formErrors: saleFormErrors,
    successData: saleSuccessData,
    loading: saleFormLoading,
    success: saleSuccess,
  } = useSaleForm(saleData, id);

  const {
    formData: saleProductsFormData,
    handleSaleProductsChange,
    handleSaveSaleProducts,
    formErrors: saleProductsFormErrors,
    success: saleProductsSuccess,
    loading: saleProductsFormLoading,
    successData: saleProductsSuccessData,
  } = useSaleProductsForm(saleProductsData, id);

  const [documentTypes, setDocumentTypes] = useState([]);

  const { formattedValue, handleValueChange } = useCurrencyFormatter(saleFormData.totalValue);

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
    if (saleSuccessData && saleSuccess) {
      if (onClosedModal) {
        onClosedModal();
        refresh();
      }
    }
  }, [saleSuccessData, saleSuccess]);

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
    saleProductsData?.sale_products?.forEach((saleProduct, index) => {
      fetchProductName(saleProduct.product, index);
    });

  }, [saleProductsData?.sale_products]);

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

      {saleLoading ? (
        <FormPageSkeleton />
      ) : errorSaleProducts ? (
        <Typography color="error">{errorSaleProducts}</Typography>
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
              <Customer data={saleData?.customer} onRefresh={onRefresh} />
              <Phones
                data={saleData?.customer.phone_numbers}
                onRefresh={fetchSale}
                userId={saleData?.customer.id}
              />
              <Addresses
                data={saleData?.customer.addresses}
                onRefresh={fetchSale}
                userId={saleData?.customer.id}
              />
            </Box>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <SchedulesInspections userId={saleData?.customer.id} saleId={id_sale} />
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
                    onChange={(id) => handleSaleChange('customerId', id)}
                    value={saleFormData.customerId}
                    {...(saleFormErrors.customer_id && {
                      error: true,
                      helperText: saleFormErrors.customer_id,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="branch">Franquia</CustomFormLabel>
                  <AutoCompleteBranch
                    onChange={(id) => handleSaleChange('branchId', id)}
                    disabled={!hasPermission(['accounts.change_branch_field'])}
                    value={saleFormData.branchId}
                    {...(saleFormErrors.branch_id && { error: true, helperText: saleFormErrors.branch_id })}
                  />
                </Grid>
                <HasPermission
                  permissions={['accounts.change_seller_field']}
                  userPermissions={userPermissions}
                >
                  <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="name">Vendedor</CustomFormLabel>
                    <AutoCompleteUser
                      onChange={(id) => handleSaleChange('sellerId', id)}
                      value={saleFormData.sellerId}
                      disabled={!hasPermission(['accounts.change_seller_field'])}
                      {...(saleFormErrors.seller_id && {
                        error: true,
                        helperText: saleFormErrors.seller_id,
                      })}
                    />
                  </Grid>
                </HasPermission>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="name">Supervisor de Vendas</CustomFormLabel>
                  <AutoCompleteUser
                    onChange={(id) => handleSaleChange('salesSupervisorId', id)}
                    value={saleFormData.salesSupervisorId}
                    disabled={!hasPermission(['accounts.change_supervisor_field'])}
                    {...(saleFormErrors.sales_supervisor_id && {
                      error: true,
                      helperText: saleFormErrors.sales_supervisor_id,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="name">Gerente de Vendas</CustomFormLabel>
                  <AutoCompleteUser
                    onChange={(id) => handleSaleChange('salesManagerId', id)}
                    value={saleFormData.salesManagerId}
                    disabled={!hasPermission(['accounts.change_usermanager_field'])}
                    {...(saleFormErrors.sales_manager_id && {
                      error: true,
                      helperText: saleFormErrors.sales_manager_id,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="branch">Campanha de Marketing</CustomFormLabel>
                  <AutoCompleteCampaign
                    onChange={(id) => handleSaleChange('marketingCampaignId', id)}
                    value={saleFormData.marketingCampaignId}
                    disabled={!hasPermission(['resolve_crm.change_marketing_campaign_field'])}
                    {...(saleFormErrors.marketing_campaign_id && {
                      error: true,
                      helperText: saleFormErrors.marketing_campaign_id,
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
                    onChange={(e) => handleValueChange(e, handleChange)}
                    {...(saleFormErrors.total_value && {
                      error: true,
                      helperText: saleFormErrors.total_value,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <FormSelect
                    label="Status da Venda"
                    options={statusOptions}
                    value={saleFormData.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      handleSaleChange('status', newStatus);
                      if (newStatus !== 'C' && newStatus !== 'D') {
                        handleSaleChange('cancellationReasonsIds', []);
                      }
                    }}
                    disabled={!hasPermission(['accounts.change_status_sale_field'])}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <FormSelect
                    label="Status Financeiro"
                    options={financialOptions}
                    value={saleFormData.payment_status}
                    onChange={(e) => handleSaleChange('payment_status', e.target.value)}
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
                      value={saleFormData.billing_date}
                      onChange={(e) => handleSaleChange('billing_date', e.target.value)}
                      disabled={!hasPermission(['resolve_crm.can_change_billing_date'])}
                      {...(saleFormErrors.billing_date && {
                        error: true,
                        helperText: saleFormErrors.billing_date,
                      })}
                    />
                  </Grid>
                </HasPermission>

                {(formData.status === 'D' || formData.status === 'C') && (
                    <Grid item xs={12} sm={12} lg={8}>
                      <CustomFormLabel htmlFor="Motivo">
                        Motivo do {saleFormData.status === 'C' ? 'Cancelamento' : 'Distrato'}
                      </CustomFormLabel>
                      <AutoCompleteReasonMultiple
                        onChange={(id) => handleSaleChange('cancellationReasonsIds', id)}
                        value={saleFormData.cancellationReasonsIds}
                        {...(saleFormErrors.cancellationReasonsIds && {
                          error: true,
                          helperText: saleFormErrors.cancellationReasonsIds,
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
                    value={saleFormData.reference_table || ''}
                    onChange={(event, newValue) => handleSaleChange('reference_table', newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Tabela de Referência" variant="outlined" />
                    )}
                    disabled={!hasPermission(['resolve_crm.can_change_billing_date'])}
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
                          checked={saleFormData.isSale}
                          onChange={(e) => handleSaleChange('isSale', e.target.checked)}
                        />
                      }
                      label={saleFormData.isSale ? 'Pré-Venda' : 'Venda'}
                    />
                  </Grid>
                </HasPermission>

                {(saleProductsData?.sale_products || []).map((saleProduct, index) => (
                  <Grid item xs={12} sm={12} lg={12}>
                    <Accordion
                      key={saleProduct.id}
                      sx={{
                        borderRadius: '12px',
                        mb: 1,
                        boxShadow: 3,
                        // backgroundColor: '#F5F5F5',
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                          <Grid
                            item
                            xs={1}
                            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
                          >
                            <IconTools size={"20px"} sx={{ verticalAlign: 'middle', color: '#7E8388' }} />
                          </Grid>
                          <Grid
                            item
                            xs={11}
                            sx={{ justifyContent: 'flex-start', display: 'flex', flexDirection: 'column' }}
                          >
                            <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Produto</Typography>
                            <Typography
                              sx={{ fontWeight: 500, fontSize: '16px', color: 'rgba(48, 48, 48, 0.5)' }}
                            >
                              {productNames[index] || 'Não encontramos o nome do produto'}
                            </Typography>
                          </Grid>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container xs={12} spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={4} sm={12} lg={4}>
                            <CustomFormLabel htmlFor="value" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>Valor</CustomFormLabel>
                            <CustomFieldMoney
                              name="value"
                              fullWidth
                              value={saleProduct.value || ''}
                              onChange={(event, newValue) => handleSaleProductsChange('value', newValue)}
                              {...(saleProductsFormErrors.value && { error: true, helperText: saleProductsFormErrors.value })}
                              sx={{
                                input: {
                                  // color: '#7E92A2',
                                  fontWeight: '400',
                                  fontSize: '12px',
                                  opacity: 1,
                                },
                                '& .MuiOutlinedInput-root': {
                                  border: '1px solid #3E3C41',
                                  borderRadius: '9px',
                                },
                                '& .MuiInputBase-input': {
                                  padding: '12px',
                                },
                              }}

                            />
                          </Grid>

                          <Grid item xs={4} sm={12} lg={4}>
                            <CustomFormLabel htmlFor="cost_value" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>Valor de custo</CustomFormLabel>
                            <CustomFieldMoney
                              name="cost_value"
                              fullWidth
                              value={saleProduct.cost_value || ''}
                              onChange={(event, newValue) => handleSaleProductsChange('cost_value', newValue)}
                              {...(saleProductsFormErrors.cost_value && { error: true, helperText: saleProductsFormErrors.cost_value })}
                              sx={{
                                input: {
                                  // color: '#7E92A2',
                                  fontWeight: '400',
                                  fontSize: '12px',
                                  opacity: 1,
                                },
                                '& .MuiOutlinedInput-root': {
                                  border: '1px solid #3E3C41',
                                  borderRadius: '9px',
                                },
                                '& .MuiInputBase-input': {
                                  padding: '12px',
                                },
                              }}

                            />
                          </Grid>

                          <Grid item xs={4} sm={12} lg={4}>
                            <CustomFormLabel htmlFor="reference_value" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>Valor de referência</CustomFormLabel>
                            <CustomFieldMoney
                              name="reference_value"
                              fullWidth
                              value={saleProduct.reference_value || ''}
                              onChange={(event, newValue) => handleSaleProductsChange('reference_value', newValue)}
                              {...(saleProductsFormErrors.reference_value && { error: true, helperText: saleProductsFormErrors.reference_value })}
                              sx={{
                                input: {
                                  // color: '#7E92A2',
                                  fontWeight: '400',
                                  fontSize: '12px',
                                  opacity: 1,
                                },
                                '& .MuiOutlinedInput-root': {
                                  border: '1px solid #3E3C41',
                                  borderRadius: '9px',
                                },
                                '& .MuiInputBase-input': {
                                  padding: '12px',
                                },
                              }}

                            />
                          </Grid>
                        </Grid>
                        <Grid container xs={12} spacing={2} sx={{ mb: 2 }}>
                          {canEdit && (
                            <Grid item xs={12} sx={{ display: "flex", justifyContent: 'flex-end', justifyItems: 'flex-end' }}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                  await handleSaveSaleProducts();
                                  if (saleProductsFormErrors && Object.keys(saleProductsFormErrors).length > 0) {
                                    const errorMessages = Object.entries(saleProductsFormErrors)
                                      .map(
                                        ([field, messages]) =>
                                          `${formatFieldName(field)}: ${messages.join(', ')}`
                                      )
                                      .join(', ');
                                    enqueueSnackbar(errorMessages, { variant: 'error' });
                                  } else {
                                    enqueueSnackbar('Alterações salvas com sucesso!', {
                                      variant: 'success',
                                    });
                                  }
                                }}
                                disabled={saleProductsFormLoading}
                                endIcon={
                                  saleProductsFormLoading ? <CircularProgress size={20} color="inherit" /> : null
                                }
                              >
                                {saleProductsFormLoading ? 'Salvando...' : 'Salvar Alterações'}
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      </AccordionDetails>

                    </Accordion>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={value} index={3}>
            <Attachments
              contentType={CONTEXT_TYPE_SALE_ID}
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
            <History contentType={CONTEXT_TYPE_SALE_ID} objectId={id_sale} />
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
                        await handleSaleSave();
                        if (saleFormErrors && Object.keys(saleFormErrors).length > 0) {
                          const errorMessages = Object.entries(saleFormErrors)
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
                      disabled={saleFormLoading}
                      endIcon={saleFormLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {saleFormLoading ? 'Salvando...' : 'Salvar Alterações'}
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
