'use client';
import { useEffect, useState, Fragment } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import useRoofTypes from '@/hooks/roofTypes/useRoofTypes';

export default function AutoCompleteRoofType({ onChange, value, error, helperText, disabled }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { loading, roofTypes, searchByName } = useRoofTypes();

  useEffect(() => {
    setOptions(roofTypes);
  }, [roofTypes]);

  const handleChange = (event, newValue) => {
    onChange(newValue ? newValue.id : null);
  };

  const handleInputChange = (event, newInputValue) => {
    searchByName(newInputValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={options}
      loading={loading}
      value={value}
      disabled={disabled}
      onInputChange={handleInputChange}
      onChange={handleChange}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name || ''}
      renderInput={(params) => (
        <CustomTextField
          label="Tipo de Telhado"
          error={error}
          helperText={helperText}
          {...params}
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
  );
}
