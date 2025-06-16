'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import materialService from '@/services/materialsService';
import { debounce } from 'lodash';

export default function AutoCompleteMaterial({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    const fetchDefaultMaterial = async () => {
      if (value) {
        try {
          const material = await materialService.find(value);
          if (material) {
            setSelectedMaterial({
              id: material.id,
              name: material.name,
              price: material.price,
              attributes: material.attributes,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar material:', error);
        }
      }
    };

    fetchDefaultMaterial();
  }, [value]);

  const handleChange = (_event, newValue) => {
    setSelectedMaterial(newValue);
    onChange(newValue);
  };

  const fetchMaterialsByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const materials = await materialService.index({ name__icontains: name });
        if (materials && materials.results) {
          const formattedMaterials = materials.results
            .filter((material) => material.name)
            .map((material) => ({
              id: material.id,
              name: material.name,
              price: material.price,
              attributes: material.attributes,
            }));
          setOptions(formattedMaterials);
        }
      } catch (error) {
        console.error('Erro ao buscar materiais:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const fetchInitialMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const materials = await materialService.index({ limit: 5 });
      const formattedMaterials = materials.results
        .filter((material) => material.name)
        .map((material) => ({
          id: material.id,
          name: material.name,
          price: material.price,
          attributes: material.attributes,
        }));
      setOptions(formattedMaterials);
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialMaterials();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedMaterial}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
        onInputChange={(_event, newInputValue) => {
          fetchMaterialsByName(newInputValue);
        }}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            error={error}
            helperText={helperText}
            {...params}
            size="small"
            variant="outlined"
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
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <div>
              <strong>{option.name}</strong>
              <div>Preço: R${option.price}</div>
              <div>
                {option.attributes?.map((attr, index) => (
                  <div key={index}>{`${attr.key}: ${attr.value}`}</div>
                ))}
              </div>
            </div>
          </li>
        )}
      />
    </div>
  );
}
