'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import saleService from '@/services/saleService';
import { debounce } from 'lodash';

export default function AutoCompleteSale({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    const fetchDefaultSale = async () => {
      if (value) {
        try {
          const sale = await saleService.getSaleById(value);
          if (sale) {
            setSelectedSale({ id: sale.id, name: sale.contract_number + ' - ' + sale.customer.complete_name });
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
        setOptions([]); // Limpa opções se não houver nome
        return;
      }
      setLoading(true);
      try {
        const sales = await saleService.getSales();
        // Verifique se 'sales.results' está presente
        if (sales && sales.results) {
          const filteredSales = sales.results.filter(sale =>
            `${sale.contract_number} - ${sale.customer.complete_name}`.toLowerCase().includes(name.toLowerCase())
          );
          const formattedSales = filteredSales.map(sale => ({
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
    []
  );

  const handleOpen = () => {
    setOpen(true);
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
