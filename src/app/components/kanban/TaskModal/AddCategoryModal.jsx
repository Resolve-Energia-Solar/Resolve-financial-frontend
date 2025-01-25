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

function AddCategoryModal({ showModal, handleCloseModal, boardId }) {
  console.log('boardId:', boardId);
  const { refresh } = useContext(KanbanDataContext);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [formErrors, setFormErrors] = useState({});


  const [formData, setFormData] = useState({
    name: '',
    color: '',
    board: '',
    position: '',
  });

  formData.board = parseInt(boardId, 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await columnService.getColumns({
          params: { fields: 'id,board,position', board: boardId, ordering: '-position' },
        });
        if (response.length > 0) {
          setFormData({ ...formData, position: response[0].position + 1 });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [boardId]);

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
            <CustomFormLabel htmlFor="color">Cor</CustomFormLabel>
            <ColorPicker value={formData.color} onChange={(color) => setFormData({ ...formData, color })} />
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
