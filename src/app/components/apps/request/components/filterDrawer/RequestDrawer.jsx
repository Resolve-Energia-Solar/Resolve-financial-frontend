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
import AutoCompleteRequestType from '../auto-complete/AutoCompleteRequestType';
import AutoCompleteCompanies from '../auto-complete/AutoCompleteConcessionaire';
import AutoCompleteProject from '../../../inspections/auto-complete/Auto-input-Project';
import AutoCompleteSituation from '../../../comercial/sale/components/auto-complete/Auto-Input-Situation';

export default function RequestDrawer({ externalOpen, onClose, onApplyFilters }) {

  const [open, setOpen] = useState(externalOpen);
  
  const { filters = {}, setFilters = () => {} } = useContext(RequestDataContext) || {};

  const [tempFilters, setTempFilters] = useState({
    status__in: filters.status__in || [],
    unit: filters.unit || null,
    requested_by: filters.requested_by || null,
    conclusion_date__range: filters.conclusion_date__range || [null, null],
    request_date__range: filters.request_date__range || [null, null],
    final_protocol__icontains: filters.final_protocol__icontains || null,
    interim_protocol__icontains: filters.interim_protocol__icontains || null,
    project: filters.project || null,
    company: filters.company || null,
    type: filters.type || null,
    project_client: filters.project_client || null,
    project_homologation: filters.project_homologation || null,
    situation_id__in: filters.situation_id__in || [],
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
    }

    if (data.unit) {
      params.unit = data.unit;
    }

    if (data.project_client) {
      params.project_client = data.project_client;
    }

    if (data.project_homologation) {
      params.project_homologation = data.project_homologation;
    }

    if (data.requested_by) {
      params.requested_by = data.requested_by;
    }

    if (Array.isArray(data.situation_id__in) && data.situation_id__in.length > 0) {
      data.situation_id__in.forEach(id => params.situation_id__in = data.situation_id__in.map(option => option).join(','));
    }

    if (data.conclusion_date__range && data.conclusion_date__range[0] && data.conclusion_date__range[1]) {
      const startDate = data.conclusion_date__range[0].toISOString().split('T')[0];
      const endDate = data.conclusion_date__range[1].toISOString().split('T')[0];
      params.conclusion_date__range = `${startDate},${endDate}`;
    }

    if (data.request_date__range && data.request_date__range[0] && data.request_date__range[1]) {
      const startDate = data.request_date__range[0].toISOString().split('T')[0];
      const endDate = data.request_date__range[1].toISOString().split('T')[0];
      params.request_date__range = `${startDate},${endDate}`;
    }

    if (data.final_protocol__icontains) {
      params.final_protocol__icontains = data.final_protocol__icontains;
    }

    if (data.interim_protocol__icontains) {
      params.interim_protocol__icontains = data.interim_protocol__icontains;
    }

    if (data.project) {
      params.project = data.project;
    }

    if (data.company) {
      params.company = data.company;
    }

    if (data.type) {
      params.type = data.type;
    }

    return params;
  };
  
  const clearFilters = () => {
    setTempFilters({
      status__in: [],
      unit: null,
      requested_by: null,
      conclusion_date__range: [null, null],
      request_date__range: [null, null],
      final_protocol__icontains: null,
      interim_protocol__icontains: null,
      project: null,
      company: null,
      type: null,
      project_client: null,
      project_homologation: null,
      situation_id__in: null,
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

              <Grid item xs={12}>
                <CustomFormLabel>Cliente</CustomFormLabel>
                <AutoCompleteUser
                  value={tempFilters.project_client}
                  onChange={(newValue) => handleChange('project_client', newValue)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel>Homologador</CustomFormLabel>
                <AutoCompleteUser
                  value={tempFilters.project_client}
                  onChange={(newValue) => handleChange('project_client', newValue)}
                />
              </Grid>

              {/* Requested by */}
              <Grid item xs={12}>
                <CustomFormLabel>Solicitado por</CustomFormLabel>
                <AutoCompleteUser
                  value={tempFilters.requested_by}
                  onChange={(newValue) => handleChange('requested_by', newValue)}
                />
              </Grid>

              {/* Situation */}
              <Grid item xs={12}>
                <CustomFormLabel>Situação</CustomFormLabel>
                <AutoCompleteSituation
                  value={tempFilters.situation_id__in}
                  onChange={(newValue) => handleChange('situation_id__in', newValue)}
                />
              </Grid>

              {/* Request date range */}
              <Grid item xs={12}>
                <FormDateRange
                  label="Data da Solicitação"
                  value={tempFilters.request_date__range}
                  onChange={(newValue) => handleChange('request_date__range', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>

              {/* Conclusion date range */}
              <Grid item xs={12}>
                <FormDateRange
                  label="Data de Conclusão"
                  value={tempFilters.conclusion_date__range}
                  onChange={(newValue) => handleChange('conclusion_date__range', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>

              {/* Final protocol */}
              <Grid item xs={12}>
                <CustomFormLabel>Protocolo Final</CustomFormLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={tempFilters.final_protocol__icontains}
                  onChange={(event) => handleChange('final_protocol__icontains', event.target.value)}
                />
              </Grid>

              {/* Interim protocol */}
              <Grid item xs={12}>
                <CustomFormLabel>Protocolo Intermediário</CustomFormLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={tempFilters.interim_protocol__icontains}
                  onChange={(event) => handleChange('interim_protocol__icontains', event.target.value)}
                />
              </Grid>

              {/* Project */}
              <Grid item xs={12}>
                <CustomFormLabel>Projeto</CustomFormLabel>
                <AutoCompleteProject
                  value={tempFilters.project}
                  onChange={(newValue) => handleChange('project', newValue)}
                />
              </Grid>

              {/* Company */}
              <Grid item xs={12}>
                <CustomFormLabel>Concessionária</CustomFormLabel>
                <AutoCompleteCompanies
                  value={tempFilters.company}
                  onChange={(newValue) => handleChange('company', newValue)}
                />
              </Grid>

              {/* Type */}
              <Grid item xs={12}>
                <CustomFormLabel>Tipo</CustomFormLabel>
                <AutoCompleteRequestType
                  value={tempFilters.type}
                  onChange={(newValue) => handleChange('type', newValue)}
                />
              </Grid>


              <Grid item xs={12}>
                <CustomFormLabel>Status da Solitação</CustomFormLabel>
                <CheckboxesTags
                  options={statusOptions}
                  value={tempFilters.status__in}
                  onChange={(event, newValue) => handleChange('status__in', newValue)}
                />
              </Grid>

              {/* Branch */}

              <Grid item xs={12}>
                <CustomFormLabel>Unidade</CustomFormLabel>
                <AutoCompleteBranch
                  value={tempFilters.unit}
                  onChange={(newValue) => handleChange('unit', newValue)}
                />
              </Grid>
              
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
