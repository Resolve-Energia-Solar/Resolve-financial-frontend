'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import financierService from '@/services/financierService';
import { debounce } from 'lodash';

export default function AutoCompleteFinancier({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFinancier, setSelectedFinancier] = useState(null);

  useEffect(() => {
    const fetchDefaultFinancier = async () => {
      if (value) {
        try {
          const financier = await financierService.getFinancierById(value);
          if (financier) {
            setSelectedFinancier({ id: financier.id, name: financier.name });
          }
        } catch (error) {
          console.error('Erro ao buscar o financier:', error);
        }
      }
    };

    fetchDefaultFinancier();
  }, [value]);

  useEffect(() => {
    const fetchInitialFinanciers = async () => {
      setLoading(true);
      try {
        const financiers = await financierService.getFinanciers();
        const formattedFinanciers = financiers.results.map(financier => ({
          id: financier.id,
          name: financier.name,
        }));
        setOptions(formattedFinanciers);
      } catch (error) {
        console.error('Erro ao buscar os financiers:', error);
      }
      setLoading(false);
    };

    fetchInitialFinanciers();
  }, []);

  const handleChange = (event, newValue) => {
    setSelectedFinancier(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchFinanciersByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const financiers = await financierService.getFinanciers();
        const filteredFinanciers = financiers.results.filter(financier =>
          financier.name.toLowerCase().includes(name.toLowerCase())
        );
        const formattedFinanciers = filteredFinanciers.map(financier => ({
          id: financier.id,
          name: financier.name,
        }));
        setOptions(formattedFinanciers);
      } catch (error) {
        console.error('Erro ao buscar os financiers:', error);
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
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedFinancier}
        onInputChange={(event, newInputValue) => {
          fetchFinanciersByName(newInputValue);
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