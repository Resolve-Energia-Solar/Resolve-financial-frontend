'use client';
import { Grid, Button, Stack, FormControlLabel, CircularProgress } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import GenericAutocomplete from '@/app/components/auto-completes/GenericAutoComplete';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useUserForm from '@/hooks/users/useUserForm';
import AutoCompletePhoneNumber from '../../comercial/sale/components/auto-complete/AutoCompletePhoneNumber';
import { IconDeviceFloppy } from '@tabler/icons-react';
import addressService from '@/services/addressService';
import CreateAddressPage from '../../address/Add-address';

export default function CreateCustomer({ onClosedModal = null, selectedUserId = null }) {
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    dataReceived,
    loading: formLoading,
  } = useUserForm();

  formData.is_active = true;

  const router = useRouter();

  const gender_options = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'O', label: 'Outro' },
  ];

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        selectedUserId(dataReceived.id);
      } else {
        router.push(`/apps/users/${dataReceived.id}/update`);
      }
    }
  }, [success]);

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

  const [selectedAddresses, setSelectedAddresses] = useState([]);

  return (
    <Grid container spacing={3}>
      {/* Campo de Email */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
        <CustomTextField
          name="email"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          {...(formErrors.email && { error: true, helperText: formErrors.email })}
        />
      </Grid>

      {/* Campo de Nome Completo */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="complete_name">Nome Completo</CustomFormLabel>
        <CustomTextField
          name="complete_name"
          variant="outlined"
          fullWidth
          value={formData.complete_name}
          onChange={(e) => handleChange('complete_name', e.target.value.toUpperCase())}
          {...(formErrors.complete_name && { error: true, helperText: formErrors.complete_name })}
        />
      </Grid>

      {/* Campo de CPF */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="first_document">CPF</CustomFormLabel>
        <CustomTextField
          name="first_document"
          variant="outlined"
          fullWidth
          value={formData.first_document}
          onChange={(e) => handleChange('first_document', e.target.value)}
          {...(formErrors.first_document && { error: true, helperText: formErrors.first_document })}
        />
      </Grid>

      {/* Campo de Gênero */}
      <Grid item xs={12} sm={12} lg={4}>
        <FormSelect
          label="Gênero"
          options={gender_options}
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          {...(formErrors.gender && { error: true, helperText: formErrors.gender })}
        />
      </Grid>

      {/* Campo de Data de Nascimento */}
      <Grid item xs={12} sm={12} lg={4}>
        <FormDate
          label="Data de Nascimento"
          name="birth_date"
          value={formData.birth_date}
          onChange={(newValue) => handleChange('birth_date', newValue)}
          {...(formErrors.birth_date && { error: true, helperText: formErrors.birth_date })}
        />
      </Grid>

      {/* Campo de Número de Telefone */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="phone_numbers">Número</CustomFormLabel>
        <AutoCompletePhoneNumber
          onChange={(id) => handleChange('phone_numbers_ids', id)}
          value={formData.phone_numbers_ids ? formData.phone_numbers_ids[0] : null}
          {...(formErrors.phone_numbers_ids && {
            error: true,
            helperText: formErrors.phone_numbers_ids,
          })}
        />
      </Grid>

      {/* Campo de Endereço com seleção múltipla */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
        <GenericAutocomplete
          label="Endereço"
          fetchOptions={fetchAddress}
          multiple
          AddComponent={CreateAddressPage}
          getOptionLabel={(option) =>
            `${option.street}, ${option.number} - ${option.city}, ${option.state}`
          }
          onChange={(selected) => {
            setSelectedAddresses(selected);
            console.log(selected);
            const ids = Array.isArray(selected) ? selected.map((item) => item.id) : [];
            handleChange('addresses_ids', ids);
          }}
          value={selectedAddresses}
          {...(formErrors.addresses_ids && { error: true, helperText: formErrors.addresses_ids })}
        />
      </Grid>

      {/* Botão de Criar */}
      <Grid item xs={12} sm={12} lg={12}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={formLoading}
            startIcon={
              formLoading ? <CircularProgress size={20} color="inherit" /> : <IconDeviceFloppy />
            }
          >
            Criar
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
