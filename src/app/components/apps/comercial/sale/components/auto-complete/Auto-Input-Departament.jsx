'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import departmentService from '@/services/departmentService';

export default function AutoCompleteDepartament({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartament, setSelectedDepartament] = useState(null);

  // Carregar todos os departamentos ao montar a página
  useEffect(() => {
    const fetchInitialDepartaments = async () => {
      setLoading(true);
      try {
        const departaments = await departmentService.index({ limit: 100 });
        if (departaments && departaments.results) {
          const formattedDepartaments = departaments.results.map((departament) => ({
            id: departament.id,
            name: departament.name,
          }));
          setOptions(formattedDepartaments);
        }
      } catch (error) {
        console.error('Erro ao buscar departamentos:', error);
      }
      setLoading(false);
    };

    fetchInitialDepartaments();
  }, []); // Apenas uma vez ao montar a página

  // Carregar nome do departamento inicial, se houver um valor
  useEffect(() => {
    if (value && options.length > 0) {
      const initialDepartment = options.find((dept) => dept.id === value);
      if (initialDepartment) {
        setSelectedDepartament(initialDepartment);
        onChange(initialDepartment.id);
      }
    }
  }, [value, options]); // Atualiza quando os departamentos são carregados

  const handleChange = (event, newValue) => {
    setSelectedDepartament(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedDepartament}
        onChange={handleChange}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
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
