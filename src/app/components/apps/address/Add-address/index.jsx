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
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { useSnackbar } from 'notistack';
import AddressAutocomplete from '@/app/components/auto-completes/AddressSearch';
import useAddressForm from '@/hooks/address/useAddressForm';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const fieldLabels = {
  zip_code: "CEP",
  country: "País",
  state: "Estado",
  city: "Cidade",
  neighborhood: "Bairro",
  street: "Rua",
  number: "Número",
};

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
  } = useAddressForm();

  formData.user_id = userId;

  const [initialData, setInitialData] = useState({});
  const [addressInput, setAddressInput] = useState('');
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  const [openAccordion, setOpenAccordion] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const [lastError, setLastError] = useState('');

  const handleAddressSelect = (addressData) => {
    const formatedZipCode = addressData.zip_code.replace('-', '');
    handleChange('zip_code', formatedZipCode);
    handleChange('country', addressData.country);
    handleChange('state', stateMapping[addressData.state] || addressData.state);
    handleChange('city', addressData.city);
    handleChange('neighborhood', addressData.neighborhood);
    handleChange('street', addressData.street);
    handleChange('number', addressData.number);
  
    if (addressData.latitude && addressData.longitude) {
      handleChange('latitude', addressData.latitude);
      handleChange('longitude', addressData.longitude);
      setMarkerPosition({
        lat: parseFloat(addressData.latitude),
        lng: parseFloat(addressData.longitude),
      });
    }
    setInitialData(addressData);
  };

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

  useEffect(() => {
    const addressErrorFields = Object.keys(fieldLabels);
    const hasAddressErrors = Object.keys(formErrors).some((key) =>
      addressErrorFields.includes(key)
    );
    if (hasAddressErrors) {
      setOpenAccordion(true);
    }
    if (success && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      enqueueSnackbar('Endereço salvo com sucesso!', { variant: 'success' });
      if (onAdd && formData.id) {
        onAdd(formData);
      } else if (onAdd) {
        console.warn('O endereço foi salvo, mas o ID não foi retornado.');
      }
      if (onClose) onClose();
      if (onRefresh) onRefresh();
    } else if (formErrors && Object.keys(formErrors).length > 0) {
      const errorStr = JSON.stringify(formErrors);
      if (errorStr !== lastError) {
        setLastError(errorStr);
        const friendlyErrors = Object.entries(formErrors).map(
          ([field, messages]) => (
            <div key={field}>
              <strong>{fieldLabels[field] || field}:</strong> {messages.join(', ')}
            </div>
          )
        );
        enqueueSnackbar(<div>{friendlyErrors}</div>, { variant: 'error' });
      }
    }
  }, [success, hasHandledSuccess, formData, formErrors, onAdd, onClose, onRefresh, enqueueSnackbar, lastError]);

  const handleOpenConfirmModal = () => {
    setConfirmModalOpen(true);
    setConfirmChecked(false);
  };

  const submitAddress = () => {
    setConfirmModalOpen(false);
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
    if (
      formData.street &&
      formData.number &&
      formData.city &&
      formData.state &&
      formData.country &&
      window.google
    ) {
      const geocoder = new window.google.maps.Geocoder();
      const fullAddress = `${formData.street}, ${formData.number}, ${formData.city}, ${formData.state}, ${formData.country}`;
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          setMarkerPosition({ lat, lng });
          handleChange('latitude', lat);
          handleChange('longitude', lng);
        }
      });
    }
  }, [formData.number, formData.street, formData.city, formData.state, formData.country]);

  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      setMarkerPosition({
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude),
      });
    }
  }, [formData.latitude, formData.longitude]);

  useEffect(() => {
    setOpenAccordion(Boolean(formData.zip_code));
  }, [formData.zip_code]);

  return (
    <Box sx={{ maxWidth: '100vw', mx: 'auto', p: 2 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          p: { xs: 2, md: 3 },
          backgroundColor: 'background.paper',
          borderRadius: 1,
        }}
      >
        {Object.keys(formErrors).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {Object.entries(formErrors).map(([field, messages]) => (
              <div key={field}>
                <strong>{fieldLabels[field] || field}:</strong> {messages.join(', ')}
              </div>
            ))}
          </Alert>
        )}

        <Stack spacing={3} sx={{ width: '100%' }}>
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

          <Box>
            <Button
              variant="outlined"
              onClick={() => setOpenAccordion(!openAccordion)}
              fullWidth
            >
              {openAccordion ? 'Ocultar informações do endereço' : 'Ver informações do endereço'}
            </Button>
            <Collapse in={openAccordion}>
              <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                <Stack spacing={2}>
                  <CustomTextField
                    fullWidth
                    placeholder="CEP"
                    value={formData.zip_code || ''}
                    onChange={(e) => handleChange('zip_code', e.target.value)}
                    disabled={
                      Object.keys(initialData).length === 0 || !!initialData.zip_code
                    }
                    />
                  <CustomTextField
                    fullWidth
                    placeholder="País"
                    value={formData.country || ''}
                    onChange={(e) => handleChange('country', e.target.value)}
                    disabled={
                      Object.keys(initialData).length === 0 || !!initialData.country
                    }
                  />
                  <CustomTextField
                    fullWidth
                    placeholder="Estado"
                    value={formData.state || ''}
                    onChange={(e) => handleChange('state', e.target.value)}
                    disabled={
                      Object.keys(initialData).length === 0 || !!initialData.state
                    }
                  />
                  <CustomTextField
                    fullWidth
                    placeholder="Cidade"
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    disabled={
                      Object.keys(initialData).length === 0 || !!initialData.city
                    }
                  />
                  <CustomTextField
                    fullWidth
                    placeholder="Bairro"
                    value={formData.neighborhood || ''}
                    onChange={(e) => handleChange('neighborhood', e.target.value)}
                    disabled={
                      Object.keys(initialData).length === 0 || !!initialData.neighborhood
                    }
                  />
                  <CustomTextField
                    fullWidth
                    placeholder="Rua"
                    value={formData.street || ''}
                    onChange={(e) => handleChange('street', e.target.value)}
                    disabled={
                      Object.keys(initialData).length === 0 || !!initialData.street
                    }
                  />
                  <CustomTextField
                    fullWidth
                    placeholder="Número"
                    value={formData.number || ''}
                    onChange={(e) => handleChange('number', e.target.value)}
                    disabled={
                      Object.keys(initialData).length === 0
                    }
                  />
                </Stack>
              </Box>
            </Collapse>
          </Box>

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

          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmModalOpen(true)}
            disabled={formLoading}
            endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ alignSelf: 'flex-end' }}
          >
            {formLoading ? 'Salvando...' : 'Criar Endereço'}
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        fullWidth
        maxWidth="sm"
        TransitionProps={{
          onEnter: (node) => {
            node.style.animation = 'shake 0.5s ease';
          },
        }}
        sx={{
          '@keyframes shake': {
            '0%': { transform: 'translateX(0)' },
            '25%': { transform: 'translateX(-10px)' },
            '50%': { transform: 'translateX(10px)' },
            '75%': { transform: 'translateX(-10px)' },
            '100%': { transform: 'translateX(0)' },
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: 'warning.main', color: 'white', mb: 2 }}>
          Confirmação de Endereço
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong style={{ fontSize: '1.3em' }}>Atenção:</strong> este endereço será utilizado exatamente como informado para definir a rota do motorista. Verifique se a localização no mapa está correta.
          </DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                color="warning"
              />
            }
            label="Confirmo que as informações estão corretas e desejo prosseguir."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmModalOpen(false)}>Cancelar</Button>
          <Button onClick={submitAddress} disabled={!confirmChecked}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateAddressPage;
