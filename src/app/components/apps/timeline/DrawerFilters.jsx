import React, { useContext, useState } from 'react';
import { Box, Drawer, Button, CardContent, Typography, Grid, TextField } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimelineContext } from '@/app/context/timelineContext';

export default function DrawerFilters() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(TimelineContext);

  const [tempFilters, setTempFilters] = useState({
    agent: filters.agent,
    date: filters.date,
  });

  const handleDateChange = (newValue) => {
    setTempFilters((prev) => ({ ...prev, date: newValue }));
  };

  const handleAgentChange = (e) => {
    setTempFilters((prev) => ({ ...prev, agent: e.target.value }));
  };

  const clearFilters = () => {
    setTempFilters({ date: null });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    console.log('Filtros aplicados:', tempFilters);
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
        <Box role="presentation" sx={{ padding: 2, maxWidth: '600px' }}>
          <CardContent>
            <Typography variant="h5" sx={{ marginBottom: '25px' }}>
              Filtros
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Agente" fullWidth value={tempFilters.agent} onChange={handleAgentChange} placeholder='Nome do agente' />
              </Grid>
              <Grid item xs={12}>
                <DatePicker
                  label="Data"
                  value={tempFilters.date}
                  onChange={handleDateChange}
                  inputFormat='dd/MM/yyyy'
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
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
          </CardContent>
        </Box>
      </Drawer>
    </Box>
  );
}
