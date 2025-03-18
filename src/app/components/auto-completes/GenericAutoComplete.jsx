'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { debounce } from 'lodash';

const GenericAutocomplete = ({
  label = 'Selecione uma opção',
  fetchOptions,
  onChange,
  getOptionLabel = (option) => (option.label ? option.label : option.toString()),
  debounceTime = 300,
  minQueryLength = 1,
  AddComponent,
  onAdd,
  addTitle = 'Adicionar Novo Item', 
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const debouncedFetch = useCallback(
    debounce(async (query) => {
      if (query.length < minQueryLength) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const newOptions = await fetchOptions(query);
        setOptions(newOptions);
        console.log('Opções:', newOptions);
      } catch (err) {
        console.error('Erro na busca de opções:', err);
        setOptions([]);
      }
      setLoading(false);
    }, debounceTime),
    [fetchOptions, debounceTime, minQueryLength]
  );

  useEffect(() => {
    if (inputValue.trim() !== '') {
      debouncedFetch(inputValue);
    } else {
      (async () => {
        setLoading(true);
        try {
          const initialOptions = await fetchOptions('');
          setOptions(initialOptions.slice(0, 10));
        } catch (err) {
          console.error('Erro na busca inicial:', err);
          setOptions([]);
        }
        setLoading(false);
      })();
    }
  }, [inputValue, debouncedFetch]);

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const isMultiple = props.multiple;

  const handleOnAdd = (newItem) => {
    setOpenAddModal(false);

    setOptions((prevOptions) => [newItem, ...prevOptions]);

    if (isMultiple) {
      const currentValue = Array.isArray(props.value) ? props.value : [];
      onChange([newItem, ...currentValue]);
    } else {
      onChange(newItem);
    }

    setInputValue(getOptionLabel(newItem));

    if (onAdd) {
      onAdd(newItem);
    }
  };

  const valueProp = isMultiple ? (props.value || []) : props.value || null;

  return (
    <>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        value={valueProp}
        onChange={(event, value) => onChange(value)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        getOptionLabel={getOptionLabel}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            {...(props.error && { error: true, helperText: props.helperText })}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                  {AddComponent && !props.disabled && (
                    <IconButton
                      onClick={() => setOpenAddModal(true)}
                      aria-label="Adicionar"
                      edge="end"
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </>
              ),
            }}
          />
        )}
        {...props}
      />

      {AddComponent && (
        <Dialog
          open={openAddModal}
          onClose={handleAddModalClose}
          fullWidth
          maxWidth="md"
          scroll="paper"
          sx={{
            '& .MuiDialog-paper': {
              maxHeight: '80vh',
            },
          }}
        >
          <DialogTitle>{addTitle}</DialogTitle>
          <DialogContent dividers>
            <AddComponent onClose={handleAddModalClose} onAdd={handleOnAdd} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GenericAutocomplete;
