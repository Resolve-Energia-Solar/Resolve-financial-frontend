'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import addressService from '@/services/addressService'; // Serviço para buscar endereços
import { debounce } from 'lodash';

export default function AutoCompleteAddress({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      if (value) {
        try {
          const addressValue = await addressService.getAddressById(value);
          if (addressValue) {
            setSelectedAddress({
              id: addressValue.id, 
              name: `${addressValue.street}, ${addressValue.number}, ${addressValue.city}, ${addressValue.state}` 
            });
          }
        } catch (error) {
          console.error('Erro ao buscar address:', error);
        }
      }
    };

    fetchDefaultAddress();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedAddress(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchAddressesByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const response = await addressService.getAddressByFullAddress(name);
        const formattedAddresses = response.results.map(address => ({
          id: address.id,
          name: `${address.street}, ${address.number}, ${address.city}, ${address.state}`,
        }));
        setOptions(formattedAddresses);
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
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
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name || ''}
        options={options}
        loading={loading}
        value={selectedAddress}
        onInputChange={(event, newInputValue) => {
          fetchAddressesByName(newInputValue);
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
