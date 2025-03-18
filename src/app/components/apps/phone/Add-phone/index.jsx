'use client';

import {
  Grid,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Box,
  FormControlLabel,
  Snackbar,
} from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { useSelector } from 'react-redux';
import usePhoneNumbers from '@/hooks/phone_numbers/usePhoneNumbers';
import usePhoneNumberForm from '@/hooks/phone_numbers/usePhoneNumbersForm';
import { useEffect, useState } from 'react';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { CheckCircle, Error } from '@mui/icons-material';

const CreatePhonePage = ({
  userId = null,
  onClosedModal = null,
  onRefresh = null,
  selectedPhoneNumberId = null,
}) => {
  const userPermissions = useSelector((state) => state.user.permissions);

  const formatFieldName = (fieldName) => {
    const fieldLabels = {
      area_code: 'Código de Área',
      phone_number: 'Telefone',
    };

    return fieldLabels[fieldName] || fieldName;
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const {
    formData,
    dataReceived,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = usePhoneNumberForm();

  formData.user_id = userId;

  formData.country_code = 55;

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        if (onRefresh) {
          onRefresh();
        }
      }

      if (selectedPhoneNumberId) {
        selectedPhoneNumberId(dataReceived?.id);
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
          onClick={async () => {
            await handleSave();
            setSnackbarOpen(true);
          }}
          disabled={formLoading}
          endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {formLoading ? 'Salvando...' : 'Criar'}
        </Button>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={formErrors && Object.keys(formErrors).length > 0 ? 'error' : 'success'}
          sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
          iconMapping={{
            error: <Error style={{ verticalAlign: 'middle' }} />,
            success: <CheckCircle style={{ verticalAlign: 'middle' }} />,
          }}
        >
          {formErrors && Object.keys(formErrors).length > 0 ? (
            <ul
              style={{
                margin: '10px 0',
                paddingLeft: '20px',
                listStyleType: 'disc',
              }}
            >
              {Object.entries(formErrors).map(([field, messages]) => (
                <li
                  key={field}
                  style={{
                    marginBottom: '8px',
                  }}
                >
                  {`${formatFieldName(field)}: ${messages.join(', ')}`}
                </li>
              ))}
            </ul>
          ) : (
            'Adicionado com sucesso!'
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatePhonePage;
