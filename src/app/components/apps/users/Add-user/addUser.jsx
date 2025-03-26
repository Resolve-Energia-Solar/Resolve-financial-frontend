'use client';
import React, { useEffect, useState } from 'react';
import useUserForm from '@/hooks/users/useUserForm';
import { Grid, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import userService from '@/services/userService';
import CreateAddressPage from '../../address/Add-address';
import GenericAutocomplete from '@/app/components/auto-completes/GenericAutoComplete';
import { useParams } from 'next/navigation';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import AutoCompletePhoneNumber from '../../comercial/sale/components/auto-complete/AutoCompletePhoneNumber';
import InputCpfCnpj from '@/app/components/shared/InputCpfCnpj';
import addressService from '@/services/addressService';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import SelectForm from '@/app/components/ui-components/select/GenericSelect';

export default function AddUser({
  label,
  hideSaveButton = false,
  triggerSave = false,
  onUserSaved,
}) {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [fieldsEnabled, setFieldsEnabled] = useState(false);

  // Estados para mensagens de busca
  const [searchingUser, setSearchingUser] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [userFound, setUserFound] = useState(false);

  const resetUserFields = () => {
    handleChange('complete_name', '');
    handleChange('first_name', '');
    handleChange('email', '');
    handleChange('addresses_ids', []);
    handleChange('phone_numbers_ids', []);
    handleChange('gender', '');
    handleChange('birth_date', null);
    setSelectedAddresses([]);
    setInitialData(null);
  };

  useEffect(() => {
    if (id) {
      setLoadingInitialData(true);
      userService
        .getUserById(id, {
          expand: 'addresses',
          fields: 'id,username,first_name,email,first_document,complete_name',
        })
        .then((data) => {
          setInitialData(data);
          setLoadingInitialData(false);
          setFieldsEnabled(true);
        })
        .catch((err) => {
          console.error('Erro ao buscar dados do usuário:', err);
          setLoadingInitialData(false);
        });
    }
  }, [id]);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    dataReceived,
    loading: formLoading,
  } = useUserForm(initialData, id);

  useEffect(() => {
    if (triggerSave) {
      (async () => {
        const saveResult = await handleSave();
        if (saveResult && onUserSaved) {
          onUserSaved(saveResult);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSave]);

  const fetchAddress = async (search) => {
    try {
      const response = await addressService.index({
        q: search,
        limit: 40,
        fields: 'id,street,number,city,state',
      });
      return response.results;
    } catch (error) {
      console.error('Erro na busca de endereços:', error);
      return [];
    }
  };

  const gender_options = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'O', label: 'Outro' },
  ];

  const handleCpfBlur = async () => {
    if (id) return;
    const maskedCpf = formData.first_document?.trim();
    const cpfValue = maskedCpf.replace(/\D/g, '');

    if (!cpfValue) return;

    try {
      setSearchingUser(true);
      setUserNotFound(false);
      setUserFound(false);

      const data = await userService.getUser({
        filters: {
          first_document__icontains: cpfValue,
          fields:
            'id,username,first_name,email,first_document,complete_name,addresses,gender,phone_numbers,birth_date,date_joined,is_active,is_staff,is_superuser,person_type',
          expand: 'addresses,phone_numbers',
        },
      });
      const user = data.results[0];
      if (user) {
        const phoneNumbersIds = user.phone_numbers.map((phone) => phone.id);
        handleChange('complete_name', user.complete_name || '');
        handleChange('first_name', user.first_name || '');
        handleChange('email', user.email || '');
        handleChange('addresses_ids', user.addresses || []);
        handleChange('phone_numbers_ids', phoneNumbersIds);
        handleChange('gender', user.gender || '');
        handleChange('birth_date', user.birth_date || null);
        setSelectedAddresses(user.addresses || []);
        setInitialData(user);
        setUserFound(true);
        setUserNotFound(false);
      } else {
        setUserNotFound(true);
        setUserFound(false);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário pelo CPF:', error);
    } finally {
      setSearchingUser(false);
      setFieldsEnabled(true);
    }
  };

  // Reseta os campos ao alterar o CPF
  const handleCpfChange = (e) => {
    handleChange('first_document', e.target.value);
    resetUserFields();
    setUserFound(false);
    setUserNotFound(false);
  };

  if (id && loadingInitialData) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={4} sx={{ p: 4 }}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {label ? label : id ? 'Editar Usuário' : 'Adicionar Usuário'}
        </Typography>
      </Grid>

      {/* Alertas para CPF */}
      {!fieldsEnabled && !searchingUser && (
        <Grid item xs={12}>
          <Alert severity="info" variant="filled">
            Por favor, insira o CPF para buscar ou criar o usuário.
          </Alert>
        </Grid>
      )}

      {searchingUser && (
        <Grid item xs={12}>
          <Alert severity="info" icon={false} variant="filled">
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <CircularProgress size={20} color="inherit" />
              </Grid>
              <Grid item>Buscando usuário...</Grid>
            </Grid>
          </Alert>
        </Grid>
      )}

      {userFound && !searchingUser && (
        <Grid item xs={12}>
          <Alert severity="success" variant="filled">
            Usuário encontrado. Os dados foram preenchidos.
          </Alert>
        </Grid>
      )}

      {userNotFound && !searchingUser && (
        <Grid item xs={12}>
          <Alert severity="warning" variant="filled">
            Nenhum usuário encontrado com esse CPF. Preencha os campos para criar um novo usuário.
          </Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSave();
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <InputCpfCnpj
                value={formData.first_document}
                onChange={handleCpfChange}
                onBlur={handleCpfBlur}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField
                label="Nome Completo"
                placeholder="Nome completo"
                name="complete_name"
                value={formData.complete_name}
                onChange={(e) => handleChange('complete_name', e.target.value)}
                fullWidth
                margin="normal"
                error={Boolean(formErrors.complete_name)}
                helperText={formErrors.complete_name}
                disabled={!fieldsEnabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextField
                label="Email"
                placeholder="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                fullWidth
                margin="normal"
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                disabled={!fieldsEnabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <SelectForm
                placeholder="Gênero"
                options={gender_options}
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                {...(formErrors.gender && {
                  error: true,
                  helperText: formErrors.gender,
                })}
                disabled={!fieldsEnabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <AutoCompletePhoneNumber
                placeholder="Número"
                onChange={(id) => handleChange('phone_numbers_ids', [id])}
                value={formData.phone_numbers_ids ? formData.phone_numbers_ids[0] : null}
                {...(formErrors.phone_numbers_ids && {
                  error: true,
                  helperText: formErrors.phone_numbers_ids,
                })}
                disabled={!fieldsEnabled}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <FormDate
                placeholder="Data de Nascimento"
                name="birth_date"
                value={formData.birth_date}
                onChange={(newValue) => handleChange('birth_date', newValue)}
                {...(formErrors.birth_date && {
                  error: true,
                  helperText: formErrors.birth_date,
                })}
                disabled={!fieldsEnabled}
              />
            </Grid>

            <Grid item xs={12}>
              <GenericAutocomplete
                addTitle="Adicionar Endereço"
                label="Endereço"
                fetchOptions={fetchAddress}
                multiple
                AddComponent={CreateAddressPage}
                getOptionLabel={(option) =>
                  `${option.street}, ${option.number} - ${option.city}, ${option.state}`
                }
                onChange={(selected) => {
                  setSelectedAddresses(selected);
                  const ids = Array.isArray(selected) ? selected.map((item) => item.id) : [];
                  handleChange('addresses_ids', ids);
                }}
                value={selectedAddresses}
                disabled={!fieldsEnabled}
                {...(formErrors.addresses_ids && {
                  error: true,
                  helperText: formErrors.addresses_ids,
                })}
              />
            </Grid>

            {!hideSaveButton && (
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={formLoading || !fieldsEnabled}
                >
                  {formLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
