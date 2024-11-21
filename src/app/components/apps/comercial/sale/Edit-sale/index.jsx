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
  Alert,
} from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useParams } from 'next/navigation';

import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteBranch from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteCampaign from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Campaign';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDateTime from '@/app/components/forms/form-custom/FormDateTime';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { useSelector } from 'react-redux';
import FormPageSkeleton from '../components/FormPageSkeleton';

import useSale from '@/hooks/sales/useSale';
import useSaleForm from '@/hooks/sales/useSaleForm';
import { useEffect, useState } from 'react';
import PaymentCard from '../../../invoice/components/paymentList/card';
import ProjectListCards from '../../../project/components/projectList/cards';
import documentTypeService from '@/services/documentTypeService';
import Attachments from '@/app/components/shared/Attachments';
import ProductCard from '@/app/components/apps/product/Product-list';
import UserForm from '@/app/(DashboardLayout)/apps/users/[id]/update/page';
import EditCustomer from '../../../users/Edit-user/customer';

const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

const EditSalePage = ({ saleId = null, onClosedModal = null, refresh }) => {
  const params = useParams();
  let id = saleId;
  if (!saleId) id = params.id;

  const userPermissions = useSelector((state) => state.user.permissions);

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  const id_sale = id;

  const { loading, error, saleData } = useSale(id);

  console.log('Sale Data: ', saleData);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    successData,
    loading: formLoading,
    success,
  } = useSaleForm(saleData, id);

  const [documentTypes, setDocumentTypes] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await documentTypeService.getDocumentTypeFromContract();
        setDocumentTypes(response.results);
        console.log('Document Types: ', response.results);
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

  return (
    <Box>
      <Tabs value={value} onChange={handleChangeTab}>
        <Tab label="Cliente" />
        <Tab label="Venda" />
        <Tab label="Produtos" />
        <Tab label="Anexos" />
        <Tab label="Pagamentos" />
        <Tab label="Projetos" />
      </Tabs>
      {loading ? (
        <FormPageSkeleton />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          {value === 0 && (
            <Box sx={{ mt: 3 }}>
              <EditCustomer userId={formData.customerId} />
            </Box>
          )}

          {value === 1 && (
            <>
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
                </Grid>
              </Grid>
            </>
          )}

          {value === 2 && (
            <Box sx={{ mt: 3 }}>
              <ProductCard sale={saleData} />
            </Box>
          )}

          {value === 3 && (
            <Attachments contentType={CONTEXT_TYPE_SALE_ID} objectId={id_sale} documentTypes={documentTypes} />
          )}
          {value === 4 && (
            <Box sx={{ mt: 3 }}>
              <PaymentCard sale={id_sale} />
            </Box>
          )}

          {value === 5 && <ProjectListCards saleId={id_sale} />}

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            {onClosedModal && (
              <Button variant="contained" color="primary" onClick={onClosedModal}>
                Fechar
              </Button>
            )}
            {value === 1 && (
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
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default EditSalePage;
