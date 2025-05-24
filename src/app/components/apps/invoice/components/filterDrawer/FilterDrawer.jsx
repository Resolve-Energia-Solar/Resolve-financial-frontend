'use client';
import React, { useState, useContext } from 'react';
import {
  Box,
  Drawer,
  Button,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import CheckboxesTags from '../../../project/components/DrawerFilters/CheckboxesTags'
import FormDateRange from '../../../project/components/DrawerFilters/DateRangePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

// Importe seu contexto
import AutoCompleteSale from '../auto-complete/Auto-Input-Sales';
import AutoCompleteUser from '../auto-complete/Auto-Input-User';
import AutoCompleteFinancier from '../auto-complete/Auto-Input-financiers';
import AutoCompleteBranch from '../auto-complete/Auto-Input-Branch';
import AutoCompleteCampaign from '../../../comercial/sale/components/auto-complete/Auto-Input-Campaign';
import AutoInputStatusSchedule from '../../../inspections/auto-complete/Auto-Input-StatusInspection';
import { FilterContext } from '@/context/FilterContext';

export default function FilterDrawer({ externalOpen, onClose, onApplyFilters }) {

  const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID;
  const [open, setOpen] = useState(externalOpen);

  const { filters, setFilters } = useContext(FilterContext);

  const [tempFilters, setTempFilters] = useState({
    borrower: filters.borrower || '',
    sale: filters.sale || '',
    value: filters.value || '',
    value__gte: filters.value__gte || '',
    value__lte: filters.value__lte || '',
    payment_type__in: filters.payment_type__in || [],
    financier: filters.financier || '',
    due_date__range: filters.due_date__range || [null, null],
    invoice_status__in: filters.invoice_status__in || [],
    created_at__range: filters.created_at__range || [null, null],
    sale_status: filters.sale_status || [],
    sale_payment_status: filters.sale_payment_status || [],
    sale_customer: filters.sale_customer || '',
    sale_marketing_campaign: filters.sale_marketing_campaign || '',
    sale_branch: filters.sale_branch || '',
    principal_final_service_opinion__in: filters.principal_final_service_opinion__in || [],
    final_service_opinions__in: filters.final_service_opinions__in || [],
  });


  const paymentTypeOptions = [
    { value: 'C', label: 'Crédito' },
    { value: 'D', label: 'Débito' },
    { value: 'B', label: 'Boleto' },
    { value: 'F', label: 'Financiamento' },
    { value: 'PI', label: 'Parcelamento interno' },
    { value: 'P', label: 'Pix' },
    { value: 'T', label: 'Transferência Bancária' },
    { value: 'DI', label: 'Dinheiro' },
    { value: 'PA', label: 'Poste auxiliar' },
    { value: 'RO', label: 'Repasse de Obra' },
    { value: 'ND', label: 'Nota de Débito' },
  ];

  const saleStatusOptions = [
    { value: 'P', label: 'Pendente' },
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
    { value: 'ED', label: 'Em Processo de Distrato' },
  ];

  const paymentStatusOptions = [
    { value: 'P', label: 'Pendente' },
    { value: 'L', label: 'Liberado' },
    { value: 'C', label: 'Concluído' },
    { value: 'CA', label: 'Cancelado' },
  ];

  const invoiceStatusOptions = [
    { value: 'E', label: 'Emitida' },
    { value: 'L', label: 'Liberada' },
    { value: 'P', label: 'Pendente' },
    { value: 'C', label: 'Cancelada' },
  ];

  const toggleDrawer = (inOpen) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(inOpen);
  };

  const handleChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const createFilterParams = (data) => {
    const params = { ...data };

    if (data.due_date__range && data.due_date__range[0] && data.due_date__range[1]) {
      const startDate = data.due_date__range[0].toISOString().split('T')[0];
      const endDate = data.due_date__range[1].toISOString().split('T')[0];
      params.due_date__range = `${startDate},${endDate}`;
    } else {
      delete params.due_date__range;
    }

    if (data.created_at__range && data.created_at__range[0] && data.created_at__range[1]) {
      const startDate = data.created_at__range[0].toISOString().split('T')[0];
      const endDate = data.created_at__range[1].toISOString().split('T')[0];
      params.created_at__range = `${startDate},${endDate}`;
    } else {
      delete params.created_at__range;
    }

    if (Array.isArray(data.payment_type__in) && data.payment_type__in.length > 0) {
      params.payment_type__in = data.payment_type__in.map(option => option.value).join(',');
    } else {
      delete params.payment_type__in;
    }

    if (Array.isArray(data.invoice_status__in) && data.invoice_status__in.length > 0) {
      params.invoice_status__in = data.invoice_status__in.map(option => option.value).join(',');
    } else {
      delete params.invoice_status__in;
    }

    if (Array.isArray(data.sale_branch) && data.sale_branch.length > 0) {
      params.sale_branch = data.sale_branch.map(option => option.value).join(',');
    } else {
      delete params.sale_branch;
    }

    if (Array.isArray(data.principal_final_service_opinion__in) && data.principal_final_service_opinion__in.length > 0) {
      params.principal_final_service_opinion__in = data.principal_final_service_opinion__in.map(option => option.value).join(',');
    } else {
      delete params.principal_final_service_opinion__in;
    }

    if (Array.isArray(data.final_service_opinions__in) && data.final_service_opinions__in.length > 0) {
      params.final_service_opinions__in = data.final_service_opinions__in.map(option => option.value).join(',');
    } else {
      delete params.final_service_opinions__in;
    }

    if (Array.isArray(data.sale_status) && data.sale_status.length > 0) {
      params.sale_status = data.sale_status.map(option => option.value).join(',');
    } else {
      delete params.sale_status;
    }

    if (Array.isArray(data.sale_payment_status) && data.sale_payment_status.length > 0) {
      params.sale_payment_status = data.sale_payment_status.map(option => option.value).join(',');
    } else {
      delete params.sale_payment_status;
    }

    if (data.value__gte) params.value__gte = data.value__gte;
    else delete params.value__gte;

    if (data.sale_marketing_campaign) params.sale_marketing_campaign = data.sale_marketing_campaign;
    else delete params.sale_marketing_campaign;

    if (data.sale_branch) params.sale_branch = data.sale_branch;
    else delete params.sale_branch;

    if (data.principal_final_service_opinion__in) params.principal_final_service_opinion__in = data.principal_final_service_opinion__in;
    else delete params.principal_final_service_opinion__in;

    if (data.final_service_opinions__in) params.final_service_opinions__in = data.final_service_opinions__in;
    else delete params.final_service_opinions__in;

    if (data.value__lte) params.value__lte = data.value__lte;
    else delete params.value__lte;

    if (data.value) params.value = data.value;
    else delete params.value;

    if (data.borrower) params.borrower = data.borrower;
    else delete params.borrower;

    if (data.sale_customer) params.sale_customer = data.sale_customer;
    else delete params.sale_customer;

    if (data.sale) params.sale = data.sale;
    else delete params.sale;

    if (data.financier) params.financier = data.financier;
    else delete params.financier;

    return params;
  };

  const clearFilters = () => {
    setTempFilters({
      borrower: '',
      sale: '',
      value: '',
      value__gte: '',
      value__lte: '',
      payment_type__in: [],
      financier: '',
      due_date__range: [null, null],
      invoice_status__in: [],
      created_at__range: [null, null],
      sale_status: [],
      sale_payment_status: [],
      sale_customer: '',
      sale_marketing_campaign: '',
      sale_branch: '',
      principal_final_service_opinion__in: [],
      final_service_opinions__in: [],
    });
  };

  // Aplica os filtros
  const applyFilters = () => {
    const finalParams = createFilterParams(tempFilters);
    setFilters(finalParams);
    onApplyFilters(finalParams);
    setOpen(false);
  };

  return (
    <Box>
      <Drawer
        anchor="right"
        open={externalOpen}
        onClose={onClose}
        variant="temporary"
      >
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
          <Typography variant="h5" sx={{ marginBottom: '16px' }}>
            Filtros de Pagamento
          </Typography>

          <Box sx={{ overflowY: 'auto', flexGrow: 1, marginBottom: 2, paddingRight: '8px' }}>
            <Grid container spacing={2}>
              {/* Borrower */}
              <Grid item xs={12}>
                <CustomFormLabel>Tomador</CustomFormLabel>
                <AutoCompleteUser
                  value={tempFilters.borrower}
                  onChange={(newValue) => handleChange('borrower', newValue)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel>Cliente (Venda)</CustomFormLabel>
                <AutoCompleteUser
                  value={tempFilters.sale_customer}
                  onChange={(newValue) => handleChange('sale_customer', newValue)}
                />
              </Grid>

              {/* Sale */}
              <Grid item xs={12}>
                <CustomFormLabel>Venda</CustomFormLabel>
                <AutoCompleteSale
                  value={tempFilters.sale}
                  onChange={(newValue) => handleChange('sale', newValue)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel>Status da Venda</CustomFormLabel>
                <CheckboxesTags
                  options={saleStatusOptions}
                  value={tempFilters.sale_status}
                  onChange={(event, newValue) => handleChange('sale_status', newValue)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel>Status do Pagamento (Venda)</CustomFormLabel>
                <CheckboxesTags
                  options={paymentStatusOptions}
                  value={tempFilters.sale_payment_status}
                  onChange={(event, newValue) => handleChange('sale_payment_status', newValue)}
                />
              </Grid>

              {/* Value */}
              <Grid item xs={12}>
                <CustomFormLabel>Valor</CustomFormLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={tempFilters.value}
                  onChange={(e) => handleChange('value', e.target.value)}
                />
              </Grid>

              {/* Value GTE */}
              <Grid item xs={6}>
                <CustomFormLabel>Valor Mínimo</CustomFormLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={tempFilters.value__gte}
                  onChange={(e) => handleChange('value__gte', e.target.value)}
                />
              </Grid>

              {/* Value LTE */}
              <Grid item xs={6}>
                <CustomFormLabel>Valor Máximo</CustomFormLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={tempFilters.value__lte}
                  onChange={(e) => handleChange('value__lte', e.target.value)}
                />
              </Grid>

              {/* Payment type in (múltiplas opções) */}
              <Grid item xs={12}>
                <CustomFormLabel>Tipo de Pagamento</CustomFormLabel>
                <CheckboxesTags
                  options={paymentTypeOptions}
                  value={tempFilters.payment_type__in}
                  onChange={(event, newValue) => handleChange('payment_type__in', newValue)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel>Parecer Final do Serviço Principal</CustomFormLabel>
                <AutoInputStatusSchedule
                  serviceId={SERVICE_INSPECTION_ID}
                  isFinalOpinion={true}
                  value={tempFilters.principal_final_service_opinion__in}
                  onChange={(newValue) => handleChange('principal_final_service_opinion__in', newValue)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel>Parecer Final ds Serviços Vinculados</CustomFormLabel>
                <AutoInputStatusSchedule
                  serviceId={SERVICE_INSPECTION_ID}
                  isFinalOpinion={true}
                  value={tempFilters.final_service_opinions__in}
                  onChange={(newValue) => handleChange('final_service_opinions__in', newValue)}
                />
              </Grid>

              {/* Branch */}

              <Grid item xs={12}>
                <CustomFormLabel>Unidade</CustomFormLabel>
                <AutoCompleteBranch
                  value={tempFilters.sale_branch}
                  onChange={(newValue) => handleChange('sale_branch', newValue)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel>Campanha de Marketing</CustomFormLabel>
                <AutoCompleteCampaign
                  value={tempFilters.sale_marketing_campaign}
                  onChange={(newValue) => handleChange('sale_marketing_campaign', newValue)}
                />
              </Grid>

              {/* Financier */}
              <Grid item xs={12}>
                <CustomFormLabel>Financiadora</CustomFormLabel>
                <AutoCompleteFinancier
                  value={tempFilters.financier}
                  onChange={(newValue) => handleChange('financier', newValue)}
                />
              </Grid>

              {/* Due date range */}
              <Grid item xs={12}>
                <FormDateRange
                  label="Data de Vencimento"
                  value={tempFilters.due_date__range}
                  onChange={(newValue) => handleChange('due_date__range', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>

              {/* Invoice status in (múltiplas opções) */}
              <Grid item xs={12}>
                <CustomFormLabel>Status da Nota Fiscal</CustomFormLabel>
                <CheckboxesTags
                  options={invoiceStatusOptions}
                  value={tempFilters.invoice_status__in}
                  onChange={(event, newValue) => handleChange('invoice_status__in', newValue)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormDateRange
                  label="Data de Criação"
                  value={tempFilters.created_at__range}
                  onChange={(newValue) => handleChange('created_at__range', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>

            </Grid>
          </Box>

          {/* Botoes de Ação */}
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth onClick={clearFilters}>
                  Limpar
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={applyFilters}>
                  Aplicar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
