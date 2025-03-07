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

export default function AutoCompleteAddresses({
  onChange,
  value = [],
  error,
  helperText,
  labeltitle,
  disabled,
  disableSuggestions = false, 
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [valuesDefault, setValuesDefault] = useState(value);

  useEffect(() => {
    setValuesDefault(value);
  }, [value]);

  useEffect(() => {
    const fetchDefaultAddresses = async () => {
      if (valuesDefault.length > 0) {
        try {
          const addresses = await Promise.all(
            valuesDefault.map((id) => addressService.getAddressById(id)),
          );
          const formattedAddresses = addresses.map((address) => ({
            id: address.id,
            name: `${address.street}, ${address.number}, ${address.city}, ${address.state}`,
          }));
          setSelectedAddresses(formattedAddresses);
        } catch (error) {
          console.error('Erro ao buscar endereços:', error);
        }
      }
    };

    fetchDefaultAddresses();
  }, [valuesDefault, refresh]);

  const addAddress = (address) => {
    setValuesDefault([...valuesDefault, address]);
    onChange([...valuesDefault, address]);
  };

  const refreshAddresses = () => {
    setRefresh(!refresh);
  };

  const handleChange = (event, newValue) => {
    setSelectedAddresses(newValue);
    onChange(newValue.map((address) => address.id));
  };

  const fetchAddressesByName = useCallback(
    debounce(async (name) => {
      if (disableSuggestions || !name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const addresses = await addressService.getAddressByFullAddress(name);
        if (addresses && addresses.results) {
          const formattedAddresses = addresses.results.map((address) => ({
            id: address.id,
            name: `${address.street}, ${address.number}, ${address.city}, ${address.state}`,
          }));
          setOptions(formattedAddresses);
        }
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
      }
      setLoading(false);
    }, 300),
    [disableSuggestions]
  );

  const fetchInitialAddresses = useCallback(async () => {
    if (disableSuggestions) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const addresses = await addressService.getAddresses({ limit: 5 });
      const formattedAddresses = addresses.results.map((address) => ({
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
    setOpen(true);
    if (options.length === 0 && !disableSuggestions) {
      fetchInitialAddresses();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div>
      <Autocomplete
        multiple
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedAddresses}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."  
        onInputChange={(event, newInputValue) => {
          if (!disableSuggestions) {
            fetchAddressesByName(newInputValue);
          }
        }}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            error={error}
            helperText={helperText}
            {...params}
            label={labeltitle}
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
            selectedAddressId={addAddress}
            onRefresh={refreshAddresses}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
