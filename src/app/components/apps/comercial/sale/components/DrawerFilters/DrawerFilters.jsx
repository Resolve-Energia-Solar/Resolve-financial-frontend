import React, { useEffect, useState, useContext } from 'react';
import { Box, Drawer, Button, CardContent, Typography, Grid } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import CheckboxesTags from './CheckboxesTags';
import FormDateRange from './DateRangePicker';
import { SaleDataContext } from '@/app/context/SaleContext';
import AutoCompleteBranch from '../auto-complete/Auto-Input-Branch';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '../auto-complete/Auto-Input-User';

export default function DrawerFilters() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(SaleDataContext);

  const [tempFilters, setTempFilters] = useState({
    documentCompletionDate: filters.documentCompletionDate,
    statusDocument: filters.statusDocument,
    branch: filters.branch,
    customer: filters.customer,
    isPreSale: filters.isPreSale,
  });

  const createFilterParams = (filters) => {
    const params = new URLSearchParams();

    if (
      filters.documentCompletionDate &&
      filters.documentCompletionDate[0] &&
      filters.documentCompletionDate[1]
    ) {
      const startDate = filters.documentCompletionDate[0].toISOString().split('T')[0];
      const endDate = filters.documentCompletionDate[1].toISOString().split('T')[0];
      params.append('document_completion_date__range', `${startDate},${endDate}`);
    }

    if (filters.statusDocument && filters.statusDocument.length > 0) {
      const statusValues = filters.statusDocument.map((status) => status.value);
      params.append('status__in', statusValues.join(','));
    }

    if (filters.branch) {
      params.append('branch', filters.branch);
    }

    if (filters.customer) {
      params.append('customer', filters.customer);
    }

    if (filters.isPreSale) {
      params.append('is_pre_sale', filters.isPreSale);
    }

    return params.toString();
  };

  const handleDateChange = (newValue) => {
    setTempFilters((prev) => ({ ...prev, documentCompletionDate: newValue }));
  };

  const handleStatusChange = (event, value) => {
    setTempFilters((prev) => ({ ...prev, statusDocument: value }));
  };

  const handleBranchChange = (event, value) => {
    setTempFilters((prev) => ({ ...prev, branch: value ? value.id : null }));
  };

  const handleCustomerChange = (event, value) => {
    setTempFilters((prev) => ({ ...prev, customer: value ? value.id : null }));
  };

  const handleIsPreSaleChange = (event) => {
    setTempFilters((prev) => ({ ...prev, isPreSale: event.target.value }));
  };

  const clearFilters = () => {
    setTempFilters({ documentCompletionDate: [null, null], statusDocument: [], branch: null });
  };

  const applyFilters = () => {
    setFilters([tempFilters, decodeURIComponent(createFilterParams(tempFilters))]);
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

  const isPreSale = [
    { value: true, label: 'Pré-Venda' },
    { value: false, label: 'Venda' },
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
                <CustomFormLabel htmlFor="statusDocument">Status da Documentação</CustomFormLabel>
                <CheckboxesTags
                  options={StatusDocument}
                  placeholder="Selecione o status"
                  value={tempFilters.statusDocument}
                  onChange={handleStatusChange}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <CustomFormLabel htmlFor="isPreSale">Tipo de Venda</CustomFormLabel>
                <CheckboxesTags
                  options={isPreSale}
                  placeholder="Selecione o tipo de venda"
                  value={tempFilters.isPreSale}
                  onChange={handleIsPreSaleChange}
                />
              </Grid> */}
              <Grid item xs={12}>
                <FormDateRange
                  label="Selecione a Data de Conclusão"
                  value={tempFilters.documentCompletionDate}
                  onChange={handleDateChange}
                  error={false}
                  helperText=""
                />
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="branch">Franquia</CustomFormLabel>
                <AutoCompleteBranch 
                  value={tempFilters.branch}
                  onChange={(id) => handleBranchChange(null, { id })}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="customer">Cliente</CustomFormLabel>
                <AutoCompleteUser
                  value={tempFilters.customer}
                  onChange={(id) => handleCustomerChange(null, { id })}
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
