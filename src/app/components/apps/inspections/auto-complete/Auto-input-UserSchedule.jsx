import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import userService from '@/services/userService';
import { debounce } from 'lodash';

export default function AutoCompleteUserSchedule({
  onChange,
  value,
  error,
  helperText,
  disabled,
  query,
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  React.useEffect(() => {
    const fetchDefaultUser = async () => {
      if (value) {
        try {
          const user = await userService.getUserByIdQuery(value, query);
          if (user) {
            setSelectedUser({
              id: user.id,
              name: user.complete_name,
              distance: (user.distance || 0).toFixed(2),
              daily_schedules_count: user.daily_schedules_count || '0',
            });
          }
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
        }
      } else {
        setSelectedUser(null);
      }
    };

    fetchDefaultUser();
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
        const users = await userService.getUsersBySchedule(query);
        const formattedUsers = users.results.map((user) => ({
          id: user.id,
          name: user.complete_name,
          distance: (user.distance || 0).toFixed(2),
          daily_schedules_count: user.daily_schedules_count || '0',
        }));
        setOptions(formattedUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
      setLoading(false);
    }, 300),
    [query],
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
        getOptionLabel={(option) =>
          `${option.name} (Distância: ${option.distance} KMs | Agendamentos: ${option.daily_schedules_count})`
        }
        options={options}
        loading={loading}
        disabled={disabled}
        noOptionsText="Não há agentes disponíveis para a região, data e horário selecionados. Por favor, escolha outra data e horário ou entre em contato com o setor de vistoria."
        value={selectedUser}
        onInputChange={(event, newInputValue) => {
          fetchUsersByName(newInputValue);
        }}
        onChange={handleChange}
        onFocus={() => fetchUsersByName('')}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            error={error}
            helperText={helperText}
            size="small"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
}
