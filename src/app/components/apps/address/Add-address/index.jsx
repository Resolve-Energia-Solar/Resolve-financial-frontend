'use client';
import { Grid, Button, Stack, Alert, CircularProgress, Box } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { useSelector } from 'react-redux';
import useAddressForm from '@/hooks/address/useAddressForm';
import { useEffect, useState } from 'react';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import userService from '@/services/userService';

const CreateAddressPage = ({ selectedAddressId = null, onClosedModal = null, userId = null, onRefresh = null }) => {
  const userPermissions = useSelector((state) => state.user.permissions);
  const [fileLoading, setFileLoading] = useState(false);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
    dataReceived,
  } = useAddressForm();

  formData.user_id = userId;

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      }
      if (selectedAddressId) {
        selectedAddressId(dataReceived.id);
      }
    }
  }, [success]);

  const stateOptions = [
    { value: 'AC', label: 'AC' },
    { value: 'AL', label: 'AL' },
    { value: 'AP', label: 'AP' },
    { value: 'AM', label: 'AM' },
    { value: 'BA', label: 'BA' },
    { value: 'CE', label: 'CE' },
    { value: 'DF', label: 'DF' },
    { value: 'ES', label: 'ES' },
    { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' },
    { value: 'MT', label: 'MT' },
    { value: 'MS', label: 'MS' },
    { value: 'MG', label: 'MG' },
    { value: 'PA', label: 'PA' },
    { value: 'PB', label: 'PB' },
    { value: 'PR', label: 'PR' },
    { value: 'PE', label: 'PE' },
    { value: 'PI', label: 'PI' },
    { value: 'RJ', label: 'RJ' },
    { value: 'RN', label: 'RN' },
    { value: 'RS', label: 'RS' },
    { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' },
    { value: 'SC', label: 'SC' },
    { value: 'SP', label: 'SP' },
    { value: 'SE', label: 'SE' },
    { value: 'TO', label: 'TO' },
  ];

  const fetchAddressByCep = async (cep) => {
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      if (!response.ok) throw new Error('CEP não encontrado');
      const data = await response.json();
      handleChange('state', data.state);
      handleChange('city', data.city);
      handleChange('neighborhood', data.neighborhood);
      handleChange('street', data.street);
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  };

  const handleCepBlur = (e) => {
    const cep = e.target.value;
    if (cep.length === 8) {
      fetchAddressByCep(cep);
    }
  };

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Endereço criado com sucesso!
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="zip_code">CEP</CustomFormLabel>
          <CustomTextField
            fullWidth
            variant="outlined"
            value={formData.zip_code}
            onChange={(e) => handleChange('zip_code', e.target.value)}
            onBlur={handleCepBlur}
            error={!!formErrors.zip_code}
            helperText={formErrors.zip_code}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="country">País</CustomFormLabel>
          <CustomTextField
            fullWidth
            variant="outlined"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            error={!!formErrors.country}
            helperText={formErrors.country}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Estado"
            name="state"
            options={stateOptions}
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            error={!!formErrors.state}
            helperText={formErrors.state}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="city">Cidade</CustomFormLabel>
          <CustomTextField
            fullWidth
            variant="outlined"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            error={!!formErrors.city}
            helperText={formErrors.city}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="neighborhood">Bairro</CustomFormLabel>
          <CustomTextField
            fullWidth
            variant="outlined"
            value={formData.neighborhood}
            onChange={(e) => handleChange('neighborhood', e.target.value)}
            error={!!formErrors.neighborhood}
            helperText={formErrors.neighborhood}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="street">Rua</CustomFormLabel>
          <CustomTextField
            fullWidth
            variant="outlined"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            error={!!formErrors.street}
            helperText={formErrors.street}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="number">Número</CustomFormLabel>
          <CustomTextField
            fullWidth
            variant="outlined"
            value={formData.number}
            onChange={(e) => handleChange('number', e.target.value)}
            error={!!formErrors.number}
            helperText={formErrors.number}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="complement">Complemento</CustomFormLabel>
          <CustomTextField
            fullWidth
            variant="outlined"
            value={formData.complement}
            onChange={(e) => handleChange('complement', e.target.value)}
            error={!!formErrors.complement}
            helperText={formErrors.complement}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        {onClosedModal && (
          <Button variant="contained" color="primary" onClick={onClosedModal}>
            Fechar
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={formLoading}
          endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {formLoading ? 'Salvando...' : 'Criar'}
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateAddressPage;

