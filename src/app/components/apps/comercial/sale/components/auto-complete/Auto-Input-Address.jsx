'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
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

  // Estado de abertura do Autocomplete (dropdown)
  const [open, setOpen] = useState(false);
  // Estado local das opções obtidas do backend
  const [internalOptions, setInternalOptions] = useState([]);
  // Indica se está carregando as opções
  const [loading, setLoading] = useState(false);
  // Estado para a opção selecionada
  const [selectedAddress, setSelectedAddress] = useState(null);
  // Controle de abertura do modal de "Adicionar Endereço"
  const [openModal, setOpenModal] = useState(false);

  // Lista de endereços selecionados (caso precise de mais de um, ou use apenas 1)
  const [selectedAddresses, setSelectedAddresses] = useState([]);

  // Ao montar ou mudar 'value', busca o endereço default
  useEffect(() => {
    fetchDefaultAddress(value);
  }, [value]);

  // Busca endereço por ID (caso 'value' seja um ID) e define no estado
  const fetchDefaultAddress = async (addressId) => {
    if (!addressId) return;
    try {
      const addressValue = await addressService.getAddressById(addressId);
      if (addressValue) {
        const formatted = createLabelAddress(addressValue);
        setSelectedAddress(formatted);
        // Se não tiver 'value', chamamos onChange para definir
        if (!value) onChange(addressValue.id);
      }
    } catch (error) {
      console.error('Erro ao buscar address:', error);
      enqueueSnackbar(`Erro ao buscar endereço: ${error.message}`, { variant: 'error' });
    }
  };

  // Cria um label formatado para exibir no dropdown
  const createLabelAddress = (address) => {
    return {
      id: address.id,
      name: `${address.street}, ${address.number}, ${address.city}, ${address.state}`,
    };
  };

  // Quando muda o valor do autocomplete
  const handleChange = (event, newValue) => {
    setSelectedAddress(newValue);
    // Se a opção for nula, passa null para o onChange
    onChange(newValue ? newValue.id : null);
  };

  // Busca endereços conforme o usuário digita (com debounce)
  const fetchAddressesByName = useCallback(
    debounce(async (name) => {
      if (!name || disableSuggestions) return;
      setLoading(true);
      try {
        const response = await addressService.getAddressByFullAddress(name);
        const formattedAddresses = response.results.map(createLabelAddress);
        setInternalOptions(formattedAddresses);
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
        enqueueSnackbar(`Erro ao buscar endereços: ${error.message}`, { variant: 'error' });
      }
      setLoading(false);
    }, 300),
    [disableSuggestions, enqueueSnackbar]
  );

  // Busca inicial de endereços ao abrir o dropdown
  const fetchInitialAddresses = useCallback(async () => {
    if (disableSuggestions) return;
    setLoading(true);
    try {
      const response = await addressService.getAddresses({ limit: 5 });
      const formattedAddresses = response.results.map(createLabelAddress);
      setInternalOptions(formattedAddresses);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      enqueueSnackbar(`Erro ao buscar endereços: ${error.message}`, { variant: 'error' });
    }
    setLoading(false);
  }, [disableSuggestions, enqueueSnackbar]);

  // Fecha o dropdown e limpa as opções
  const handleClose = () => {
    setOpen(false);
    setInternalOptions([]);
  };

  // Fecha o modal "Adicionar Endereço"
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Função chamada ao criar um novo endereço no modal
  const addAddress = async (newId) => {
    // Depois de criar o endereço, podemos buscar e setar como selecionado
    await fetchDefaultAddress(newId);
  };

  // Recarrega endereços ao fechar o modal
  const refreshAddresses = async () => {
    await fetchInitialAddresses();
  };

  // Combina opções externas (props.options) com internas (internalOptions)
  const displayOptions = options.length > 0 ? options : internalOptions;

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={() => {
          setOpen(true);
          if (options.length === 0 && !disableSuggestions) {
            fetchInitialAddresses();
          }
        }}
        onClose={handleClose}
        isOptionEqualToValue={(option, val) => option.name === val.name}
        getOptionLabel={(option) => option.name || ''}
        options={displayOptions}
        loading={loading}
        value={selectedAddress}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado. Tente digitar algo ou mudar a pesquisa."
        {...props}
        onInputChange={(event, newInputValue) => {
          if (!disableSuggestions) fetchAddressesByName(newInputValue);
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
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
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

      {/* Modal para adicionar novo endereço */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth={false} // Remove limite de largura
        sx={{
          // Remove ou reduz padding para mobile
          '& .MuiDialog-paper': {
            width: { xs: '95%', md: '80%' },
            maxWidth: '1000px',
            m: 0, // remove margin
            p: 0, // remove padding
          },
        }}
      >
        <DialogTitle sx={{ p: 1, fontSize: '1rem' }}>
          Adicionar Novo Endereço
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <CreateAddressPage
            onClosedModal={handleCloseModal}
            selectedAddressId={addAddress}
            onRefresh={refreshAddresses}
            setAddress={(address) => {
              // Exemplo: Se quiser adicionar na lista local
              const formatted = createLabelAddress(address);
              setSelectedAddresses([formatted]);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
