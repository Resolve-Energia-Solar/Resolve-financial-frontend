import React, { useState, useContext } from 'react';
import { Box, Drawer, Button, Typography, Grid } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import CheckboxesTags from './CheckboxesTags';
import FormDateRange from './DateRangePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteBranch from '../auto-complete/Auto-Input-Branch';
import AutoCompleteUser from '../auto-complete/Auto-Input-User';
import { SaleDataContext } from '@/app/context/SaleContext';
import AutoCompleteCampaign from '../auto-complete/Auto-Input-Campaign';

export default function DrawerFilters() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(SaleDataContext);

  const [tempFilters, setTempFilters] = useState({
    documentCompletionDate: filters.documentCompletionDate,
    statusDocument: filters.statusDocument,
    branch: filters.branch,
    customer: filters.customer,
    isPreSale: filters.isPreSale,
    seller: filters.seller,
    marketing_campaign: filters.marketing_campaign,
    created_at: filters.created_at,
  });

  console.log('tempFilters', tempFilters);

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

    if (filters.statusDocument && filters.statusDocument.length > 0) {
      const statusValues = filters.statusDocument.map((status) => status.value);
      params.status__in = statusValues.join(',');
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

    return params;
  };

  const handleChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setTempFilters({
      documentCompletionDate: [null, null],
      statusDocument: [],
      branch: null,
      customer: null,
      isPreSale: [],
      seller: null,
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

  const StatusDocument = [
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  const isPreSaleOptions = [
    { value: 'true', label: 'Pré-Venda' },
    { value: 'false', label: 'Venda' },
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
                <CustomFormLabel htmlFor="isPreSale">Tipo de Venda</CustomFormLabel>
                <CheckboxesTags
                  options={isPreSaleOptions}
                  placeholder="Selecione o tipo"
                  value={tempFilters.isPreSale}
                  onChange={(event, value) => handleChange('isPreSale', value)}
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
                <CustomFormLabel htmlFor="customer">Vendedor</CustomFormLabel>
                <AutoCompleteUser
                  placeholder="Selecione o cliente"
                  value={tempFilters.seller}
                  onChange={(id) => handleChange('seller', id)}
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
