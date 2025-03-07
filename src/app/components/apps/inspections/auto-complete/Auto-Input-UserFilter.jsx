import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import userService from '@/services/userService';
import { debounce } from 'lodash';

export default function AutoCompleteUserFilter({
  onChange,
  value,
  error,
  helperText,
  disabled,
  labeltitle,
  noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa.",
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const fetchDefaultUser = async (userId) => {
    if (userId) {
      try {
        const user = await userService.getUserById(userId);
        if (user) {
          return { id: user.id, name: user.complete_name };
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    }
    return null;
  };

  React.useEffect(() => {
    if (value) {
      fetchDefaultUser(value).then((user) => {
        setSelectedUser(user);
      });
    } else {
      setSelectedUser(null);
    }
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedUser(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchUsersByName = React.useCallback(
    debounce(async (name) => {
      setLoading(true);
      try {
        const users = await userService.getUserByName(name);
        const formattedUsers = users.results.map((user) => ({
          id: user.id,
          name: user.complete_name,
        }));
        setOptions(formattedUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
      setLoading(false);
    }, 300),
    [],
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
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        disabled={disabled}
        value={selectedUser}
        loadingText="Carregando..."
        onInputChange={(event, newInputValue) => {
          fetchUsersByName(newInputValue);
        }}
        onChange={handleChange}
        onFocus={() => fetchUsersByName('')}
        noOptionsText={noOptionsText}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            label={labeltitle}
            error={error}
            helperText={helperText}
            variant="outlined"
          />
        )}
      />
    </div>
  );
}
