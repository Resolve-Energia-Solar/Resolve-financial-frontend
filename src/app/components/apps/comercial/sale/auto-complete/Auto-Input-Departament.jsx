'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { debounce } from 'lodash';
import departmentService from '@/services/departmentService';

export default function AutoCompleteDepartament({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartament, setSelectedDepartament] = useState(null);

  useEffect(() => {
    const fetchDefaultDepartament = async () => {
      if (value) {
        try {
          const departament = await departmentService.getDepartmentById(value);
          if (departament) {
            setSelectedDepartament({ id: departament.id, name: departament.name });
          }
        } catch (error) {
          console.error('Erro ao buscar departamento:', error);
        }
      }
    };

    fetchDefaultDepartament();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedDepartament(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchDepartamentsByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const departaments = await departmentService.getDepartment();
        const filteredDepartaments = departaments.results.filter(departament =>
          departament.name.toLowerCase().includes(name.toLowerCase())
        );
        const formattedDepartaments = filteredDepartaments.map(departament => ({
          id: departament.id,
          name: departament.name,
        }));
        setOptions(formattedDepartaments);
      } catch (error) {
        console.error('Erro ao buscar departamentos:', error);
      }
      setLoading(false);
    }, 300), 
    []
  );

  // Função para abrir o autocomplete
  const handleOpen = () => {
    setOpen(true);
  };

  // Função para fechar o autocomplete
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
        value={selectedDepartament}
        onInputChange={(event, newInputValue) => {
          fetchDepartamentsByName(newInputValue);
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
      />
    </div>
  );
}
