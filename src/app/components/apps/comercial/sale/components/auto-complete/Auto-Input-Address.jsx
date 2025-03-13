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
  options = [],
  ...props
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [internalOptions, setInternalOptions] = useState([]);
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
        setInternalOptions(formattedAddresses);
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
      setInternalOptions(formattedAddresses);
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      enqueueSnackbar(`Erro ao buscar endereços: ${error.message}`, { variant: 'error' });
    }
    setLoading(false);
  }, [disableSuggestions, enqueueSnackbar]);

  const handleClose = () => {
    setOpen(false);
    setInternalOptions([]);
  };

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
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name || ''}
        options={displayOptions}  // Usa as opções combinadas
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

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth={false} // remove limite de largura
        sx={{
          '& .MuiDialog-paper': {
            width: '80%',      // ou o valor que desejar
            maxWidth: '1000px' // se quiser um limite
          }
        }}
      >
        <DialogTitle>Adicionar Novo Endereço</DialogTitle>
        <DialogContent>
          <CreateAddressPage
              onClosedModal={handleCloseModal}
              selectedAddressId={addAddress}
              onRefresh={refreshAddresses}
              setAddress={(address) => {
                setSelectedAddresses([createLabelAddress(address)]);
              }}
            />
        </DialogContent>
      </Dialog>

    </div>
  );
}