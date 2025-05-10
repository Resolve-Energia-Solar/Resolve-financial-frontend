'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import apiClient from '@/services/apiClient';

export default function GenericAsyncAutocompleteInput({
  label,
  value,
  onChange,
  inputValue: controlledInputValue,
  onInputChange: controlledOnInputChange,
  endpoint,
  queryParam = 'search',
  extraParams = {},
  mapResponse,
  multiselect = false,
  debounceTime = 300,
  error = false,
  helperText = '',
  noOptionsText = 'Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa.',
  renderOption,
  renderCreateModal,
  onCreateObject,
  ...props
}) {

  const [uncontrolledInputValue, setUncontrolledInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newObjectData, setNewObjectData] = useState({ label: '', value: '' });
  const [createErrors, setCreateErrors] = useState({});

  const inputValue = controlledInputValue !== undefined ? controlledInputValue : uncontrolledInputValue;
  const handleInputChange = controlledOnInputChange !== undefined
    ? controlledOnInputChange
    : (event, newValue) => setUncontrolledInputValue(newValue);

  const stableExtraParams = useMemo(() => extraParams, [JSON.stringify(extraParams)]);
  const stableMapResponse = useMemo(() => mapResponse, [mapResponse]);

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
        const { data } = await apiClient.get(`${endpoint}?${params.toString()}`, {
          params: { page: 1, limit: 10 },
        });
        const fetched = stableMapResponse ? stableMapResponse(data) : data.results || [];
        if (active) setOptions(fetched);
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
    const fetchInitial = async () => {
      if (multiselect && Array.isArray(value)) {
        const missing = value.filter(val => !options.find(o => o.value === (val.value ?? val)));
        for (const val of missing) {
          try {
            const id = typeof val === 'object' ? val.value : val;
            const url = `${endpoint.replace(/\/$/, '')}/${id}`;
            const { data } = await apiClient.get(url, { params: stableExtraParams });
            const mapped = stableMapResponse
              ? stableMapResponse({ results: [data] })[0]
              : { label: data.complete_name || data.name || '', value: data.id };
            setOptions(prev => [...prev, mapped]);
          } catch (err) {
            console.error('Error fetching initial option:', err);
          }
        }
      } else if (!multiselect && value && typeof value !== 'object') {
        if (!options.find(o => o.value === value)) {
          try {
            const url = `${endpoint.replace(/\/$/, '')}/${value}`;
            const { data } = await apiClient.get(url, { params: stableExtraParams });
            const mapped = stableMapResponse
              ? stableMapResponse({ results: [data] })[0]
              : { label: data.complete_name || data.name || '', value: data.id };
            setOptions(prev => [...prev, mapped]);
          } catch (err) {
            console.error('Error fetching initial option:', err);
          }
        }
      }
    };
    fetchInitial();
  }, [value, multiselect, endpoint, stableExtraParams, stableMapResponse]);

const selectedOption = useMemo(() => {
  if (multiselect && Array.isArray(value)) {
    return value
      .map(val =>
        typeof val === 'object' ? val : options.find(opt => opt.value === val)
      )
      .filter(Boolean);
  } else {
    if (!value) return null;
    return typeof value === 'object' ? value : options.find(opt => opt.value === value) || null;
  }
}, [value, options, multiselect]);

const handleCreate = async () => {
  try {
    const result = await onCreateObject(newObjectData);
    const created = result?.data ?? result;

    let newOpt;
    if (stableMapResponse) {
      newOpt = stableMapResponse({ results: [created] })[0];
    } else {
      newOpt = {
        label: created.label ?? created.name ?? '',
        value: created.id ?? created.value,
      };
    }

    setOptions(prev => [...prev, newOpt]);
    onChange(multiselect ? [...(selectedOption || []), newOpt] : newOpt.value);
    setCreateErrors({});
    setCreateModalOpen(false);
  } catch (err) {
    if (err.response?.data && typeof err.response.data === 'object') {
      setCreateErrors(err.response.data);
    } else {
      console.error('Error creating object:', err);
    }
  };
};

return (
  <>
    <Autocomplete
      multiple={multiselect}
      freeSolo={!multiselect}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      getOptionLabel={opt => opt.label || ''}
      loading={loading}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={(e, v) => onChange(v)}
      value={selectedOption}
      loadingText="Carregando..."
      noOptionsText={noOptionsText}
      renderOption={renderOption}
      {...props}
      renderInput={params => (
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
                {loading && <CircularProgress size={20} />}
                {renderCreateModal && !loading && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setCreateModalOpen(true)}>
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />

    {renderCreateModal && (
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Adicionar {label}</DialogTitle>
        <DialogContent>
          {renderCreateModal({
            newObjectData,
            setNewObjectData,
            onCreate: handleCreate,
            onClose: () => setCreateModalOpen(false),
            errors: createErrors
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    )}
  </>
);
}
