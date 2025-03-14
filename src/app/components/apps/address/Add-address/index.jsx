'use client';
import React, { useEffect, useState, useCallback } from 'react';
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
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const CreateAddressPage = ({
  onClose,
  userId = null,
  onRefresh = null,
  setAddress,
  onAdd,
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
    dataReceived,
  } = useAddressForm();

  // Define o user_id no formulário
  formData.user_id = userId;

  const [addressInput, setAddressInput] = useState('');
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  useEffect(() => {
    if (success && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      enqueueSnackbar('Endereço salvo com sucesso!', { variant: 'success' });
      console.log('formData criado:', formData);
      if (onAdd && formData.id) {
        onAdd(formData);
      } else if (onAdd) {
        console.warn('O endereço foi salvo, mas o ID não foi retornado.');
      }
      if (onClose) onClose();
      if (onRefresh) onRefresh();
    } else if (formErrors && Object.keys(formErrors).length > 0) {
      const errorMessage = Object.values(formErrors).join(', ');
      enqueueSnackbar(`Erro ao salvar endereço: ${errorMessage}`, { variant: 'error' });
    }
  }, [success, hasHandledSuccess, formData, formErrors, onAdd, onClose, onRefresh, enqueueSnackbar]);

  // Mapeamento para converter o nome completo do estado em sigla
  const stateMapping = {
    Acre: 'AC',
    Alagoas: 'AL',
    Amapá: 'AP',
    Amazonas: 'AM',
    Bahia: 'BA',
    Ceará: 'CE',
    'Distrito Federal': 'DF',
    'Espírito Santo': 'ES',
    Goiás: 'GO',
    Maranhão: 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    Pará: 'PA',
    Paraíba: 'PB',
    Paraná: 'PR',
    Pernambuco: 'PE',
    Piauí: 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    Rondônia: 'RO',
    Roraima: 'RR',
    'Santa Catarina': 'SC',
    'São Paulo': 'SP',
    Sergipe: 'SE',
    Tocantins: 'TO',
  };

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
    setAddressInput(addressData.address);
  };

  const handleSubmit = () => {
    console.log('Salvando endereço...');
    handleSave();
  };

  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries: ['places'],
    language: 'pt-BR',
    region: 'BR',
  });

  const defaultCenter = {
    lat: formData.latitude ? parseFloat(formData.latitude) : -1.455833,
    lng: formData.longitude ? parseFloat(formData.longitude) : -48.504444,
  };

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      handleChange('latitude', lat);
      handleChange('longitude', lng);

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const placeResult = results[0];

          const extractFromComponents = (components, type) => {
            const comp = components.find((c) => c.types.includes(type));
            return comp ? comp.long_name : '';
          };

          function extractCity(components) {
            let cityComp = components.find((c) => c.types.includes('locality'));
            if (!cityComp) {
              cityComp = components.find((c) => c.types.includes('administrative_area_level_2'));
            }
            return cityComp ? cityComp.long_name : '';
          }

          const detailedAddress = {
            address: placeResult.formatted_address,
            zip_code: extractFromComponents(placeResult.address_components, 'postal_code').replace('-', ''),
            country: extractFromComponents(placeResult.address_components, 'country'),
            state: extractFromComponents(placeResult.address_components, 'administrative_area_level_1'),
            city: extractCity(placeResult.address_components),
            neighborhood: extractFromComponents(placeResult.address_components, 'sublocality_level_1'),
            street: extractFromComponents(placeResult.address_components, 'route'),
            number: extractFromComponents(placeResult.address_components, 'street_number'),
            complement: '',
            latitude: lat,
            longitude: lng,
          };

          handleAddressSelect(detailedAddress);
        } else {
          console.error("Erro na geocodificação reversa:", status);
        }
      });
    },
    [handleAddressSelect, handleChange]
  );

  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      setMarkerPosition({
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude),
      });
    }
  }, [formData.latitude, formData.longitude]);

  return (
    <Box
      sx={{
        width: '100vw',
        maxWidth: '80vw',
        mx: 'auto',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          p: { xs: 0, md: 0 },
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
          {/* Campo de pesquisa de endereço */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <AddressAutocomplete
                apiKey={API_KEY}
                onAddressSelect={handleAddressSelect}
                inputValue={addressInput}
                onInputChange={setAddressInput}
              />
            </Box>
            <Tooltip title="Digite seu endereço com NÚMERO e selecione uma opção." placement="top">
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Campo para complemento */}
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

          {/* Mapa para marcar o endereço */}
          <Box sx={{ width: '100%', height: '300px', mt: 2 }}>
            {mapLoadError && <div>Erro ao carregar o mapa</div>}
            {!isMapLoaded ? (
              <CircularProgress />
            ) : (
              <GoogleMap
                center={markerPosition}
                zoom={14}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onClick={handleMapClick}
              >
                <Marker position={markerPosition} draggable onDragEnd={handleMapClick} />
              </GoogleMap>
            )}
          </Box>

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
