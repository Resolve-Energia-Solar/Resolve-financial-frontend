import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  CircularProgress,
} from '@mui/material';
import AutoCompleteMaterial from '../../comercial/sale/components/auto-complete/Auto-Input-Material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import projectMaterialsService from '@/services/projectMaterialService';

const AddMaterialList = ({ open, handleClose, onRefresh, projectId }) => {
  const [formData, setFormData] = useState({
    material: '',
    amount: '',
    project: projectId || '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await projectMaterialsService.create(formData);
      if (handleClose) handleClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      if (error.response && error.response.data) {
        setFormErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Material</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="material">Material</CustomFormLabel>
            <AutoCompleteMaterial
              name="material"
              onChange={(value) => setFormData({ ...formData, material: value })}
              variant="outlined"
              fullWidth
              {...(formErrors.material && {
                error: true,
                helperText: formErrors.material,
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="amount">Quantidade</CustomFormLabel>
            <TextField
              margin="dense"
              fullWidth
              name="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              InputProps={{
                inputProps: {
                  step: 1,
                },
              }}
              {...(formErrors.amount && {
                error: true,
                helperText: formErrors.amount,
              })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMaterialList;
