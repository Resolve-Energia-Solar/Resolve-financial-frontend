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
import { useSnackbar } from 'notistack';

export default function AutoCompleteAddress({
  onChange,
  value,
  error,
  helperText,
  disableSuggestions = false,
  ...props
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchDefaultAddress = async (addressId) => {
    if (addressId) {
      try {
        const addressValue = await addressService.getAddressById(addressId);
        if (addressValue) {
          setSelectedAddress({
            id: addressValue.id,
            name: `${addressValue.street}, ${addressValue.number}, ${addressValue.city}, ${addressValue.state}`,
          });
          if (!value) onChange(addressValue.id);
        }
      } catch (error) {
        console.error('Erro ao buscar address:', error);
        enqueueSnackbar(`Erro ao buscar endereço: ${error.message}`, { variant: 'error' });
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
      if (!name || disableSuggestions) return;
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
        enqueueSnackbar(`Erro ao buscar endereços: ${error.message}`, { variant: 'error' });
      }
      setLoading(false);
    }, 300),
    [disableSuggestions, enqueueSnackbar]
  );

  const fetchInitialAddresses = useCallback(async () => {
    if (disableSuggestions) return;
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
      enqueueSnackbar(`Erro ao buscar endereços: ${error.message}`, { variant: 'error' });
    }
    setLoading(false);
  }, [disableSuggestions, enqueueSnackbar]);

  const handleOpen = () => {
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
