import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import userService from '@/services/userService';
import { debounce } from 'lodash';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserForm from '@/app/(DashboardLayout)/apps/users/create/page';
import CreateCustomer from '@/app/components/apps/users/Add-user/customer';

export default function AutoCompleteUser({ onChange, value, error, helperText, disabled, labeltitle }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  const fetchDefaultUser = async (userId) => {
    if (userId) {
      try {
        const user = await userService.getUserById(userId);
        if (user) {
          setSelectedUser({ id: user.id, name: user.complete_name });
          if (!value) onChange(user.id);
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    }
  };

  React.useEffect(() => {
    fetchDefaultUser(value);
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
        const users = await userService.getUserByName(name);
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

  const fetchInitialUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const users = await userService.getUser({ limit: 5, page: 1 });
      const formattedUsers = users.results.map(user => ({
        id: user.id,
        name: user.complete_name
      }));
      setOptions(formattedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários iniciais:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialUsers();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
            label={labeltitle}
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
                  {!disabled && (
                    <IconButton 
                      onClick={handleOpenModal} 
                      aria-label="Adicionar usuário" 
                      edge="end"
                      size="small"
                      sx={{ padding: '4px' }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </React.Fragment>
              ),
            }}
          />
        )}
      />

      {/* Modal para adicionar usuário */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg">
        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
        <DialogContent>
          <CreateCustomer onClosedModal={handleCloseModal} selectedUserId={fetchDefaultUser} />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Cancelar</Button>
          <Button onClick={() => {} color="primary">Salvar</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
