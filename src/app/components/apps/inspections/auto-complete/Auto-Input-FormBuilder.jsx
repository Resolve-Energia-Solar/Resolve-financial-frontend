import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import formBuilderService from '@/services/formBuilderService';
import { debounce } from 'lodash';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
//import CreateForm from '@/app/components/forms/CreateForm'; // Componente para criar novo formulário

export default function AutoCompleteFormBuilder({ onChange, value, error, helperText, disabled, labeltitle }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedForm, setSelectedForm] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  const fetchDefaultForm = async (formId) => {
    if (formId) {
      try {
        const form = await formBuilderService.getFormById(formId);
        if (form) {
          setSelectedForm({ id: form.id, name: form.name });
          if (!value) onChange(form.id);
        }
      } catch (error) {
        console.error('Erro ao buscar formulário:', error);
      }
    }
  };

  React.useEffect(() => {
    fetchDefaultForm(value);
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedForm(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchFormsByTitle = React.useCallback(
    debounce(async (title) => {
      if (!title) return;
      setLoading(true);
      try {
        const forms = await formBuilderService.getFormByName(title);
        const formattedForms = forms.results.map(form => ({
          id: form.id,
          name: form.name
        }));
        setOptions(formattedForms);
      } catch (error) {
        console.error('Erro ao buscar formulários:', error);
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
        value={selectedForm}
        onInputChange={(event, newInputValue) => {
          fetchFormsByTitle(newInputValue);
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
                  <IconButton 
                    onClick={handleOpenModal} 
                    aria-label="Adicionar formulário" 
                    edge="end"
                    size="small"
                    sx={{ padding: '4px' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              ),
            }}
          />
        )}
      />

      {/* Modal para adicionar formulário */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg">
        <DialogTitle>Adicionar Novo Formulário</DialogTitle>
        <DialogContent>
          {/* <CreateForm onClosedModal={handleCloseModal} /> */}
          <Typography>Novo Formulário</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Cancelar</Button>
          {/* Aqui pode ser adicionado um botão para salvar, se necessário */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
