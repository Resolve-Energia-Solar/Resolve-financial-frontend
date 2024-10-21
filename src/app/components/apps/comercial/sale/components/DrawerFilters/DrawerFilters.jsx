import React, { useEffect, useState } from 'react';
import { Box, Drawer, Button, CardContent, Typography, Grid } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import CheckboxesTags from './CheckboxesTags';
import FormDateRange from './DateRangePicker';
import { useContext } from 'react';
import { SaleDataContext } from '@/app/context/SaleContext';

export default function DrawerFilters() {
  const [open, setOpen] = React.useState(false);
  const { filters, setFilters } = useContext(SaleDataContext);
  
  const [tempFilters, setTempFilters] = useState({
    dateRange: filters.dateRange,
    statusDocument: filters.statusDocument,
  });

  const handleDateChange = (newValue) => {
    setTempFilters((prev) => ({ ...prev, dateRange: newValue }));
  };

  const handleStatusChange = (event, value) => {
    setTempFilters((prev) => ({ ...prev, statusDocument: value }));
  };

  const clearFilters = () => {
    setTempFilters({ dateRange: [null, null], statusDocument: [] });
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

  const StatusDocument = [
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

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
                <CheckboxesTags
                  options={StatusDocument}
                  label="Status da Documentação"
                  placeholder="Selecione o status"
                  value={tempFilters.statusDocument}
                  onChange={handleStatusChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormDateRange
                  label="Selecione a Data de Conclusão"
                  value={tempFilters.dateRange}
                  onChange={handleDateChange}
                  error={false}
                  helperText=""
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
