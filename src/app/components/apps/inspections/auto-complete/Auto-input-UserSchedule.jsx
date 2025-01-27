import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import userService from '@/services/userService';
import { debounce } from 'lodash';

const AutoCompleteUserSchedule = ({ onChange, value, error, helperText, disabled, query }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
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
  }, [value, query]);

  const formatUserData = (user) => ({
    id: user.id,
    name: user.complete_name,
    distance: user.distance ? user.distance.toFixed(2) : 'N/A',
    daily_schedules_count: user.daily_schedules_count || '0',
  });

  const fetchUsersByName = debounce(async (name) => {
    setLoading(true);
    try {
      const users = await userService.getUsersBySchedule(query);
      const formattedUsers = users.results.map(formatUserData);
      setOptions(formattedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchUsersByName('');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleChange = (event, newValue) => {
    setSelectedUser(newValue);
    onChange(newValue ? newValue.id : null);
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        getOptionLabel={(option) =>
          `${option.name} (Distância: ${option.distance} KMs | Agendamentos: ${option.daily_schedules_count})`
        }
        options={options}
        loading={loading}
        disabled={disabled}
        noOptionsText="Não há agentes disponíveis para a região, data e horário selecionados. Por favor, escolha outra data e horário ou entre em contato com o setor de vistoria."
        value={selectedUser || null}
        onInputChange={(event, newInputValue) => {
          if (newInputValue.trim()) fetchUsersByName(newInputValue);
        }}
        onChange={handleChange}
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
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

AutoCompleteUserSchedule.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  query: PropTypes.shape({
    category: PropTypes.string,
    scheduleDate: PropTypes.string,
    scheduleLatitude: PropTypes.number,
    scheduleLongitude: PropTypes.number,
  }),
};

AutoCompleteUserSchedule.defaultProps = {
  value: null,
  error: false,
  helperText: '',
  disabled: false,
  query: {},
};

export default AutoCompleteUserSchedule;
