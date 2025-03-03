'use client';
import { useEffect, useState, Fragment, useCallback } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import materialService from '@/services/materialsService';
import { debounce } from 'lodash';

export default function AutoCompleteInversor({
  onChange,
  value,
  error,
  helperText,
  labeltitle,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    const fetchDefaultMaterial = async () => {
      if (value) {
        try {
          const material = await materialService.getMaterialById(value);
          if (material) {
            setSelectedMaterial({ id: material.id, name: material.description });
          }
        } catch (error) {
          console.error('Erro ao buscar material:', error);
        }
      }
    };

    fetchDefaultMaterial();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedMaterial(newValue);
    onChange(newValue ? newValue.id : null);
  };

  const fetchMaterialsByName = useCallback(
    debounce(async (name) => {
      setLoading(true);
      try {
        const response = await materialService.getMaterialByName(name);
        console.log('Resposta da API: ', response);
        if (Array.isArray(response.results)) {
          const formattedMaterials = response.results.map((material) => ({
            id: material.id,
            name: material.description,
          }));
          setOptions(formattedMaterials);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error('Erro ao buscar materiais:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [],
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      options={options}
      loading={loading}
      value={selectedMaterial}
      disabled={disabled}
      loadingText="Carregando..."
      noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
      onInputChange={(event, newInputValue) => fetchMaterialsByName(newInputValue)}
      onChange={handleChange}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name || ''}
      renderInput={(params) => (
        <CustomTextField
          label={labeltitle}
          error={error}
          helperText={helperText}
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
}
