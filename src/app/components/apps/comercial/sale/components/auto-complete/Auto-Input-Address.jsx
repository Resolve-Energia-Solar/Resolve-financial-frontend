'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import addressService from '@/services/addressService';
import { debounce } from 'lodash';
import { IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateAddressPage from '@/app/components/apps/address/Add-address';

export default function AutoCompleteAddress({ 
  onChange, 
  value, 
  error, 
  helperText, 
  disableSuggestions = false,
  ...props 
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchDefaultAddress = async (addressId) => {
    if (addressId) {
      try {
        console.log('addressId', addressId);
        const addressValue = await addressService.getAddressById(addressId);
        console.log('addressValue', addressValue);
        if (addressValue) {
          setSelectedAddress({
            id: addressValue.id,
            name: `${addressValue.street}, ${addressValue.number}, ${addressValue.city}, ${addressValue.state}`,
          });
          if (!value) onChange(addressValue.id);
        }
        console.log('selectedAddress', selectedAddress);
      } catch (error) {
        console.error('Erro ao buscar address:', error);
      }
    }
  };

  useEffect(() => {
    fetchDefaultAddress(value);
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedAddress(newValue);
    onChange(newValue ? newValue.id : null);
  };

  const fetchAddressesByName = useCallback(
    debounce(async (name) => {
      if (!name || disableSuggestions) return; // Verifica a prop para desabilitar as sugestões
      setLoading(true);
      try {
        const response = await addressService.getAddressByFullAddress(name);
        const formattedAddresses = response.results.map((address) => ({
          id: address.id,
          name: `${address.street}, ${address.number}, ${address.city}, ${address.state}`,
        }));
        setOptions(formattedAddresses);
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
      }
      setLoading(false);
    }, 300),
    [disableSuggestions], // Dependência da prop disableSuggestions
  );

  const fetchInitialAddresses = useCallback(async () => {
    if (disableSuggestions) return; // Não busca sugestões se a prop estiver ativada
    setLoading(true);
    try {
      const response = await addressService.getAddresses({ limit: 5 });
      const formattedAddresses = response.results.map((address) => ({
        id: address.id,
        name: `${address.street}, ${address.number}, ${address.city}, ${address.state}`,
      }));
      setOptions(formattedAddresses);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
    }
    setLoading(false);
  }, [disableSuggestions]);

  const handleOpen = () => {
    console.log('open');
    setOpen(true);
    if (options.length === 0 && !disableSuggestions) {
      fetchInitialAddresses();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
        loading={loading}
        value={selectedAddress}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."  
        {...props}
        onInputChange={(event, newInputValue) => {
          if (!disableSuggestions) fetchAddressesByName(newInputValue); // Chama a função de busca apenas se sugestões não estiverem desativadas
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
                  <IconButton
                    onClick={handleOpenModal}
                    aria-label="Adicionar endereço"
                    edge="end"
                    size="small"
                    sx={{ padding: '4px' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Fragment>
              ),
            }}
          />
        )}
      />

      {/* Modal para adicionar endereço */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg">
        <DialogTitle>Adicionar Novo Endereço</DialogTitle>
        <DialogContent>
          <CreateAddressPage
            onClosedModal={handleCloseModal}
            selectedAddressId={fetchDefaultAddress}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
