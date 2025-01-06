'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import phoneNumberService from '@/services/phoneNumberService';
import { debounce } from 'lodash';

export default function AutoCompletePhoneNumber({ onChange, value, error, helperText, ...rest }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);

  useEffect(() => {
    const fetchDefaultPhone = async () => {
      if (value && value.length > 0) {
        try {
          const phone = await phoneNumberService.getPhoneNumberById(value);
          if (phone) {
            setSelectedPhone({
              id: phone.id,
              label: `+${phone.country_code} (${phone.area_code}) ${phone.phone_number}`,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar telefone:', error);
        }
      }
    };

    fetchDefaultPhone();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedPhone(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchPhonesByUser = useCallback(
    debounce(async (query) => {
      if (!query) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const phones = await phoneNumberService.getPhoneNumbersByQuery(query);
        if (phones && phones.results) {
          const formattedPhones = phones.results.map((phone) => ({
            id: phone.id,
            label: `+${phone.country_code} (${phone.area_code}) ${phone.phone_number}`,
          }));
          setOptions(formattedPhones);
        }
      } catch (error) {
        console.error('Erro ao buscar telefones:', error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const fetchInitialPhones = useCallback(async () => {
    setLoading(true);
    try {
      const phones = await phoneNumberService.getPhoneNumbers({ limit: 5, page: 1 });
      if (phones && phones.results) {
        const formattedPhones = phones.results.map((phone) => ({
          id: phone.id,
          label: `+${phone.country_code} (${phone.area_code}) ${phone.phone_number}`,
        }));
        setOptions(formattedPhones);
      }
    } catch (error) {
      console.error('Erro ao buscar telefones:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialPhones();
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
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.label}
        options={options}
        loading={loading}
        value={selectedPhone}
        {...rest}
        onInputChange={(event, newInputValue) => {
          fetchPhonesByUser(newInputValue);
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
