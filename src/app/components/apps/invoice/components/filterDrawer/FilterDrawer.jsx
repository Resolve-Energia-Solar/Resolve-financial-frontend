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
import { FilterAlt } from '@mui/icons-material';
// Supondo que você tenha um componente de multi-select ou checkboxes:
import CheckboxesTags from '../../../project/components/DrawerFilters/CheckboxesTags';
// Supondo que você tenha um componente de range de datas:
import FormDateRange from '../../../project/components/DrawerFilters/DateRangePicker';
// Se tiver um FormLabel customizado
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

// Importe seu contexto
import { InvoiceContext } from '@/app/context/InvoiceContext';

export default function FilterDrawer({ externalOpen, onClose, onApplyFilters }) {
  const [open, setOpen] = useState(externalOpen);
  
  // Acessa os filtros do contexto
  const { filters, setFilters } = useContext(InvoiceContext);

  // Estado temporário para edição no Drawer
  const [tempFilters, setTempFilters] = useState({
    borrower: filters.borrower || '',
    sale: filters.sale || '',
    value: filters.value || '',
    value__gte: filters.value__gte || '',
    value__lte: filters.value__lte || '',
    payment_type__in: filters.payment_type__in || [], // array para múltiplas seleções
    financier: filters.financier || '',
    due_date__range: filters.due_date__range || [null, null],
    observation__icontains: filters.observation__icontains || '',
    invoice_status__in: filters.invoice_status__in || [],
    created_at__range: filters.created_at__range || [null, null],
  });

  // Exemplo de opções de payment_type e invoice_status
  const paymentTypeOptions = [
    { value: 'C', label: 'Crédito' },
    { value: 'D', label: 'Débito' },
    { value: 'B', label: 'Boleto' },
    { value: 'P', label: 'PIX' },
  ];

  const invoiceStatusOptions = [
    { value: 'open', label: 'Aberto' },
    { value: 'paid', label: 'Pago' },
    { value: 'canceled', label: 'Cancelado' },
  ];

  // Função para abrir/fechar o Drawer
  const toggleDrawer = (inOpen) => () => {
    setOpen(inOpen);
  };

  // Função para atualizar estado temporário
  const handleChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Monta o objeto final para enviar ao contexto
  const createFilterParams = (data) => {
    const params = { ...data };

    // due_date__range e created_at__range podem precisar de formatação de datas
    // se você estiver usando libs como dayjs, moment, etc.
    // Exemplo simples de conversão:
    if (data.due_date__range && data.due_date__range[0] && data.due_date__range[1]) {
      const startDate = data.due_date__range[0].toISOString().split('T')[0];
      const endDate = data.due_date__range[1].toISOString().split('T')[0];
      params.due_date__range = `${startDate},${endDate}`;
    } else {
      params.due_date__range = '';
    }

    if (data.created_at__range && data.created_at__range[0] && data.created_at__range[1]) {
      const startDate = data.created_at__range[0].toISOString().split('T')[0];
      const endDate = data.created_at__range[1].toISOString().split('T')[0];
      params.created_at__range = `${startDate},${endDate}`;
    } else {
      params.created_at__range = '';
    }

    return params;
  };

  // Limpa os filtros
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
      observation__icontains: '',
      invoice_status__in: [],
      created_at__range: [null, null],
    });
  };

  // Aplica os filtros
  const applyFilters = () => {
    const finalParams = createFilterParams(tempFilters);
    setFilters(finalParams);
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
                <TextField
                  fullWidth
                  size="small"
                  value={tempFilters.borrower}
                  onChange={(e) => handleChange('borrower', e.target.value)}
                />
              </Grid>

              {/* Sale */}
              <Grid item xs={12}>
                <CustomFormLabel>Venda</CustomFormLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={tempFilters.sale}
                  onChange={(e) => handleChange('sale', e.target.value)}
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
              <Grid item xs={12}>
                <CustomFormLabel>Valor Mínimo</CustomFormLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={tempFilters.value__gte}
                  onChange={(e) => handleChange('value__gte', e.target.value)}
                />
              </Grid>

              {/* Value LTE */}
              <Grid item xs={12}>
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

              {/* Financier */}
              <Grid item xs={12}>
                <CustomFormLabel>Financiadora</CustomFormLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={tempFilters.financier}
                  onChange={(e) => handleChange('financier', e.target.value)}
                />
              </Grid>

              {/* Due date range */}
              <Grid item xs={12}>
                <CustomFormLabel>Data de vencimento</CustomFormLabel>
                <FormDateRange
                  value={tempFilters.due_date__range}
                  onChange={(newValue) => handleChange('due_date__range', newValue)}
                />
              </Grid>

              {/* Observation (icontains) */}
              <Grid item xs={12}>
                <CustomFormLabel>Observação</CustomFormLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={tempFilters.observation__icontains}
                  onChange={(e) => handleChange('observation__icontains', e.target.value)}
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

              {/* Created at range */}
              <Grid item xs={12}>
                <CustomFormLabel>Data de Criação</CustomFormLabel>
                <FormDateRange
                  value={tempFilters.created_at__range}
                  onChange={(newValue) => handleChange('created_at__range', newValue)}
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
