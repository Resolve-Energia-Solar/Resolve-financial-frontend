'use client';
import React, { useState, useEffect } from 'react';
import { Box, TextField, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

const AddressAutocomplete = ({ apiKey, onAddressSelect, inputValue, onInputChange }) => {
  const [shouldSearch, setShouldSearch] = useState(true);

  const [localInputValue, setLocalInputValue] = useState('');
  const value = inputValue !== undefined ? inputValue : localInputValue;
  const [isPostalCodeSearch, setIsPostalCodeSearch] = useState(false);

  const handleChangeInput = (e) => {
    setShouldSearch(true);

    if (onInputChange) {
      onInputChange(e.target.value);
    } else {
      setLocalInputValue(e.target.value);
    }
  };

  // Carrega a API do Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
    region: 'BR',
    language: 'pt-BR',
  });

  // Estado para as sugestões
  const [predictions, setPredictions] = useState([]);

  // Efeito que faz a busca
  useEffect(() => {
    if (isLoaded && window.google && value.length > 2 && shouldSearch) {
      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'br' },
          types: ['address'],
        },
        (preds, status) => {
          console.log('Predictions:', preds, status);
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPredictions(preds);
          } else {
            setPredictions([]);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  }, [value, isLoaded, shouldSearch]);

  // Quando o usuário clica numa sugestão
  const handleSelectPrediction = (prediction) => {
    if (window.google) {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['formatted_address', 'address_components', 'geometry'],
        },
        (placeResult, status) => {
          console.log('Place details:', placeResult, status);
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
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
              latitude: placeResult.geometry?.location?.lat(),
              longitude: placeResult.geometry?.location?.lng(),
            };

            console.log("Detailed address extracted:", detailedAddress);
            // Envia o endereço selecionado para o pai
            onAddressSelect && onAddressSelect(detailedAddress);

            // Atualiza o valor do campo
            if (onInputChange) {
              onInputChange(placeResult.formatted_address);
            } else {
              setLocalInputValue(placeResult.formatted_address);
            }

            // Limpa as sugestões
            setPredictions([]);
            // Desabilita a busca para evitar retrigger do useEffect
            setShouldSearch(false);
          } else {
            console.error("Erro ao obter detalhes do lugar:", status);
          }
        }
      );
    }
  };

  if (loadError) {
    console.error("Erro ao carregar o Google Maps API:", loadError);
    return <div>Erro ao carregar o Google Maps API</div>;
  }
  if (!isLoaded) {
    return <div>Carregando Google Maps API...</div>;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        label="Pesquisar Endereço"
        variant="outlined"
        value={value}
        onChange={handleChangeInput}
      />
      {predictions.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        >
          <List>
            {predictions.map((prediction) => (
              <ListItem
                key={prediction.place_id}
                button
                onClick={() => handleSelectPrediction(prediction)}
              >
                <ListItemText primary={prediction.description} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default AddressAutocomplete;
