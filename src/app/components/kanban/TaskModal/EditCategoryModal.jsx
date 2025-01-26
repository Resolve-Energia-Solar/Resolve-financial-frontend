'use client';
import { useContext, useState } from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { KanbanDataContext } from '@/app/context/kanbancontext';
import columnService from '@/services/boardColumnService';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import ColorPicker from '../components/ColorPicker';
import FormSelect from '../../forms/form-custom/FormSelect';

function EditCategoryModal({ showModal, handleCloseModal, column }) {
  const { refresh } = useContext(KanbanDataContext);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  const choicesColumnTypes = [
    { value: 'B', label: 'Pendências' },
    { value: 'T', label: 'A fazer' },
    { value: 'I', label: 'Em andamento' },
    { value: 'D', label: 'Concluído' },
  ];

  const [formData, setFormData] = useState({
    name: column.name,
    color: column.color,
    column_type: column.column_type,
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      await columnService.updateColumnPatch(column.id, formData);
      enqueueSnackbar(`Coluna "${column.name}" atualizada com sucesso`, {
        variant: 'success',
      });
      refresh();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao criar o board:', error.message);
      const errorData = error.response?.data || {};
      setFormErrors(errorData);
      Object.entries(errorData).forEach(([key, value]) => {
        enqueueSnackbar(`${key}: ${value.join(' ')}`, { variant: 'error' });
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={showModal}
      onClose={handleCloseModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '.MuiDialog-paper': { width: '600px' } }}
    >
      <DialogTitle id="alert-dialog-title">Editar Coluna</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="cname">Nome</CustomFormLabel>
            <CustomTextField
              id="cname"
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormSelect
              label="Tipo de Coluna"
              options={choicesColumnTypes}
              value={formData.column_type}
              onChange={(e) => setFormData({ ...formData, column_type: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="color">Cor</CustomFormLabel>
            <ColorPicker
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleCloseModal}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default EditCategoryModal;
