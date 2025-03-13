'use client';
import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Paper,
  Tooltip,
  IconButton,
} from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { useSnackbar } from 'notistack';
import AddressAutocomplete from '@/app/components/auto-completes/AddressSearch';
import useAddressForm from '@/hooks/address/useAddressForm';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const CreateAddressPage = ({
  onClosedModal = null,
  userId = null,
  onRefresh = null,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = useAddressForm();

  // Define o user_id no formulário
  formData.user_id = userId;

  useEffect(() => {
    if (success) {
      enqueueSnackbar('Endereço salvo com sucesso!', { variant: 'success' });
      if (onClosedModal) onClosedModal();
      if (onRefresh) onRefresh();
    } else if (formErrors && Object.keys(formErrors).length > 0) {
      const errorMessage = Object.values(formErrors).join(', ');
      enqueueSnackbar(`Erro ao salvar endereço: ${errorMessage}`, { variant: 'error' });
    }
  }, [success]);

  // Mapeamento para converter o nome completo do estado em sigla
  const stateMapping = {
    "Acre": "AC",
    "Alagoas": "AL",
    "Amapá": "AP",
    "Amazonas": "AM",
    "Bahia": "BA",
    "Ceará": "CE",
    "Distrito Federal": "DF",
    "Espírito Santo": "ES",
    "Goiás": "GO",
    "Maranhão": "MA",
    "Mato Grosso": "MT",
    "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG",
    "Pará": "PA",
    "Paraíba": "PB",
    "Paraná": "PR",
    "Pernambuco": "PE",
    "Piauí": "PI",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS",
    "Rondônia": "RO",
    "Roraima": "RR",
    "Santa Catarina": "SC",
    "São Paulo": "SP",
    "Sergipe": "SE",
    "Tocantins": "TO",
  };

  // Callback que atualiza o formulário com os dados selecionados via autocomplete
  const handleAddressSelect = (addressData) => {
    const formatedZipCode = addressData.zip_code.replace('-', '');
    handleChange('zip_code', formatedZipCode);
    handleChange('country', addressData.country);
    handleChange('state', stateMapping[addressData.state] || addressData.state);
    handleChange('city', addressData.city);
    handleChange('neighborhood', addressData.neighborhood);
    handleChange('street', addressData.street);
    handleChange('number', addressData.number);
    handleChange('latitude', addressData.latitude);
    handleChange('longitude', addressData.longitude);
  };

  const handleSubmit = () => {
    handleSave();
  };

  return (
    <Box
      sx={{
        width: '90vw',
        maxWidth: 1000,
        height: '50vh',
        mx: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          p: { xs: 3, md: 4 },
          backgroundColor: 'background.paper',
          borderRadius: 1,
        }}
      >
        {Object.keys(formErrors).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {Object.keys(formErrors).map((field) => (
              <div key={field}>
                <strong>{field}:</strong> {formErrors[field]}
              </div>
            ))}
          </Alert>
        )}

        <Stack spacing={3} sx={{ width: '100%' }}>
          {/* Campo de pesquisa de endereço com tooltip no ícone */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <AddressAutocomplete
                apiKey={API_KEY}
                onAddressSelect={handleAddressSelect}
              />
            </Box>
            <Tooltip title="Digite seu endereço com NÚMERO da casa e selecione uma das opções sugeridas." placement="top">
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Campo para complemento com tooltip no ícone */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <CustomTextField
                fullWidth
                label="Complemento"
                variant="outlined"
                value={formData.complement}
                onChange={(e) => handleChange('complement', e.target.value)}
                error={!!formErrors.complement}
                helperText={formErrors.complement}
              />
            </Box>
            <Tooltip title="Informe informações adicionais, ex: apto, bloco, complemento." placement="top">
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Botão para salvar */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={formLoading}
            endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ alignSelf: 'flex-end' }}
          >
            {formLoading ? 'Salvando...' : 'Criar Endereço'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CreateAddressPage;
