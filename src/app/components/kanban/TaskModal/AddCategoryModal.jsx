'use client';
import { useContext, useEffect, useState } from 'react';

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

function AddCategoryModal({ showModal, handleCloseModal, boardId }) {
  const { refresh } = useContext(KanbanDataContext);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [formErrors, setFormErrors] = useState({});

  const choicesColumnTypes = [
    { value: 'B', label: 'Pendências' },
    { value: 'T', label: 'A fazer' },
    { value: 'I', label: 'Em andamento' },
    { value: 'D', label: 'Concluído' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    color: '',
    board: '',
    column_type: '',
  });

  formData.board = parseInt(boardId, 10);

  const handleSave = async () => {
    try {
      setLoading(true);
      await columnService.createColumn(formData);
      enqueueSnackbar(`Coluna criada com sucesso`, {
        variant: 'success',
      });
      handleCloseModal();
      refresh();
    } catch (error) {
      console.error('Erro ao criar a coluna:', error.message);
      enqueueSnackbar('Erro ao criar a coluna', { variant: 'error' });
      setFormErrors(error.response.data);
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
      <DialogTitle id="alert-dialog-title">Adicionar Coluna</DialogTitle>
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
          {loading ? 'Adicionando...' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default AddCategoryModal;
