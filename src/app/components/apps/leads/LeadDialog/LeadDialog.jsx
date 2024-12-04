import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import AutoCompleteOrigin from '../auto-input-origin';
import AutoCompleteUser from '../../comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteAddresses from '../../comercial/sale/components/auto-complete/Auto-Input-Addresses';

const LeadDialog = ({
  openLeadModal,
  handleCloseLeadModal,
  handleSaveLead,
  leadData,
  setLeadData,
}) => {
  const funnelOptions = [
    { value: 'N', label: 'Não Interessado' },
    { value: 'P', label: 'Pouco Interessado' },
    { value: 'I', label: 'Interessado' },
    { value: 'M', label: 'Muito Interessado' },
    { value: 'PC', label: 'Pronto para Comprar' },
  ];

  const genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
  ];

  const qualificationOptions = [
    { value: 0, label: '0 - Ruim' },
    { value: 1, label: '1 - Muito Baixa' },
    { value: 2, label: '2 - Baixa' },
    { value: 3, label: '3 - Média' },
    { value: 4, label: '4 - Boa' },
    { value: 5, label: '5 - Excelente' },
  ];

  return (
    <Dialog open={openLeadModal} onClose={handleCloseLeadModal} maxWidth="md" fullWidth>
      <DialogTitle>Adicionar Lead</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Nome do Lead"
              fullWidth
              value={leadData.complete_name}
              onChange={(e) => setLeadData({ ...leadData, complete_name: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="E-mail"
              fullWidth
              type="email"
              value={leadData.contact_email}
              onChange={(e) => setLeadData({ ...leadData, contact_email: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Telefone"
              fullWidth
              type="tel"
              value={leadData.phone}
              onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Sexo"
              fullWidth
              value={leadData.gender || ''}
              onChange={(e) => setLeadData({ ...leadData, gender: e.target.value })}
            >
              {genderOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Funil"
              fullWidth
              value={leadData.funnel || ''}
              onChange={(e) => setLeadData({ ...leadData, funnel: e.target.value })}
            >
              {funnelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Qualificação"
              fullWidth
              value={leadData.qualification || ''}
              onChange={(e) => setLeadData({ ...leadData, qualification: e.target.value })}
            >
              {qualificationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Potência (kWp)"
              fullWidth
              type="number"
              inputProps={{ step: 0.01, min: 0 }}
              value={leadData.kwp || ''}
              onChange={(e) => setLeadData({ ...leadData, kwp: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <AutoCompleteOrigin
              labeltitle="Origem"
              value={leadData.origin_id}
              onChange={(id) => setLeadData({ ...leadData, origin_id: id })}
              error={!!leadData.originError}
            />
          </Grid>

          <Grid item xs={12}>
            <AutoCompleteUser
              labeltitle="Vendedor"
              value={leadData.seller_id}
              onChange={(id) => setLeadData({ ...leadData, seller_id: id })}
            />
          </Grid>

          <Grid item xs={12}>
            <AutoCompleteUser
              labeltitle="SDR"
              value={leadData.sdr_id}
              onChange={(id) => setLeadData({ ...leadData, sdr_id: id })}
            />
          </Grid>

          <Grid item xs={12}>
            <AutoCompleteAddresses
              labeltitle="Endereço"
              value={leadData.addresses_ids}
              onChange={(ids) => setLeadData({ ...leadData, addresses_ids: ids })}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseLeadModal} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={handleSaveLead}
          color="primary"
          variant="contained"
          disabled={
            !leadData.complete_name ||
            !leadData.contact_email ||
            !leadData.phone ||
            !leadData.origin_id
          }
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadDialog;
