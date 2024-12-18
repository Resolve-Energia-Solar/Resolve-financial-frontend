import { useContext, useState } from 'react';

import { Box, Button, CardContent, Drawer, Grid, Typography } from '@mui/material';
import { FilterAlt, Close } from '@mui/icons-material';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { ScheduleDataContext } from '@/app/context/Inspection/ScheduleContext';
import FormDateRange from '../../../comercial/sale/components/DrawerFilters/DateRangePicker';
import CheckboxesTags from '../../../comercial/sale/components/DrawerFilters/CheckboxesTags';
import AutoCompleteUserFilter from '../../auto-complete/Auto-Input-UserFilter';
import AutoCompleteServiceCatalogFilter from '../../auto-complete/Auto-Input-ServiceFilter';

export default function ScheduleDrawerFilters() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(ScheduleDataContext);

  const [tempFilters, setTempFilters] = useState({
    status: filters.status || [],
    rangeDate: filters.rangeDate || [null, null],
    hora: filters.hora || null,
    customer: filters.customer || null,
    address: filters.address || null,
    scheduleAgent: filters.scheduleAgent || null,
    scheduleService: filters.ScheduleService || null,
  });

  const createFilterParams = (filters) => {
    const params = new URLSearchParams();

    if (filters.rangeDate && filters.rangeDate[0] && filters.rangeDate[1]) {
      const startDate = filters.rangeDate[0].toISOString().split('T')[0];
      const endDate = filters.rangeDate[1].toISOString().split('T')[0];
      params.append('schedule_date__range', `${startDate},${endDate}`);
    }

    if (filters.status && filters.status.length > 0) {
      const statusValues = filters.status.map((status) => status.value);
      params.append('status__in', statusValues.join(','));
    }

    if (filters.scheduleAgent) {
      params.append('schedule_agent', filters.scheduleAgent);
    }

    if (filters.scheduleService) {
      params.append('service', filters.scheduleService);
    }

    return params.toString();
  };

  const handleStatusChange = (event, value) => {
    setTempFilters((prev) => ({ ...prev, status: value }));
  };

  const handleDateChange = (newValue) => {
    setTempFilters((prev) => ({ ...prev, rangeDate: newValue }));
  };

  const handleScheduleAgentChange = (event, value) => {
    setTempFilters((prev) => ({ ...prev, scheduleAgent: value ? value.id : null }));
  };

  const handleScheduleServiceChange = (event, value) => {
    setTempFilters((prev) => ({ ...prev, scheduleService: value ? value.id : null }));
  };

  const clearFilters = () => {
    setTempFilters({ rangeDate: [null, null], name: '', status: [] });
  };

  const applyFilters = () => {
    setFilters([tempFilters, decodeURIComponent(createFilterParams(tempFilters))]);
    console.log('Filtros aplicados:', tempFilters);
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
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Typography variant="h5" sx={{ marginBottom: '25px' }}>
                Filtros
              </Typography>
              <Close onClick={toggleDrawer(false)} />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="status">Status do Agendamento</CustomFormLabel>
                <CheckboxesTags
                  options={StatusSchedule}
                  placeholder="Selecione o status"
                  value={tempFilters.status}
                  onChange={handleStatusChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormDateRange
                  label="Data do Agendamento"
                  value={tempFilters.rangeDate}
                  onChange={handleDateChange}
                  error={false}
                  helperText=""
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="agentName">Agente de Campo</CustomFormLabel>
                <AutoCompleteUserFilter
                  value={tempFilters.scheduleAgent}
                  onChange={(id) => handleScheduleAgentChange(null, { id })}
                  noOptionsText={'Nenhum agente encontrado'}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="serviceName">Serviço</CustomFormLabel>
                <AutoCompleteServiceCatalogFilter
                  value={tempFilters.scheduleService}
                  onChange={(id) => handleScheduleServiceChange(null, { id })}
                  noOptionsText={'Nenhum serviço encontrado'}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 2,
                minWidth: {
                  xs: '200px',
                  sm: '300px',
                  md: '500px',
                },
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" fullWidth onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="contained" fullWidth onClick={applyFilters}>
                    Aplicar Filtros
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Box>
      </Drawer>
    </Box>
  );
}
