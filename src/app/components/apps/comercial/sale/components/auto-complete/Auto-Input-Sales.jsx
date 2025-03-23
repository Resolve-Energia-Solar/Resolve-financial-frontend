'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import saleService from '@/services/saleService';
import { debounce } from 'lodash';

export default function AutoCompleteSale({ onChange, value, error, helperText, ...rest }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  console.log('value', value);

  useEffect(() => {
    const fetchDefaultSale = async () => {
      if (value) {
        try {
          const sale = await saleService.getSaleById(value);
          if (sale) {
            setSelectedSale({
              id: sale.id,
              name: sale.contract_number + ' - ' + sale.customer.complete_name,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar venda:', error);
        }
      }
    };

    fetchDefaultSale();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedSale(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchSalesByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const sales = await saleService.getSaleByFullName(name);
        if (sales && sales.results) {
          const formattedSales = sales.results.results.map((sale) => ({
            id: sale.id,
            name: `${sale.contract_number} - ${sale.customer.complete_name}`,
          }));
          setOptions(formattedSales);
        }
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const fetchInitialSales = useCallback(async () => {
    setLoading(true);
    try {
      const sales = await saleService.index({ limit: 5, page: 1 });
      if (sales && sales.results) {
        console.log('sales', sales);
        const formattedSales = sales.results.map((sale) => ({
          id: sale.id,
          name: `${sale.contract_number} - ${sale.customer.complete_name}`,
        }));
        setOptions(formattedSales);
      }
    } catch (error) {
      console.error('Erro ao buscar vendas:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialSales();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id} // Compara pelos IDs
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedSale}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
        {...rest}
        onInputChange={(event, newInputValue) => {
          fetchSalesByName(newInputValue);
        }}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            error={error}
            helperText={helperText}
            {...params}
            size="small"
            variant="outlined"
            {...rest}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
}
