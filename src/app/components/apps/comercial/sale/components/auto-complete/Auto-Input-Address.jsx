'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { debounce } from 'lodash';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import addressService from '@/services/addressService';
import CreateAddressPage from '@/app/components/apps/address/Add-address';
import { useSnackbar } from 'notistack';

export default function AutoCompleteAddress({
  onChange,
  value,
  error,
  helperText,
  disableSuggestions = false,
  options = [],
  ...props
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Cria um label formatado para exibição
  const createLabelAddress = (address) => ({
    id: address.id,
    name: `${address.street}, ${address.number}, ${address.city}, ${address.state}`,
  });

  // Busca o endereço padrão pelo ID e atualiza o estado
  const fetchDefaultAddress = async (addressId) => {
    if (!addressId) return;
    try {
      const addressValue = await addressService.getAddressById(addressId);
      if (addressValue) {
        const formatted = createLabelAddress(addressValue);
        setSelectedAddress(formatted);
        onChange(formatted.id);
      }
    } catch (error) {
      console.error('Erro ao buscar address:', error);
      enqueueSnackbar(`Erro ao buscar endereço: ${error.message}`, { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchDefaultAddress(value);
  }, [value]);

  // Atualiza o valor selecionado e retorna o ID
  const handleChange = (event, newValue) => {
    setSelectedAddress(newValue);
    onChange(newValue ? newValue.id : null);
  };

  // Função debounced para buscar endereços conforme o usuário digita
  const fetchAddresses = useCallback(
    debounce(async (query) => {
      if (!query || disableSuggestions) {
        setInternalOptions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await addressService.getAddressByFullAddress(query);
        const formatted = response.results.map(createLabelAddress);
        setInternalOptions(formatted);
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
        enqueueSnackbar(`Erro ao buscar endereços: ${error.message}`, { variant: 'error' });
      }
      setLoading(false);
    }, 300),
    [disableSuggestions, enqueueSnackbar]
  );

  const handleClose = () => {
    setOpen(false);
    setInternalOptions([]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Ao criar um novo endereço, busca e atualiza automaticamente o endereço selecionado
  const addAddress = async (newId) => {
    if (!newId) return;
    try {
      const addressValue = await addressService.getAddressById(newId);
      if (addressValue) {
        const formatted = createLabelAddress(addressValue);
        setSelectedAddress(formatted);
        onChange(formatted.id);
        setOpenModal(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar endereço:', error);
      enqueueSnackbar(`Erro ao adicionar endereço: ${error.message}`, { variant: 'error' });
    }
  };

  const displayOptions = options.length > 0 ? options : internalOptions;

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={handleClose}
        isOptionEqualToValue={(option, val) => option.name === val.name}
        getOptionLabel={(option) => option.name || ''}
        options={displayOptions}
        loading={loading}
        value={selectedAddress}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo."
        {...props}
        onInputChange={(event, newInputValue) => {
          if (!disableSuggestions) {
            fetchAddresses(newInputValue);
          }
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
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                  <IconButton
                    onClick={() => setOpenModal(true)}
                    aria-label="Adicionar endereço"
                    edge="end"
                    size="small"
                    sx={{ padding: '4px' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </>
              ),
            }}
          />
        )}
      />

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            width: { xs: '95%', md: '80%' },
            maxWidth: '1000px',
            m: 0,
            p: 0,
          },
        }}
      >
        <DialogTitle sx={{ p: 1, fontSize: '1rem' }}>
          Adicionar Novo Endereço
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <CreateAddressPage
            onClose={handleCloseModal}
            selectedAddressId={addAddress}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
