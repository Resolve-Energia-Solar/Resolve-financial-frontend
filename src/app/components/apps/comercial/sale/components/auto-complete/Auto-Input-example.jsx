import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import userService from '@/services/userService';
import { debounce } from 'lodash';

export default function AutoCompleteUserTest({ onChange, value }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newUser, setNewUser] = React.useState('');

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
        const users = await userService.index({ name: name });
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

  const fetchInitialUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const users = await userService.getUser({ limit: 5, page: 1 });
      const formattedUsers = users.results.map((user) => ({
        id: user.id,
        name: user.complete_name,
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser('');
  };

  const handleAddUser = async () => {
    try {
      const createdUser = await userService.create({ name: newUser });
      const newOption = { id: createdUser.id, name: createdUser.name };

      setOptions((prev) => [...prev, newOption]);
      setSelectedUser(newOption);
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
    }
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
        value={selectedUser}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
        onInputChange={(event, newInputValue) => {
          fetchUsersByName(newInputValue);
        }}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            size="small"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                  <IconButton onClick={handleOpenDialog} edge="end" size="small">
                    <AddIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              ),
            }}
          />
        )}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
        <DialogContent>
          <CustomTextField
            autoFocus
            margin="dense"
            label="Nome Completo"
            fullWidth
            size="small" // Definindo o tamanho pequeno
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} size="small">
            Cancelar
          </Button>
          <Button onClick={handleAddUser} color="primary" size="small">
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
