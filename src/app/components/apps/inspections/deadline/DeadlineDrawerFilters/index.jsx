import { useContext, useState } from 'react';

import { Box, Button, CardContent, Drawer, Grid, Typography } from '@mui/material';
import { FilterAlt, Close } from '@mui/icons-material';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { DeadlineDataContext } from '@/app/context/Inspection/DeadlineContext';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';

export default function DeadlineDrawerFilters() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(DeadlineDataContext);

  const [tempFilters, setTempFilters] = useState({
    name: filters.name || [],
    observation: filters.observation || '',
  });

  const createFilterParams = (filters) => {
    const params = new URLSearchParams();

    if (filters.name) {
      params.append('name__icontains', filters.name);
    }

    if (filters.observation) {
      params.append('observation__icontains', filters.observation);
    }

    return params.toString();
  };

  const toggleDrawer = (inOpen) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(inOpen);
  };

  const handleNameChange = (event) => {
    setTempFilters((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleObservationChange = (event) => {
    setTempFilters((prev) => ({ ...prev, observation: event.target.value }));
  };

  const clearFilters = () => {
    setTempFilters({ name: '', observation: '' });
  };

  const applyFilters = () => {
    setFilters([tempFilters, decodeURIComponent(createFilterParams(tempFilters))]);
    console.log('Filtros aplicados:', tempFilters);
    setOpen(false);
  };

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
              {/* Name */}
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="deadlineName">Nome</CustomFormLabel>
                <CustomTextField
                  name="deadlineName"
                  placeholder="Nome"
                  variant="outlined"
                  fullWidth
                  value={tempFilters.name}
                  onChange={handleNameChange}
                />
              </Grid>

              {/* Observação */}
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="observation">Observação</CustomFormLabel>
                <CustomTextField
                  name="observation"
                  placeholder="Observação"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={tempFilters.observation}
                  onChange={handleObservationChange}
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
