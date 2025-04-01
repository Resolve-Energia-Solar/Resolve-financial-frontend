'use client';
import { Fragment, use, useCallback, useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import deadlineService from '@/services/deadlineService';

import { debounce } from 'lodash';

export default function AutoCompleteDeadlineFilter({
  onChange,
  value,
  error,
  helperText,
  noOptionsText,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState(null);

  useEffect(() => {
    const fetchDefaultDeadline = async () => {
      if (value) {
        try {
          const deadlineValue = await deadlineService.find(value);
          if (deadlineValue) {
            setSelectedDeadline({
              id: deadlineValue.id,
              name: deadlineValue.name,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar prazo:', error);
        }
      }
    };

    fetchDefaultDeadline();
  }, [value]);

  useEffect(() => {
    if (!value) {
      setSelectedDeadline(null);
    }
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedDeadline(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchDeadlinesByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const responses = await deadlineService.index({ name: name });
        const formattedDeadlines = responses.results.map((deadline) => ({
          id: deadline.id,
          name: deadline.name,
        }));
        setOptions(formattedDeadlines);
      } catch (error) {
        console.error('Erro ao buscar prazos:', error);
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
        noOptionsText={noOptionsText}
        loading={loading}
        value={selectedDeadline}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
        onInputChange={(event, newInputValue) => {
          fetchDeadlinesByName(newInputValue);
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
