'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import phoneNumberService from '@/services/phoneNumberService';
import { debounce } from 'lodash';
import { IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreatePhonePage from '@/app/components/apps/phone/Add-phone';

export default function AutoCompletePhoneNumber({
  onChange,
  value,
  error,
  helperText,
  disableSuggestions=true,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchDefaultPhone = async (phoneId) => {
    if (phoneId) {
      try {
        const phone = await phoneNumberService.getPhoneNumberById(phoneId);
        if (phone) {
          setSelectedPhone({
            id: phone.id,
            label: `+${phone.country_code} (${phone.area_code}) ${phone.phone_number}`,
          });
          if (!value) onChange(phone.id);
        }
      } catch (error) {
        console.error('Erro ao buscar telefone:', error);
      }
    }
  };

  useEffect(() => {
    fetchDefaultPhone(value);
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedPhone(newValue);
    onChange(newValue ? newValue.id : null);
  };

  const fetchPhonesByQuery = useCallback(
    debounce(async (query) => {
      if (disableSuggestions || !query || query.trim() === '') {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await phoneNumberService.getPhoneNumbersByQuery(query);
        const formattedPhones = response.results.map((phone) => ({
          id: phone.id,
          label: `+${phone.country_code} (${phone.area_code}) ${phone.phone_number}`,
        }));
        setOptions(formattedPhones);
      } catch (error) {
        console.error('Erro ao buscar telefones:', error);
      }
      setLoading(false);
    }, 300),
    [disableSuggestions]
  );

  const fetchInitialPhones = useCallback(async () => {
    if (disableSuggestions) {
      setOptions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await phoneNumberService.getPhoneNumbers({ limit: 5 });
      const formattedPhones = response.results.map((phone) => ({
        id: phone.id,
        label: `+${phone.country_code} (${phone.area_code}) ${phone.phone_number}`,
      }));
      setOptions(formattedPhones);
    } catch (error) {
      console.error('Erro ao buscar telefones:', error);
    }
    setLoading(false);
  }, [disableSuggestions]);

  const handleOpen = () => {
    setOpen(true);
    if (!disableSuggestions && options.length === 0) {
      fetchInitialPhones();
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
        isOptionEqualToValue={(option, value) => option.label === value.label}
        getOptionLabel={(option) => option.label || ''}
        options={options}
        loading={loading}
        value={selectedPhone}
        {...props}
        onInputChange={(event, newInputValue) => {
          if (!disableSuggestions) {
            fetchPhonesByQuery(newInputValue);
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
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                  <IconButton
                    onClick={handleOpenModal}
                    aria-label="Adicionar telefone"
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
        <DialogTitle>Adicionar Novo Número de Telefone</DialogTitle>
        <DialogContent>
          <CreatePhonePage onClosedModal={handleCloseModal} selectedPhoneNumberId={fetchDefaultPhone} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
