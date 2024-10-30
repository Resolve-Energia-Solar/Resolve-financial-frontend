import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Snackbar,
  Alert,
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useProposalForm from '@/hooks/proposal/useProposalForm';
import AutoCompleteUser from '../../comercial/sale/components/auto-complete/Auto-Input-User';
import { useState, useEffect } from 'react';

const ProposalForm = ({ kits, selectedLead, handleCloseForm }) => {
  const { formData, setFormData, handleChange, handleSave, formErrors, snackbar, closeSnackbar } =
    useProposalForm();
  const [selectedKitIds, setSelectedKitIds] = useState([]);
  console.log(selectedLead);
  useEffect(() => {
    if (selectedLead) {
      setFormData((prevData) => ({
        ...prevData,
        leadId: selectedLead.id,
      }));
    }
  }, [selectedLead]);

  const handleKitSelection = (kitId) => {
    setSelectedKitIds((prevSelected) =>
      prevSelected.includes(kitId)
        ? prevSelected.filter((id) => id !== kitId)
        : [...prevSelected, kitId],
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <CustomFormLabel htmlFor="leadId">Lead</CustomFormLabel>
        <TextField fullWidth value={selectedLead?.name || ''} disabled />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomFormLabel htmlFor="created_by_id">Criado por</CustomFormLabel>
        <AutoCompleteUser
          label="Criado por"
          onChange={(created_by_id) => handleChange('created_by_id', created_by_id)}
          value={formData.created_by_id}
          {...(formErrors.created_by_id && { error: true, helperText: formErrors.created_by_id })}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Prazo para Aceitação"
          type="date"
          value={formData.due_date || ''}
          onChange={(e) => handleChange('due_date', e.target.value)}
          InputLabelProps={{ shrink: true }}
          {...(formErrors.due_date && { error: true, helperText: formErrors.due_date })}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Valor da Proposta"
          type="number"
          value={formData.value || ''}
          onChange={(e) => handleChange('value', e.target.value)}
          {...(formErrors.value && { error: true, helperText: formErrors.value })}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Status da Proposta"
          select
          value={formData.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
          {...(formErrors.status && { error: true, helperText: formErrors.status })}
        >
          <MenuItem value="P">Pendente</MenuItem>
          <MenuItem value="A">Aceita</MenuItem>
          <MenuItem value="R">Rejeitada</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Observação"
          multiline
          rows={4}
          value={formData.observation || ''}
          onChange={(e) => handleChange('observation', e.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <CustomFormLabel>Kits Solares Disponíveis</CustomFormLabel>
        <Grid container spacing={2}>
          {kits && kits.length > 0 ? (
            kits.map((kit) => (
              <Grid item xs={12} sm={6} md={6} key={kit.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: selectedKitIds.includes(kit.id) ? 'primary.main' : 'grey.400',
                    borderWidth: selectedKitIds.includes(kit.id) ? 2 : 1,
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 },
                  }}
                  onClick={() => handleKitSelection(kit.id)}
                >
                  <CardContent
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {`Kit Solar ID: ${kit.id}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {kit?.inversorsModel?.description}
                    </Typography>
                    <Typography variant="subtitle1" color="text.primary" fontWeight="bold">
                      {`Preço: R$ ${Math.round(kit.price).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </Typography>
                  </CardContent>
                  <Checkbox
                    checked={selectedKitIds.includes(kit.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleKitSelection(kit.id);
                    }}
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      color: selectedKitIds.includes(kit.id) ? 'primary.main' : 'grey.400',
                    }}
                  />
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              Nenhum kit disponível.
            </Typography>
          )}
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={3} width="100%">
        <Button variant="outlined" color="secondary" onClick={handleCloseForm} sx={{ mr: 2 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSave(selectedLead.id, selectedKitIds, handleCloseForm)}
        >
          Salvar
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProposalForm;
