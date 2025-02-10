import React, { useState, useContext } from 'react';
import {
  Box,
  Drawer,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import CheckboxesTags from './CheckboxesTags';
import FormDateRange from './DateRangePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import { ProjectDataContext } from '@/app/context/ProjectContext';
import NumberInputBasic, { CustomNumberInput, NumberInput } from '../NumberInput';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';

export default function DrawerFiltersProject() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(ProjectDataContext);

  const [tempFilters, setTempFilters] = useState({
    documentCompletionDate: filters.documentCompletionDate,
    status: filters.status,
    customer: filters.customer,
    designer_status: filters.designer_status,
    is_released_to_engineering: filters.is_released_to_engineering ?? null,
    homologator: filters.homologator,
    signature_date: filters.signature_date,
    product_kwp: filters.product_kwp || null,
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
      params.end_date__range = `${startDate},${endDate}`;
    }

    if (filters.signature_date && filters.signature_date[0] && filters.signature_date[1]) {
      const startDate = filters.signature_date[0].toISOString().split('T')[0];
      const endDate = filters.signature_date[1].toISOString().split('T')[0];
      params.signature_date = `${startDate},${endDate}`;
    }

    if (filters.status && filters.status.length > 0) {
      params.status__in = filters.status.map((status) => status.value).join(',');
    }

    if (filters.designer_status && filters.designer_status.length > 0) {
      params.designer_status__in = filters.designer_status.map((status) => status.value).join(',');
    }

    if (filters.customer) {
      params.customer = filters.customer;
    }

    if (filters.is_released_to_engineering !== null) {
      params.is_released_to_engineering = filters.is_released_to_engineering;
    }

    if (filters.homologator) {
      params.homologator = filters.homologator;
    }

    if (filters.product_kwp) {
      params.product_kwp = filters.product_kwp
    }

    return params;
  };

  const handleChange = (key, value) => {
    console.log('key:', key);
    console.log('value:', value);
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setTempFilters({
      documentCompletionDate: [null, null],
      status: [],
      designer_status: [],
      is_released_to_engineering: null,
      customer: null,
      homologator: null,
      signature_date: [null, null],
      product_kwp: null,
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
                <CustomFormLabel htmlFor="customer">Cliente</CustomFormLabel>
                <AutoCompleteUser
                  placeholder="Selecione o cliente"
                  value={tempFilters.customer}
                  onChange={(id) => handleChange('customer', id)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="homologator">Homologador</CustomFormLabel>
                <AutoCompleteUser
                  placeholder="Selecione o homologator"
                  value={tempFilters.homologator}
                  onChange={(id) => handleChange('homologator', id)}
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
                <CustomFormLabel htmlFor="homologator">Kwp</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  placeholder="Digite o Kwp"
                  value={tempFilters.product_kwp}
                  onChange={(event) => {
                    const onlyNumbers = event.target.value.replace(/\D/g, '');
                    handleChange('product_kwp', onlyNumbers);
                  }}
                  inputProps={{
                    type: 'number',
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="Status">Status de Homologação</CustomFormLabel>
                <CheckboxesTags
                  options={[
                    { value: 'P', label: 'Pendente' },
                    { value: 'CO', label: 'Concluído' },
                    { value: 'EA', label: 'Em Andamento' },
                    { value: 'C', label: 'Cancelado' },
                    { value: 'D', label: 'Distrato' },
                  ]}
                  placeholder="Selecione o status"
                  value={tempFilters.status}
                  onChange={(event, value) => handleChange('status', value)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="isPreSale">Status do Projeto</CustomFormLabel>
                <CheckboxesTags
                  options={[
                    { value: 'P', label: 'Pendente' },
                    { value: 'CO', label: 'Concluído' },
                    { value: 'EA', label: 'Em Andamento' },
                    { value: 'C', label: 'Cancelado' },
                    { value: 'D', label: 'Distrato' },
                  ]}
                  placeholder="Selecione o Status do Projeto"
                  value={tempFilters.designer_status}
                  onChange={(event, value) => handleChange('designer_status', value)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="isReleased">Liberado para Engenharia</CustomFormLabel>
                <FormControl fullWidth>
                  <Select
                    labelId="is-released-label"
                    value={
                      tempFilters.is_released_to_engineering === null
                        ? ''
                        : tempFilters.is_released_to_engineering.toString()
                    }
                    onChange={(event) =>
                      handleChange(
                        'is_released_to_engineering',
                        event.target.value === '' ? null : event.target.value === 'true',
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    <MenuItem value="true">Sim</MenuItem>
                    <MenuItem value="false">Não</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
            }}
          >
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
