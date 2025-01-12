import React, { useState, useContext } from 'react';
import { Box, Drawer, Button, Typography, Grid } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import CheckboxesTags from './CheckboxesTags';
import FormDateRange from './DateRangePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import { ProjectDataContext } from '@/app/context/ProjectContext';

export default function DrawerFiltersProject() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(ProjectDataContext);

  const [tempFilters, setTempFilters] = useState({
    documentCompletionDate: filters.documentCompletionDate,
    status: filters.status,
    customer: filters.customer,
    designer_status: filters.designer_status,
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

    if (filters.status && filters.status.length > 0) {
      const statusValues = filters.status.map((status) => status.value);
      params.status__in = statusValues.join(',');
    }

    if (filters.designer_status && filters.designer_status.length > 0) {
      const statusValues = filters.designer_status.map((status) => status.value);
      params.designer_status__in = statusValues.join(',');
    }

    return params;
  };

  const handleChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setTempFilters({
      documentCompletionDate: [null, null],
      status: [],
      designer_status: [],
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
                <CustomFormLabel htmlFor="Status">Status do Projeto</CustomFormLabel>
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
                <CustomFormLabel htmlFor="isPreSale">Status do Projetista</CustomFormLabel>
                <CheckboxesTags
                  options={[
                    { value: 'P', label: 'Pendente' },
                    { value: 'CO', label: 'Concluído' },
                    { value: 'EA', label: 'Em Andamento' },
                    { value: 'C', label: 'Cancelado' },
                    { value: 'D', label: 'Distrato' },
                  ]}
                  placeholder="Selecione o Status do Projetist"
                  value={tempFilters.designer_status}
                  onChange={(event, value) => handleChange('designer_status', value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormDateRange
                  label="Selecione a Data de Conclusão"
                  value={tempFilters.documentCompletionDate}
                  onChange={(newValue) => handleChange('documentCompletionDate', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>
            </Grid>
          </Box>

          {/* Botões fixos no rodapé */}
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
