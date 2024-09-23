import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid } from '@mui/material';

const GenerateProjectModal = ({ open, onClose, branches, managers }) => {
  const [formData, setFormData] = useState({
    project_number: '',
    branch: '',
    owner: '',
    members: '',
    financiers: '',
    start_date: '',
    end_date: '',
    status: '',
    kwp: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log('Projeto Gerado:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Gerar Projeto</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Número do Projeto"
              name="project_number"
              value={formData.project_number}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Filial"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
            >
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name} - {branch.address.city}, {branch.address.state}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Gerente do Projeto"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
            >
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.complete_name} - {manager.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Data de Início"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Data de Término"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Status do Projeto"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="pending">Pendente</MenuItem>
              <MenuItem value="completed">Concluído</MenuItem>
              <MenuItem value="in_progress">Em Progresso</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="KWp"
              name="kwp"
              value={formData.kwp}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateProjectModal;
