import { useContext, useState } from 'react';

import { Box, Button, CardContent, Drawer, Grid, Typography } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { CategoryDataContext } from '@/app/context/Inspection/CategoryContext';

export default function CategoryDrawerFilters() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(CategoryDataContext);

  const [tempFilters, setTempFilters] = useState({
    name: filters.name || '',
    members: filters.members || null,
  });

  const createFilterParams = (filters) => {
    const params = new URLSearchParams();

    if (filters.name) {
      params.append('name__icontains', filters.name);
    }

    if (filters.members) {
      params.append('members', filters.members);
    }

    return params.toString();
  };

  const handleNameChange = (e) => {
    setTempFilters((prev) => ({ ...prev, name: e.target.value }));
  };

  const clearFilters = () => {
    setTempFilters({ name: '', members: null });
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
                <CustomFormLabel htmlFor="categoryName">Nome da Categoria</CustomFormLabel>
                <CustomTextField
                  value={tempFilters.name}
                  onChange={handleNameChange}
                  placeholder="Nome da categoria"
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
