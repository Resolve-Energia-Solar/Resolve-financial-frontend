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

const SaleDetailPage = () => {
  const params = useParams();
  const { id } = params;

  const router = useRouter();

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
      return <ImageIcon />;
    } else if (ext === 'pdf') {
      return <PictureAsPdfIcon />;
    } else {
      return <DescriptionIcon />;
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

  console.log('saleData', saleData?.total_value);
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
                <CustomFormLabel
                  sx={{ fontStyle: 'italic', fontWeight: 'light', borderBottom: '1px dashed #ccc' }}
                >
                  {saleData.lead.name}
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Cliente</CustomFormLabel>
                <CustomFormLabel
                  sx={{ fontStyle: 'italic', fontWeight: 'light', borderBottom: '1px dashed #ccc' }}
                >
                  {saleData.customer.complete_name}
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="branch">Franquia</CustomFormLabel>
                <CustomFormLabel
                  sx={{ fontStyle: 'italic', fontWeight: 'light', borderBottom: '1px dashed #ccc' }}
                >
                  {saleData.branch.name}
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Vendedor</CustomFormLabel>
                <CustomFormLabel
                  sx={{ fontStyle: 'italic', fontWeight: 'light', borderBottom: '1px dashed #ccc' }}
                >
                  {saleData.seller.complete_name}
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Supervisor de Vendas</CustomFormLabel>
                <CustomFormLabel
                  sx={{ fontStyle: 'italic', fontWeight: 'light', borderBottom: '1px dashed #ccc' }}
                >
                  {saleData.sales_supervisor.complete_name}
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Gerente de Vendas</CustomFormLabel>
                <CustomFormLabel
                  sx={{ fontStyle: 'italic', fontWeight: 'light', borderBottom: '1px dashed #ccc' }}
                >
                  {saleData.sales_manager.complete_name}
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="branch">Campanha de Marketing</CustomFormLabel>
                <CustomFormLabel
                  sx={{ fontStyle: 'italic', fontWeight: 'light', borderBottom: '1px dashed #ccc' }}
                >
                  {saleData.marketing_campaign.name}
                </CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="valor">Valor</CustomFormLabel>
                <CustomFormLabel
                  sx={{ fontStyle: 'italic', fontWeight: 'light', borderBottom: '1px dashed #ccc' }}
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
                  sx={{ fontStyle: 'italic', fontWeight: 'light', borderBottom: '1px dashed #ccc' }}
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
                <ListItem key={index} sx={{ borderBottom: '1px dashed #ccc' }}>
                  <Box sx={{ width: '100%' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center">
                        {getFileIcon(file.file)}
                        <Link
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ marginLeft: 2 }}
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
    </Box>
  );
};

export default SaleDetailPage;
