'use client';

import { Grid, Button, Stack, Alert, CircularProgress, Box, FormControlLabel } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { useSelector } from 'react-redux';
import usePhoneNumbers from '@/hooks/phone_numbers/usePhoneNumbers';
import usePhoneNumberForm from '@/hooks/phone_numbers/usePhoneNumbersForm';
import { useEffect } from 'react';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';

const CreatePhonePage = ({ userId = null, onClosedModal = null, onRefresh = null }) => {
  const userPermissions = useSelector((state) => state.user.permissions);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = usePhoneNumberForm();

  formData.user_id = userId;

  formData.country_code = 55;

  console.log('formData', formData);

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      }
    }
  }, [success]);

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Telefone editado com sucesso!
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="area_code">Código de Área</CustomFormLabel>
          <CustomTextField
            fullWidth
            variant="outlined"
            value={formData.area_code}
            onChange={(e) => handleChange('area_code', e.target.value)}
            error={!!formErrors.area_code}
            helperText={formErrors.area_code}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={8}>
          <CustomFormLabel htmlFor="phone_number">Número</CustomFormLabel>
          <CustomTextField
            fullWidth
            variant="outlined"
            value={formData.phone_number}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            error={!!formErrors.phone_number}
            helperText={formErrors.phone_number}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <CustomFormLabel>Principal</CustomFormLabel>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={formData.is_main}
                onChange={(e) => handleChange('is_main', e.target.checked)}
              />
            }
            label={formData.is_main ? 'Sim' : 'Não'}
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

export default CreatePhonePage;
