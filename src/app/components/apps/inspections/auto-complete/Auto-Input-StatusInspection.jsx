'use client';

import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import serviceOpinionsService from '@/services/serviceOpinionsService';

export default function AutoInputStatusSchedule({
  onChange,
  value,
  error,
  helperText,
  disabled,
  serviceId,
  isFinalOpinion,
}) {
  const [status, setStatus] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await serviceOpinionsService.getServiceOpinions({
          name__icontains: inputValue,
          service: serviceId,
          is_final_service: isFinalOpinion,
        });
        setStatus(
          response.results.map((item) => ({
            id: item.id,
            label: item.name,
          })),
        );
      } catch (error) {
        console.error('Erro ao buscar status:', error);
      }
    };
    getStatus();
  }, [serviceId, isFinalOpinion]);

  // Busca dinâmica conforme o usuário digita
  useEffect(() => {
    const fetchStatusByInput = async () => {
      try {
        // Verifica se o input possui um tamanho mínimo (opcional)
        if (inputValue.length < 3) return;
        const response = await serviceOpinionsService.getServiceOpinions({
          name__icontains: inputValue,
          service: serviceId,
          is_final_service: isFinalOpinion,
        });
        setStatus(
          response.results.map((item) => ({
            id: item.id,
            label: item.name,
          })),
        );
      } catch (error) {
        console.error('Erro ao buscar status por input:', error);
      }
    };

    fetchStatusByInput();
  }, [inputValue, serviceId, isFinalOpinion]);

  // Busca o valor selecionado quando a prop "value" mudar
  useEffect(() => {
    const fetchSelectedValue = async () => {
      if (value) {
        try {
          const response = await serviceOpinionsService.getServiceOpinionsById(value);
          setSelectedValue({ id: response.id, label: response.name });
        } catch (error) {
          console.error('Erro ao buscar o status por ID:', error);
        }
      }
    };
    fetchSelectedValue();
  }, [value]);

  const handleOnChange = (event, newValue) => {
    setSelectedValue(newValue);
    onChange(newValue ? newValue.id : null);
  };

  return (
    <Autocomplete
      disablePortal
      options={status}
      getOptionLabel={(option) => option.label || ''}
      value={selectedValue}
      onChange={handleOnChange}
      disabled={disabled}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      sx={{ width: '100%' }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          size="small"
          variant="outlined"
        />
      )}
    />
  );
}
