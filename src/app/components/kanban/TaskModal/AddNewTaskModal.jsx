'use client';
import React, { useContext, useEffect } from 'react';
import {
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import useLeadForm from '@/hooks/leads/useLeadtForm';
import AutoCompleteOrigin from '../../apps/leads/auto-input-origin';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';

function AddNewList({ show, onHide, columnId }) {
  const { addTask } =
    useContext(KanbanDataContext);

  const {
    formData,
    handleChange,
    handleSave,
    loading: formLoading,
    dataReceived,
    formErrors,
    success,
  } = useLeadForm();

  formData.column_id = columnId;

  useEffect(() => {
    if (success && !Object.keys(formErrors).length) {
      addTask(columnId, dataReceived);
      onHide();
    }
  }, [success, formErrors]);

  return (
    <Dialog
      open={show}
      onClose={onHide}
      PaperProps={{
        component: 'form',
      }}
    >
      <DialogTitle>Adicionar Lead</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">Nome</CustomFormLabel>
            <CustomTextField
              name="name"
              placeholder="Nome"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">Telefone</CustomFormLabel>
            <CustomTextField
              name="phone"
              placeholder="Telefone"
              variant="outlined"
              fullWidth
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              {...(formErrors.phone && { error: true, helperText: formErrors.phone })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="branch">Origem</CustomFormLabel>
            <AutoCompleteOrigin
              onChange={(id) => handleChange('origin_id', id)}
              value={formData.origin_id}
              {...(formErrors.origin_id && { error: true, helperText: formErrors.origin_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">CPF/CNPJ</CustomFormLabel>
            <CustomTextField
              name="first_document"
              placeholder="CPF/CNPJ"
              variant="outlined"
              fullWidth
              value={formData.first_document}
              onChange={(e) => handleChange('first_document', e.target.value)}
              {...(formErrors.first_document && {
                error: true,
                helperText: formErrors.first_document,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">E-mail</CustomFormLabel>
            <CustomTextField
              name="contact_email"
              placeholder="E-mail"
              variant="outlined"
              fullWidth
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              {...(formErrors.contact_email && {
                error: true,
                helperText: formErrors.contact_email,
              })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={formLoading}
          endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {formLoading ? 'Adicionando...' : 'Adicionar'}{' '}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddNewList;
