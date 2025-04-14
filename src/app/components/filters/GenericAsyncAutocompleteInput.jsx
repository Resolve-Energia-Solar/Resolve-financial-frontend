import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress, Typography } from '@mui/material';
import apiClient from '@/services/apiClient';

const GenericAsyncAutocompleteInput = ({
  label,
  value,
  onChange,
  endpoint,
  queryParam = 'search',
  extraParams = {},
  mapResponse,
  debounceTime = 300,
  error = false,
  helperText = '',
  noOptionsText = 'Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa.',
  renderOption,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const stableExtraParams = useMemo(() => extraParams, [JSON.stringify(extraParams)]);
  const stableMapResponse = useMemo(() => mapResponse, [mapResponse]);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    if (typeof value === 'object') return value;
    return options.find((option) => option.value === value) || null;
  }, [value, options]);

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          [queryParam]: inputValue,
          ...stableExtraParams,
        });
        const page = 1;
        const limit = 10;
        const response = await apiClient.get(`${endpoint}?${params.toString()}`, {
          params: { page, limit },
        });
        const data = response.data;
        const fetchedOptions = stableMapResponse ? stableMapResponse(data) : data.results || [];
        if (active) {
          setOptions(fetchedOptions);
        }
      } catch (err) {
        console.error('Error fetching options:', err);
      } finally {
        if (active) setLoading(false);
      }
    }, debounceTime);
    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [inputValue, open, endpoint, queryParam, stableExtraParams, stableMapResponse, debounceTime]);

  useEffect(() => {
    const fetchInitialOption = async () => {
      if (!value || typeof value === 'object') return;
      if (options.find((option) => option.value === value)) return;
      try {
        const response = await apiClient.get(`${endpoint}/${value}`, {
          params: stableExtraParams,
        });
        const item = response.data;
        const mappedOption = stableMapResponse
          ? stableMapResponse({ results: [item] })[0]
          : { label: item.complete_name || item.name || '', value: item.id };
        setOptions((prevOptions) => [...prevOptions, mappedOption]);
      } catch (err) {
        console.error('Error fetching initial option:', err);
      }
    };
    fetchInitialOption();
  }, [value, options, endpoint, stableExtraParams, stableMapResponse]);

  return (
    <Autocomplete
      freeSolo
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      getOptionLabel={(option) => option.label || ''}
      loading={loading}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      onChange={(event, newValue) => onChange(newValue)}
      value={selectedOption}
      loadingText="Carregando..."
      noOptionsText={noOptionsText}
      renderOption={
        renderOption ||
        ((props, option) => (
          <li {...props}>
            <Typography variant="body1">{option.label}</Typography>
          </li>
        ))
      }
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          margin="normal"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default GenericAsyncAutocompleteInput;
