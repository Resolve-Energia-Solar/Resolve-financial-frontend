'use client';
import { useContext, useState } from 'react';

import { Button, Dialog, DialogTitle, DialogContent, Grid, DialogActions, CircularProgress } from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { KanbanDataContext } from '@/app/context/kanbancontext';
import columnService from '@/services/boardColumnService';
import { enqueueSnackbar, useSnackbar } from 'notistack';

function EditCategoryModal({ showModal, handleCloseModal, initialCategoryName, column }) {
  const { refresh } = useContext(KanbanDataContext);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    name: column.name,
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      await columnService.updateColumnPatch(column.id, formData);
      enqueueSnackbar(`Coluna "${column.name}" atualizada com sucesso`, {
        variant: 'success',
      });
    } catch (error) {
      console.error(`Erro ao atualizar a coluna "${column.name}":`, error.message);
      enqueueSnackbar(`Erro ao atualizar a coluna "${column.name}"`, { variant: 'error' });
    } finally {
      refresh();
      setLoading(false);
      handleCloseModal();
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
          {loading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default EditCategoryModal;
