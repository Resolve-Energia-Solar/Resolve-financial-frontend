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
          const user = await userService.getUserById(value);
          if (user) {
            setSelectedUser({ id: user.id, name: user.complete_name });
          }
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
        }
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
      if (!name) return;
      setLoading(true);
      try {
        console.log('query input -> ', query);
        const users = await userService.getUsersBySchedule(query);
        const formattedUsers = users.results.map(user => ({
          id: user.id,
          name: user.complete_name
        }));
        setOptions(formattedUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
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
        disabled={disabled}
        value={selectedUser}
        onInputChange={(event, newInputValue) => {
          fetchUsersByName(newInputValue);
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
