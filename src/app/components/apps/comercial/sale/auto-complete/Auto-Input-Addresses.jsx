'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import addressService from '@/services/addressService';
import { debounce } from 'lodash';

export default function AutoCompleteAddresses({ onChange, value = [], error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);

  useEffect(() => {
    const fetchDefaultAddresses = async () => {
      if (value.length > 0) {
        try {
          const addresses = await Promise.all(value.map(id => addressService.getAddressById(id))); 
          console.log('Addresses:', addresses);
          const formattedAddresses = addresses.map(address => ({
            id: address.id,
            name: `${address.street}, ${address.number}, ${address.city}, ${address.state}`
          }));
          setSelectedAddresses(formattedAddresses);
        } catch (error) {
          console.error('Erro ao buscar endereços:', error);
        }
      }
    };

    fetchDefaultAddresses();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedAddresses(newValue);
    onChange(newValue.map(address => address.id)); 
  };

  const fetchAddressesByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const addresses = await addressService.getAddresses();
        if (addresses && addresses.results) {
          const filteredAddresses = addresses.results.filter(address =>
            `${address.street}, ${address.number}, ${address.city}, ${address.state}`.toLowerCase().includes(name.toLowerCase())
          );
          const formattedAddresses = filteredAddresses.map(address => ({
            id: address.id,
            name: `${address.street}, ${address.number}, ${address.city}, ${address.state}`,
          }));
          setOptions(formattedAddresses);
        }
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
        multiple
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id} // Compara pelos IDs
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedAddresses}
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
