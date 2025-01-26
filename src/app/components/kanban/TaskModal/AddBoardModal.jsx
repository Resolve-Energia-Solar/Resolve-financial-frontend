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
import boardService from '@/services/boardService';
import { useSnackbar } from 'notistack';
import AutoCompleteBranch from '../../apps/comercial/sale/components/auto-complete/Auto-Input-Branch';

function AddBoardModal({ showModal, handleCloseModal }) {
  const { refresh } = useContext(KanbanDataContext);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    branch_id: null,
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setFormErrors({});
      await boardService.createBoard(formData);
      enqueueSnackbar('Board criado com sucesso!', { variant: 'success' });
      handleCloseModal();
      refresh();
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
      <DialogTitle id="alert-dialog-title">Adicionar Quadro</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="title">Título</CustomFormLabel>
            <CustomTextField
              id="title"
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={!!formErrors.title}
              helperText={formErrors.title}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="description">Descrição</CustomFormLabel>
            <CustomTextField
              id="description"
              variant="outlined"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!formErrors.description}
              helperText={formErrors.description}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="branch">Franquia</CustomFormLabel>
            <AutoCompleteBranch
              id="branch"
              value={formData.branch_id}
              onChange={(e) => setFormData({ ...formData, branch_id: e })}
              error={!!formErrors.branch_id}
              helperText={formErrors.branch_id}
              fullWidth
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

export default AddBoardModal;
