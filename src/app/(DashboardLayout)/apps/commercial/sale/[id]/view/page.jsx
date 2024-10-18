'use client';
import { Grid, Button, Stack, FormControlLabel, Tabs, Tab } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useParams } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';

import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import DocumentAttachments from '../update/attachments';
import { useSelector } from 'react-redux';

import useSale from '@/hooks/sales/useSale';
import useSaleForm from '@/hooks/sales/useSaleForm';
import { useState } from 'react';

export default function FormCustom() {
  const params = useParams();
  const { id } = params;

  const id_sale = id;
  const context_type_sale = 44;

  const { loading, error, saleData } = useSale(id);
  const { formData, handleChange, handleSave, formErrors, success } = useSaleForm(saleData, id);

  const getStatusChip = (status) => {
    switch (status) {
      case 'F':
        return <Chip label="Finalizado" color="success" icon={<CheckCircleIcon />} />;
      case 'EA':
        return <Chip label="Em Andamento" color="primary" icon={<HourglassEmptyIcon />} />;
      case 'C':
        return <Chip label="Cancelado" color="error" icon={<CancelIcon />} />;
      case 'D':
        return <Chip label="Distrato" color="error" icon={<CancelIcon />} />;
      default:
        return <Chip label={status} />;
    }
  };

  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const { formattedValue } = useCurrencyFormatter(saleData?.total_value);


  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  

  console.log('saleData', saleData?.total_value);
  return (
    <PageContainer title="Edição de venda" description="Editor de Vendas">
      <Breadcrumb title="Editar venda" />

      <ParentCard title="Venda">
        <Tabs value={value} onChange={handleChangeTab}>
          <Tab label="Venda" />
          <Tab label="Anexos" />
        </Tabs>

        {value === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="leads">Leads</CustomFormLabel>
              <CustomFormLabel>{saleData.lead.name}</CustomFormLabel>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="name">Cliente</CustomFormLabel>
              <CustomFormLabel>{saleData.customer.complete_name}</CustomFormLabel>
            </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="branch">Franquia</CustomFormLabel>
                <CustomFormLabel>{saleData.branch.name}</CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Vendedor</CustomFormLabel>
                <CustomFormLabel>{saleData.seller.complete_name}</CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Supervisor de Vendas</CustomFormLabel>
                <CustomFormLabel>{saleData.sales_supervisor.complete_name}</CustomFormLabel>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Gerente de Vendas</CustomFormLabel>
                <CustomFormLabel>{saleData.sales_manager.complete_name}</CustomFormLabel>
              </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="branch">Campanha de Marketing</CustomFormLabel>
              <CustomFormLabel>{saleData.marketing_campaign.name}</CustomFormLabel>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="valor">Valor</CustomFormLabel>
              <CustomFormLabel> {formattedValue} </CustomFormLabel>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="valor">Status da Venda</CustomFormLabel>
            <CustomFormLabel>{getStatusChip(saleData.status)}</CustomFormLabel>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="date">Conclusão do Documento</CustomFormLabel>
              <CustomFormLabel>{format(new Date(saleData.document_completion_date), 'dd/MM/yyyy HH:mm:ss')}</CustomFormLabel>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <CustomFormLabel>Venda</CustomFormLabel>
              <FormControlLabel
                control={
                  <CustomSwitch
                    checked={formData.isSale}
                    disabled
                  />
                }
                label={formData.isSale ? 'Pré-Venda' : 'Venda'}
              />
            </Grid>
          </Grid>
        )}

        {value === 1 && <DocumentAttachments objectId={id_sale} contentType={context_type_sale} />}
      </ParentCard>
    </PageContainer>
  );
}
