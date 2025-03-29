'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import productService from '@/services/productsService';

import { debounce } from 'lodash';

export default function AutoCompleteProduct({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchDefaultProduct = async () => {
      if (value) {
        try {
          const productValue = await productService.find(value);
          if (productValue) {
            setSelectedProduct({
              id: productValue.id,
              name: productValue.name,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar produto:', error);
        }
      }
    };

    fetchDefaultProduct();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedProduct(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchProductsByName = useCallback(
    debounce(async (name) => {
      setLoading(true);
      try {
        const responses = await productService.index({ name__icontains: name.join(',') });
        const formattedProducts = responses.results.map((product) => ({
          id: product.id,
          name: product.name,
        }));
        setOptions(formattedProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
      setLoading(false);
    }, 300),
    [],
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
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name || ''}
        options={options}
        loading={loading}
        value={selectedProduct}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
        onInputChange={(event, newInputValue) => {
          fetchProductsByName(newInputValue);
        }}
        onChange={handleChange}
        onFocus={() => fetchProductsByName('')}
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
