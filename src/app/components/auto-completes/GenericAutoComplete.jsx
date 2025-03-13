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
  fetchOptions, // Função assíncrona que recebe o termo e retorna um array de opções
  onChange,     // Callback acionado quando uma opção é selecionada
  getOptionLabel = (option) => (option.label ? option.label : option.toString()),
  debounceTime = 300,
  minQueryLength = 1,
  AddComponent,               // (Opcional) Componente para adicionar um novo item
  onAdd,                      // Callback acionado quando um novo item é criado
  addTitle = 'Adicionar Novo Item', // Título para o modal
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  // Cria uma função debounced para buscar as opções
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
      } catch (err) {
        console.error('Erro na busca de opções:', err);
        setOptions([]);
      }
      setLoading(false);
    }, debounceTime),
    [fetchOptions, debounceTime, minQueryLength]
  );

  // Atualiza as opções sempre que o inputValue mudar
  useEffect(() => {
    if (inputValue.trim() !== '') {
      debouncedFetch(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue, debouncedFetch]);

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  // Aqui acontece a "mágica": ao criar o item, adicionamos às opções e selecionamos
  const handleOnAdd = (newItem) => {
    setOpenAddModal(false);

    console.log('Novo item criado:', newItem);
    console.log('openAddModal:', openAddModal);

    // 1) Adiciona o novo item às opções
    setOptions((prevOptions) => [newItem, ...prevOptions]);

    // 2) Seleciona o novo item no autocomplete
    onChange(newItem);

    // 3) Ajusta o texto no input para o label do item criado
    setInputValue(getOptionLabel(newItem));

    // 4) (Opcional) Dispara callback externo
    if (onAdd) {
      onAdd(newItem);
    }
  };

  return (
    <>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={loading}
        onChange={(event, value) => onChange(value)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        getOptionLabel={getOptionLabel}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                  {AddComponent && (
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
            {/* O componente de adicionar deve aceitar as props onClose e onAdd */}
            <AddComponent onClose={handleAddModalClose} onAdd={handleOnAdd} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GenericAutocomplete;
