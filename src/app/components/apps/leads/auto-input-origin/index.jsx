'use client';
import { Fragment, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import useOrigins from '@/hooks/origins/useOrigin';

export default function AutoCompleteOrigin({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const { originsList, loading, originData } = useOrigins();

  useEffect(() => {
    if (originData && value) {
      setSelectedOrigin({
        id: originData.id,
        name: originData.name,
      });
    }
  }, [originData, value]);

  const handleChange = (event, newValue) => {
    setSelectedOrigin(newValue);
    onChange(newValue ? newValue.id : null);
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name || ''}
        options={originsList}
        loading={loading}
        value={selectedOrigin}
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
