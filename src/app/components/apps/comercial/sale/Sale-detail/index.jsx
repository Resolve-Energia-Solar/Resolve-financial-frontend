'use client';
import {
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  Stack,
  Link,
  FormControlLabel,
  Tabs,
  Tab,
  useTheme,
  Button,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import useAttachmentsBySale from '@/hooks/attachments/useAttachmentsBySale';
import { useRouter } from 'next/navigation';
import StatusChip from '../components/DocumentStatusIcon';
import DescriptionIcon from '@mui/icons-material/Description';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import FormPageSkeleton from '../components/FormPageSkeleton';
import useSale from '@/hooks/sales/useSale';
import { useState } from 'react';
import PaymentCard from '../../../invoice/components/paymentList/card';

const SaleDetailPage = ({ saleId = null, onClosedModal = null }) => {
  const params = useParams();
  let id = saleId;
  if (!saleId) id = params.id;

  const theme = useTheme();

  const router = useRouter();

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
      return <ImageIcon sx={{ color: theme.palette.primary.main }} />;
    } else if (ext === 'pdf') {
      return <PictureAsPdfIcon sx={{ color: theme.palette.error.main }} />;
    } else {
      return <DescriptionIcon sx={{ color: theme.palette.text.secondary }} />;
    }
  };

  const {
    loading: attachmentsLoading,
    error: attachmentsError,
    attachmentsData,
  } = useAttachmentsBySale(id);
  const attachments = attachmentsData.results;

  const { loading, error, saleData } = useSale(id);

  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const { formattedValue } = useCurrencyFormatter(saleData?.total_value);

  const handleEditClick = (id) => {
    router.push(`/apps/commercial/sale/${id}/update`);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChangeTab}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Tab label="Venda" />
        <Tab label="Anexos" />
        <Tab label="Pagamentos" />
      </Tabs>
      {loading ? (
        <FormPageSkeleton />
      ) : error ? (
        <Typography color={theme.palette.error.main}>{error}</Typography>
      ) : (
        <>
          {value === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="leads">Leads</CustomFormLabel>
                <CustomFormLabel
                  sx={{
                    fontStyle: 'italic',
                    fontWeight: 'light',
                    borderBottom: `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  {saleData.lead.name}
                </CustomFormLabel>
              </Grid>
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
                  {format(new Date(saleData.document_completion_date), 'dd/MM/yyyy HH:mm:ss')}
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
          )}
        </>
      )}

      {value === 1 && (
        <Grid item sm={12} lg={6} sx={{ mt: 2 }}>
          <List>
            {Array.isArray(attachments) && attachments.length > 0 ? (
              attachments.map((file, index) => (
                <ListItem key={index} sx={{ borderBottom: `1px dashed ${theme.palette.divider}` }}>
                  <Box sx={{ width: '100%' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center">
                        {getFileIcon(file.file)}
                        <Link
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ marginLeft: 2, color: theme.palette.primary.main }}
                        >
                          {file.description}
                        </Link>
                      </Stack>
                    </Stack>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                Nenhum arquivo anexado.
              </Typography>
            )}
          </List>
        </Grid>
      )}

      {value === 2 && (
        <Box sx={{ mt: 3 }}>
          <PaymentCard sale={id} />
        </Box>
      )}
      {onClosedModal && (
        <Button variant="contained" color="primary" onClick={onClosedModal} sx={{ mt: 3 }}>
          Fechar
        </Button>
      )}
    </Box>
  );
};

export default SaleDetailPage;
