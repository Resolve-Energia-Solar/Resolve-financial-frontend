'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import userService from '@/services/userService';
import { debounce } from 'lodash';

export default function AutoCompleteUsers({ onChange, value = [], error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchDefaultUsers = async () => {
      if (value.length > 0) {
        try {
          const users = await Promise.all(value.map(id => userService.getUserById(id)));
          const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.complete_name // Ajuste conforme o campo do nome do usuário
          }));
          setSelectedUsers(formattedUsers);
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
        }
      }
    };

    fetchDefaultUsers();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedUsers(newValue);
    onChange(newValue.map(user => user.id)); // Envia uma lista de IDs
  };

  const fetchUsersByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const users = await userService.getUserByName(name); // Chama o endpoint diretamente
        const formattedUsers = users.results.map(user => ({
          id: user.id,
          name: user.complete_name, // Formata conforme necessário
        }));
        setOptions(formattedUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const fetchInitialUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await userService.getUser({ limit: 5, page: 1 }); // Busca inicial com limite
      const formattedUsers = users.results.map(user => ({
        id: user.id,
        name: user.complete_name, // Formata conforme necessário
      }));
      setOptions(formattedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários iniciais:', error);
    }
    setLoading(false);
  }, []);


  const handleOpen = () => {
    console.log('handleOpen');
    setOpen(true);
    if (options.length === 0) {
      fetchInitialUsers(); // Busca inicial ao abrir
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div>
      <Autocomplete
        multiple
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id} // Compara pelos IDs
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedUsers}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."  
        onInputChange={(event, newInputValue) => {
          fetchUsersByName(newInputValue);
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
