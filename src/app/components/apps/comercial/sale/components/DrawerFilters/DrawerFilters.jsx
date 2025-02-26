import React, { useState, useContext } from 'react';
import { Box, Drawer, Button, Typography, Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import CheckboxesTags from './CheckboxesTags';
import FormDateRange from './DateRangePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteBranch from '../auto-complete/Auto-Input-Branch';
import AutoCompleteUser from '../auto-complete/Auto-Input-User';
import { SaleDataContext } from '@/app/context/SaleContext';
import AutoCompleteCampaign from '../auto-complete/Auto-Input-Campaign';
import AutoInputStatusSchedule from '@/app/components/apps/inspections/auto-complete/Auto-Input-StatusInspection';

export default function DrawerFilters() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(SaleDataContext);

  const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID;

  // Inicialização do estado
  const [tempFilters, setTempFilters] = useState({
    documentCompletionDate: filters.documentCompletionDate || [null, null],
    statusDocument: filters.statusDocument || [],
    branch: filters.branch || "",
    customer: filters.customer || "",
    isPreSale: filters.isPreSale || [],
    seller: filters.seller || "",
    marketing_campaign: filters.marketing_campaign || "",
    created_at: filters.created_at || [null, null],
    is_signed: filters.is_signed || [],
    signature_date: filters.signature_date || [null, null],
    final_service_options: filters.final_service_options || "",
    invoice_status: filters.invoice_status || [],  // Alterado para array
    billing_date: filters.billing_date || [null, null],
    borrower: filters.borrower || "",
    payment_status: filters.payment_status || [],
    tag_name__exact: filters.tag_name__exact || ""
  });

  const createFilterParams = (filters) => {
    const params = {};

    if (
      filters.documentCompletionDate &&
      filters.documentCompletionDate[0] &&
      filters.documentCompletionDate[1]
    ) {
      const startDate = filters.documentCompletionDate[0].toISOString().split('T')[0];
      const endDate = filters.documentCompletionDate[1].toISOString().split('T')[0];
      params.document_completion_date__range = `${startDate},${endDate}`;
    }

    if (filters.billing_date && filters.billing_date[0] && filters.billing_date[1]) {
      const startDate = filters.billing_date[0].toISOString().split('T')[0];
      const endDate = filters.billing_date[1].toISOString().split('T')[0];
      params.billing_date__range = `${startDate},${endDate}`;
    }

    if (filters.statusDocument && filters.statusDocument.length > 0) {
      const statusValues = filters.statusDocument.map((status) => status.value);
      params.status__in = statusValues.join(',');
    }

    if (filters.payment_status && filters.payment_status.length > 0) {
      const paymentStatusValues = filters.payment_status.map((status) => status.value);
      params.payment_status__in = paymentStatusValues.join(',');
    }

    if (filters.branch) {
      params.branch = filters.branch;
    }

    if (filters.marketing_campaign) {
      params.marketing_campaign = filters.marketing_campaign;
    }

    if (filters.customer) {
      params.customer = filters.customer;
    }

    if (filters.borrower) {
      params.borrower = filters.borrower;
    }

    if (filters.isPreSale && filters.isPreSale.length > 0) {
      const preSaleValues = filters.isPreSale.map((option) => option.value);
      params.is_pre_sale = preSaleValues.join(',');
    }

    if (filters.seller) {
      params.seller = filters.seller;
    }

    if (filters.created_at && filters.created_at[0] && filters.created_at[1]) {
      const startDate = filters.created_at[0].toISOString().split('T')[0];
      const endDate = filters.created_at[1].toISOString().split('T')[0];
      params.created_at__range = `${startDate},${endDate}`;
    }

    if (filters.is_signed && filters.is_signed.length > 0) {
      const signedValues = filters.is_signed.map((option) => option.value);
      params.is_signed = signedValues.join(',');
    }

    if (filters.signature_date && filters.signature_date[0] && filters.signature_date[1]) {
      const startDate = filters.signature_date[0].toISOString().split('T')[0];
      const endDate = filters.signature_date[1].toISOString().split('T')[0];
      params.signature_date__range = `${startDate},${endDate}`;
    }

    if (filters.final_service_options) {
      params.final_service_options = filters.final_service_options;
    }

    if (filters.invoice_status && filters.invoice_status.length > 0) {
      const invoiceStatusValues = filters.invoice_status.map((status) => status.value);
      params.invoice_status = invoiceStatusValues.join(',');
    }

    // Filtro único para tag
    if (filters.tag_name__exact) {
      params.tag_name__exact = filters.tag_name__exact;
    }

    return params;
  };

  const handleChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Função de limpar filtros
  const clearFilters = () => {
    setTempFilters({
      documentCompletionDate: [null, null],
      statusDocument: [],
      branch: "",
      customer: "",
      isPreSale: [],
      seller: "",
      marketing_campaign: "",
      created_at: [null, null],
      is_signed: [],
      signature_date: [null, null],
      final_service_options: "",
      invoice_status: [],  // Alterado para array
      billing_date: [null, null],
      borrower: "",
      payment_status: [],
      tag_name__exact: ""
    });
  };

  const applyFilters = () => {
    setFilters(createFilterParams(tempFilters));
    setOpen(false);
  };

  const toggleDrawer = (inOpen) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(inOpen);
  };

  const PaymentStatus = [
    { value: 'P', label: 'Pendente' },
    { value: 'L', label: 'Liberado' },
    { value: 'C', label: 'Concluído' },
    { value: 'CA', label: 'Cancelado' },
  ];

  const StatusDocument = [
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'P', label: 'Pendente' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  const isPreSaleOptions = [
    { value: 'true', label: 'Pré-Venda' },
    { value: 'false', label: 'Venda' },
  ];

  const invoiceStatusChoices = [
    { value: 'E', label: 'Emitida' },
    { value: 'L', label: 'Liberada' },
    { value: 'P', label: 'Pendente' },
    { value: 'C', label: 'Cancelada' },
  ];

  // Opções para o filtro de Tag (único)
  const tagNameOptions = [
    { value: 'Documentação Pendente', label: 'Documentação Pendente' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Button variant="outlined" onClick={toggleDrawer(true)} startIcon={<FilterAlt />}>
        Filtros
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <Box
          role="presentation"
          sx={{
            padding: 2,
            maxWidth: '600px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: '16px', flexShrink: 0 }}>
            Filtros
          </Typography>

          <Box
            sx={{
              overflowY: 'auto',
              flexGrow: 1,
              marginBottom: 2,
              paddingRight: '8px',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="statusDocument">Status da Documentação</CustomFormLabel>
                <CheckboxesTags
                  options={StatusDocument}
                  placeholder="Selecione o status"
                  value={tempFilters.statusDocument}
                  onChange={(event, value) => handleChange('statusDocument', value)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="statusDocument">Status da Nota Fiscal</CustomFormLabel>
                <CheckboxesTags
                  options={invoiceStatusChoices}
                  placeholder="Selecione o status"
                  value={tempFilters.invoice_status}
                  onChange={(event, value) => handleChange('invoice_status', value)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="statusDocument">Status do Financeiro</CustomFormLabel>
                <CheckboxesTags
                  options={PaymentStatus}
                  placeholder="Selecione o status"
                  value={tempFilters.payment_status}
                  onChange={(event, value) => handleChange('payment_status', value)}
                />
              </Grid>

              {/* Filtro para Tag (único) */}
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="tag_name">Tag</CustomFormLabel>
                <RadioGroup
                  row
                  name="tag_name__exact"
                  value={tempFilters.tag_name__exact}
                  onChange={(e) => handleChange('tag_name__exact', e.target.value)}
                >
                  {tagNameOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </Grid>

              {/* Demais filtros */}
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="final_service_options">Parecer Final Vistoria</CustomFormLabel>
                <AutoInputStatusSchedule
                  onChange={(id) => handleChange('final_service_options', id)}
                  value={tempFilters.final_service_options}
                  isFinalOpinion={true}
                  serviceId={SERVICE_INSPECTION_ID}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="isPreSale">Tipo de Venda</CustomFormLabel>
                <CheckboxesTags
                  options={isPreSaleOptions}
                  placeholder="Selecione o tipo"
                  value={tempFilters.isPreSale}
                  onChange={(event, value) => handleChange('isPreSale', value)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="is_signed">Assinatura</CustomFormLabel>
                <CheckboxesTags
                  options={[
                    { value: true, label: 'Assinado' },
                    { value: false, label: 'Não Assinado' },
                  ]}
                  placeholder="Assinatura"
                  value={tempFilters.is_signed}
                  onChange={(event, value) => handleChange('is_signed', value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormDateRange
                  label="Data de Contrato"
                  value={tempFilters.signature_date}
                  onChange={(newValue) => handleChange('signature_date', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>

              <Grid item xs={12}>
                <FormDateRange
                  label="Data de Conclusão"
                  value={tempFilters.documentCompletionDate}
                  onChange={(newValue) => handleChange('documentCompletionDate', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>

              <Grid item xs={12}>
                <FormDateRange
                  label="Data de Competência"
                  value={tempFilters.billing_date}
                  onChange={(newValue) => handleChange('billing_date', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>

              <Grid item xs={12}>
                <FormDateRange
                  label="Data de Criação"
                  value={tempFilters.created_at}
                  onChange={(newValue) => handleChange('created_at', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="branch">Filial</CustomFormLabel>
                <AutoCompleteBranch
                  placeholder="Selecione a filial"
                  value={tempFilters.branch}
                  onChange={(id) => handleChange('branch', id)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="marketing_campaign">Campanha</CustomFormLabel>
                <AutoCompleteCampaign
                  placeholder="Selecione a campanha"
                  value={tempFilters.marketing_campaign}
                  onChange={(id) => handleChange('marketing_campaign', id)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="customer">Cliente</CustomFormLabel>
                <AutoCompleteUser
                  placeholder="Selecione o cliente"
                  value={tempFilters.customer}
                  onChange={(id) => handleChange('customer', id)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="borrower">Vendedor</CustomFormLabel>
                <AutoCompleteUser
                  placeholder="Selecione o Vendedor"
                  value={tempFilters.seller}
                  onChange={(id) => handleChange('seller', id)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="borrower">Tomador</CustomFormLabel>
                <AutoCompleteUser
                  placeholder="Selecione o tomador"
                  value={tempFilters.borrower}
                  onChange={(id) => handleChange('borrower', id)}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={applyFilters}>
                  Aplicar Filtros
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
