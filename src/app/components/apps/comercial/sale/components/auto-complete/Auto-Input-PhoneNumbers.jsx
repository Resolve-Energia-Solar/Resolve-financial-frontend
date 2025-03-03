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

export default function AutoCompletePhoneNumbers({
  onChange,
  value = [],
  error,
  helperText,
  labeltitle,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [valuesDefault, setValuesDefault] = useState(value);

  useEffect(() => {
    setValuesDefault(value);
  }, [value]);

  useEffect(() => {
    const fetchDefaultPhoneNumbers = async () => {
      if (valuesDefault.length > 0) {
        try {
          const phoneNumbers = await Promise.all(
            valuesDefault.map((id) => phoneNumberService.getPhoneNumberById(id))
          );
          const formattedPhoneNumbers = phoneNumbers.map((phoneNumber) => ({
            id: phoneNumber.id,
            name: phoneNumber.phone_number,
          }));
          setSelectedPhoneNumbers(formattedPhoneNumbers);
        } catch (error) {
          console.error('Erro ao buscar números de telefone:', error);
        }
      }
    };

    fetchDefaultPhoneNumbers();
  }, [valuesDefault]);

  const addPhoneNumber = (phoneNumber) => {
    const newValues = [...valuesDefault, phoneNumber];
    setValuesDefault(newValues);
    onChange(newValues);
  };

  const refreshPhoneNumbers = () => {
    setRefresh(!refresh);
  };

  const handleChange = (event, newValue) => {
    setSelectedPhoneNumbers(newValue);
    onChange(newValue.map((phoneNumber) => phoneNumber.id));
  };

  const fetchPhoneNumbersByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const phoneNumbers = await phoneNumberService.getPhoneNumbersByQuery(name);
        if (phoneNumbers && phoneNumbers.results) {
          const formattedPhoneNumbers = phoneNumbers.results.map((phoneNumber) => ({
            id: phoneNumber.id,
            name: phoneNumber.phone_number,
          }));
          setOptions(formattedPhoneNumbers);
        }
      } catch (error) {
        console.error('Erro ao buscar números de telefone:', error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const fetchInitialPhoneNumbers = useCallback(async () => {
    setLoading(true);
    try {
      const phoneNumbers = await phoneNumberService.getPhoneNumbers({ limit: 5 });
      const formattedPhoneNumbers = phoneNumbers.results.map((phoneNumber) => ({
        id: phoneNumber.id,
        name: phoneNumber.phone_number,
      }));
      setOptions(formattedPhoneNumbers);
    } catch (error) {
      console.error('Erro ao buscar números de telefone:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialPhoneNumbers();
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
        multiple
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedPhoneNumbers}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."  
        onInputChange={(event, newInputValue) => {
          fetchPhoneNumbersByName(newInputValue);
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
                    aria-label="Adicionar número de telefone"
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
          <CreatePhonePage
            onClosedModal={handleCloseModal}
            selectedPhoneNumberId={addPhoneNumber}
            onRefresh={refreshPhoneNumbers}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
