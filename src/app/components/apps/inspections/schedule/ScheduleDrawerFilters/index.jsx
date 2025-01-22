import React, { useState, useContext } from 'react';
import { Box, Drawer, Button, Typography, Grid } from '@mui/material';
import { FilterAlt, Close } from '@mui/icons-material';
import CheckboxesTags from '../../../comercial/sale/components/DrawerFilters/CheckboxesTags';
import FormDateRange from '../../../comercial/sale/components/DrawerFilters/DateRangePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUserFilter from '../../auto-complete/Auto-Input-UserFilter';
import AutoCompleteServiceCatalogFilter from '../../auto-complete/Auto-Input-ServiceFilter';
import { ScheduleDataContext } from '@/app/context/Inspection/ScheduleContext';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import AutoInputStatusSchedule from '../../auto-complete/Auto-Input-StatusInspection';

export default function ScheduleDrawerFilters() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(ScheduleDataContext);

  const [tempFilters, setTempFilters] = useState({
    rangeDate: filters.rangeDate || [null, null],
    status: filters.status || [],
    scheduleAgent: filters.scheduleAgent || null,
    scheduleService: filters.scheduleService || null,
    customer: filters.customer || null,
    final_service_opinion: filters.final_service_opinion || null,
  });

  const createFilterParams = (filters) => {
    const params = {};

    if (filters.rangeDate && filters.rangeDate[0] && filters.rangeDate[1]) {
      const startDate = filters.rangeDate[0].toISOString().split('T')[0];
      const endDate = filters.rangeDate[1].toISOString().split('T')[0];
      params.schedule_date__range = `${startDate},${endDate}`;
    }

    if (filters.status && filters.status.length > 0) {
      params.status__in = filters.status.map((status) => status.value).join(',');
    }

    if (filters.scheduleAgent) {
      params.schedule_agent = filters.scheduleAgent;
    }

    if (filters.scheduleService) {
      params.service = filters.scheduleService;
    }

    if (filters.customer) {
      params.customer = filters.customer;
    }

    if (filters.final_service_opinion) {
      params.final_service_opinion = filters.final_service_opinion;
    }

    return params;
  };

  const handleChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setTempFilters({
      rangeDate: [null, null],
      status: [],
      scheduleAgent: null,
      scheduleService: null,
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

  const StatusSchedule = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Button variant="outlined" onClick={toggleDrawer(true)} startIcon={<FilterAlt />}>
        Filtros
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <Box role="presentation" sx={{ padding: 2, maxWidth: '600px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <Typography variant="h5">Filtros</Typography>
            <Close onClick={toggleDrawer(false)} sx={{ cursor: 'pointer' }} />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomFormLabel>Status do Agendamento</CustomFormLabel>
              <CheckboxesTags
                options={StatusSchedule}
                placeholder="Selecione o status"
                value={tempFilters.status}
                onChange={(event, value) => handleChange('status', value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormDateRange
                label="Data do Agendamento"
                value={tempFilters.rangeDate}
                onChange={(newValue) => handleChange('rangeDate', newValue)}
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
              <CustomFormLabel>Agente de Campo</CustomFormLabel>
              <AutoCompleteUserFilter
                value={tempFilters.scheduleAgent}
                onChange={(id) => handleChange('scheduleAgent', id)}
                noOptionsText="Nenhum agente encontrado"
              />
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel>Serviço</CustomFormLabel>
              <AutoCompleteServiceCatalogFilter
                value={tempFilters.scheduleService}
                onChange={(id) => handleChange('scheduleService', id)}
                noOptionsText="Nenhum serviço encontrado"
              />
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="final_service_opinion">
                Parecer final de serviço
              </CustomFormLabel>
              <AutoInputStatusSchedule
                onChange={(id) => handleChange('final_service_opinion', id)}
                value={tempFilters.final_service_opinion}
                isFinalOpinion={true}
                serviceId={tempFilters.scheduleService}
                disabled={!tempFilters.scheduleService}
                helperText={"Para filtrar por parecer final de serviço, selecione um serviço."}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button variant="outlined" onClick={clearFilters} fullWidth sx={{ marginRight: 1 }}>
              Limpar Filtros
            </Button>
            <Button variant="contained" onClick={applyFilters} fullWidth>
              Aplicar Filtros
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
