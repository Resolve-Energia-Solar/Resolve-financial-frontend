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
import CheckboxesTags from '../../../invoice/components/filterDrawer/CheckBranchFilter';
import FormDateRange from '../../../invoice/components/filterDrawer/DateRangePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

// Importe seu contexto
import { RequestDataContext } from '@/app/context/RequestContext';
import AutoCompleteSale from '../../../invoice/components/auto-complete/Auto-Input-Sales';
import AutoCompleteUser from '../../../invoice/components/auto-complete/Auto-Input-User';
import AutoCompleteFinancier from '../../../invoice/components/auto-complete/Auto-Input-financiers';
import AutoCompleteBranch from '../../../invoice/components/auto-complete/Auto-Input-Branch';
import AutoCompleteCampaign from '../../../comercial/sale/components/auto-complete/Auto-Input-Campaign';
import AutoInputStatusSchedule from '../../../inspections/auto-complete/Auto-Input-StatusInspection';

export default function RequestDrawer({ externalOpen, onClose, onApplyFilters }) {

  const [open, setOpen] = useState(externalOpen);
  
  const { filters, setFilters } = useContext(RequestDataContext);

  const [tempFilters, setTempFilters] = useState({
    status__in: filters.status__in || [],
  });


  const statusOptions = [
    { label: 'Solicitado', value: 'S' },
    { label: 'Deferido', value: 'D' },
    { label: 'Indeferido', value: 'I' }
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

    if (Array.isArray(data.status__in) && data.status__in.length > 0) {
      params.status__in = data.status__in.map(option => option.value).join(',');
    } else {
      delete params.status__in;
    }

    return params;
  };
  
  const clearFilters = () => {
    setTempFilters({
      status__in: [],
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
            Filtros de Solicitação da Concessionária
          </Typography>

          <Box sx={{ overflowY: 'auto', flexGrow: 1, marginBottom: 2, paddingRight: '8px' }}>
            <Grid container spacing={2}>

              {/* <Grid item xs={12}>
                <CustomFormLabel>Cliente (Venda)</CustomFormLabel>
                <AutoCompleteUser
                  value={tempFilters.sale_customer}
                  onChange={(newValue) => handleChange('sale_customer', newValue)}
                />
              </Grid> */}

              <Grid item xs={12}>
                <CustomFormLabel>Status da Solitação</CustomFormLabel>
                <CheckboxesTags
                  options={statusOptions}
                  value={tempFilters.status__in}
                  onChange={(event, newValue) => handleChange('status__in', newValue)}
                />
              </Grid>

              {/* Branch */}

              {/* <Grid item xs={12}>
                <CustomFormLabel>Unidade</CustomFormLabel>
                <AutoCompleteBranch
                  value={tempFilters.sale_branch}
                  onChange={(newValue) => handleChange('sale_branch', newValue)}
                />
              </Grid> */}
              
              {/* Due date range */}
              {/* <Grid item xs={12}>
                <FormDateRange
                  label="Data de Vencimento"
                  value={tempFilters.due_date__range}
                  onChange={(newValue) => handleChange('due_date__range', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid> */}

              {/* Invoice status in (múltiplas opções) */}
              {/* <Grid item xs={12}>
                <CustomFormLabel>Status da Nota Fiscal</CustomFormLabel>
                <CheckboxesTags
                  options={invoiceStatusOptions}
                  value={tempFilters.invoice_status__in}
                  onChange={(event, newValue) => handleChange('invoice_status__in', newValue)}
                />
              </Grid> */}

              {/* <Grid item xs={12}>
                <FormDateRange
                  label="Data de Criação"
                  value={tempFilters.created_at__range}
                  onChange={(newValue) => handleChange('created_at__range', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid> */}

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
