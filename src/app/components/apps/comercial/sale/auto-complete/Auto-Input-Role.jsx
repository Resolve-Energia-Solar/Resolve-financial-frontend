'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import roleService from '@/services/roleService';
import { debounce } from 'lodash';

export default function AutoCompleteRole({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const fetchDefaultRole = async () => {
      if (value) {
        try {
          const role = await roleService.getRoleById(value);
          if (role) {
            setSelectedRole({ id: role.id, name: role.name });
          }
        } catch (error) {
          console.error('Erro ao buscar função:', error);
        }
      }
    };

    fetchDefaultRole();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedRole(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchRolesByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const roles = await roleService.getRole();
        const filteredRoles = roles.results.filter(role =>
          role.name.toLowerCase().includes(name.toLowerCase())
        );
        const formattedRoles = filteredRoles.map(role => ({
          id: role.id,
          name: role.name,
        }));
        setOptions(formattedRoles);
      } catch (error) {
        console.error('Erro ao buscar funções:', error);
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
        value={selectedRole}
        onInputChange={(event, newInputValue) => {
          fetchRolesByName(newInputValue);
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
