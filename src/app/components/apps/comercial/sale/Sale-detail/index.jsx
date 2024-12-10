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
  useTheme,
} from '@mui/material';
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
import { useEffect, useState } from 'react';
import PaymentCard from '@/app/components/apps/invoice/components/paymentList/card';
import documentTypeService from '@/services/documentTypeService';
import Attachments from '@/app/components/shared/Attachments';
import ProductCardDetail from '@/app/components/apps/product/Product-detail/productListDetail';
import ContractSubmissions from '@/app/components/apps/contractSubmissions/contract-list';
import CustomerTabs from '@/app/components/apps/users/Edit-user/customer/tabs';
import { Preview } from '@mui/icons-material';
import PreviewContractModal from '@/app/components/apps/contractSubmissions/Preview-contract';
import SendContractButton from '@/app/components/apps/contractSubmissions/Send-contract';
import ProjectListCards from '@/app/components/apps/project/components/projectList/cards';
import StatusChip from '../components/DocumentStatusIcon';
import CustomerDetailTabs from '../../../users/User-detail/customer/tabs';
import PaymentCardDetail from '../../../invoice/Invoice-detail/invoiceListDetail';
import ProjectListDetail from '../../../project/Project-Detail/projectListDetail';
import AttachmentDetails from '@/app/components/shared/AttachmentDetails';

const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

const SaleDetailPage = ({ saleId = null, onClosedModal = null, refresh }) => {
  const theme = useTheme();
  const params = useParams();
  let id = saleId;
  if (!saleId) id = params.id;

  const userPermissions = useSelector((state) => state.user.permissions);

  const [openPreview, setOpenPreview] = useState(false);

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
        <Tab label="Envios" />
      </Tabs>
      {loading ? (
        <FormPageSkeleton />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          {value === 0 && (
            <Box sx={{ mt: 3 }}>
              <CustomerDetailTabs userId={saleData.customer.id} />
            </Box>
          )}

          {value === 1 && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="name">Cliente</CustomFormLabel>
                  <CustomFormLabel
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 'light',
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    {saleData.customer.complete_name}
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="branch">Franquia</CustomFormLabel>
                  <CustomFormLabel
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 'light',
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    {saleData.branch.name}
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="name">Vendedor</CustomFormLabel>
                  <CustomFormLabel
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 'light',
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    {saleData.seller.complete_name}
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="name">Supervisor de Vendas</CustomFormLabel>
                  <CustomFormLabel
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 'light',
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    {saleData.sales_supervisor.complete_name}
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="name">Gerente de Vendas</CustomFormLabel>
                  <CustomFormLabel
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 'light',
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    {saleData.sales_manager.complete_name}
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="branch">Campanha de Marketing</CustomFormLabel>
                  <CustomFormLabel
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 'light',
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    {saleData?.marketing_campaign?.name}
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="valor">Valor</CustomFormLabel>
                  <CustomFormLabel
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 'light',
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    {formattedValue}{' '}
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="valor">Status da Venda</CustomFormLabel>
                  <CustomFormLabel>
                    <StatusChip status={saleData.status} />
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="date">Conclusão do Documento</CustomFormLabel>
                  <CustomFormLabel
                    sx={{
                      fontStyle: 'italic',
                      fontWeight: 'light',
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    {saleData?.document_completion_date
                      ? format(new Date(saleData?.document_completion_date), 'dd/MM/yyyy HH:mm:ss')
                      : 'Não informado'}
                  </CustomFormLabel>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <CustomFormLabel>Venda</CustomFormLabel>
                  <FormControlLabel
                    control={<CustomSwitch checked={saleData.is_sale} disabled />}
                    label={saleData.is_sale ? 'Pré-Venda' : 'Venda'}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {value === 2 && (
            <Box sx={{ mt: 3 }}>
              <ProductCardDetail sale={saleData} />
            </Box>
          )}

          {value === 3 && (
            <AttachmentDetails
              contentType={CONTEXT_TYPE_SALE_ID}
              objectId={id_sale}
              documentTypes={documentTypes}
            />
          )}
          {value === 4 && (
            <Box sx={{ mt: 3 }}>
              <PaymentCardDetail sale={id_sale} />
            </Box>
          )}

          {value === 5 && <ProjectListDetail saleId={id_sale} />}
          {value === 6 && <ContractSubmissions sale={saleData} />}

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            {onClosedModal && (
              <Button variant="contained" color="primary" onClick={onClosedModal}>
                Fechar
              </Button>
            )}

          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default SaleDetailPage;
