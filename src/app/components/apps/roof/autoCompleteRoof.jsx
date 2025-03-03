'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import RoofTypeService from '@/services/RoofTypeService';
import { debounce } from 'lodash';

export default function AutoCompleteRoofType({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoofType, setSelectedRoofType] = useState(null);

  useEffect(() => {
    const fetchDefaultRoofType = async () => {
      if (value) {
        try {
          const roofType = await RoofTypeService.getRoofTypeById(value);
          if (roofType) {
            setSelectedRoofType({ id: roofType.id, name: roofType.name });
          }
        } catch (error) {
          console.error('Erro ao buscar tipo de telhado:', error);
        }
      }
    };

    fetchDefaultRoofType();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedRoofType(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchRoofTypesByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const roofTypes = await RoofTypeService.getRoofTypeByName(name); // Usando o RoofTypeService
        if (roofTypes && roofTypes.results) {
          const formattedRoofTypes = roofTypes.results
            .filter(roofType => roofType.name)
            .map(roofType => ({
              id: roofType.id,
              name: roofType.name,
            }));
          setOptions(formattedRoofTypes);
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de telhado:', error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const handleOpen = () => {
    setOpen(true);
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
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedRoofType}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."  
        onInputChange={(event, newInputValue) => {
          fetchRoofTypesByName(newInputValue);
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
          <li {...props}>
            <div>
              <strong>{option.name}</strong>
            </div>
          </li>
        )}
      />
    </div>
  );
}
