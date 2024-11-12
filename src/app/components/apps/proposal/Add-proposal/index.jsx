import {
  Grid,
  TextField,
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useProposalForm from '@/hooks/proposal/useProposalForm';
import { useState, useEffect } from 'react';
import KitSelectionCard from '../../kits/KitSelectionCard';
import AddKitButton from '../../kits/AddKitCard';
import AddKitForm from '../../kits/AddKitForm';

const ProposalForm = ({ kits, selectedLead, handleCloseForm, reloadKits }) => {
  const { formData, setFormData, handleChange, handleSave, formErrors, snackbar, closeSnackbar } =
    useProposalForm();
  const [selectedKitIds, setSelectedKitIds] = useState([]);
  const [isAddKitModalOpen, setIsAddKitModalOpen] = useState(false);

  useEffect(() => {
    if (selectedLead) {
      setFormData((prevData) => ({
        ...prevData,
        leadId: selectedLead.id,
      }));
    }
  }, [selectedLead]);

 useEffect(() => {
    const selectedKits = kits.filter((kit) => selectedKitIds.includes(kit.id));
    const totalValue = selectedKits.reduce((sum, kit) => sum + Number(kit.cost_value || 0), 0);

    setFormData((prevData) => ({
      ...prevData,
      value: totalValue,
    }));
  }, [selectedKitIds, kits]);

  const handleKitSelection = (kitId) => {
    setSelectedKitIds((prevSelected) =>
      prevSelected.includes(kitId)
        ? prevSelected.filter((id) => id !== kitId)
        : [...prevSelected, kitId],
    );
  };

  const handleAddKit = () => {
    setIsAddKitModalOpen(true);
  };

  const handleAddKitSave = (newKitData) => {
    console.log('Novo Kit Adicionado:', newKitData);
    setSelectedKitIds((prevSelectedKits) => [...prevSelectedKits, newKitData.id]);
    kits.push(newKitData);
    reloadKits();
    setIsAddKitModalOpen(false);
  };

  const handleAddKitCancel = () => {
    setIsAddKitModalOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CustomFormLabel htmlFor="leadId">Lead</CustomFormLabel>
        <TextField fullWidth value={selectedLead?.name || ''} disabled />
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
          value={`R$ ${(Number(formData.value) || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          onChange={(e) => handleChange('value', e.target.value)}
          {...(formErrors.value && { error: true, helperText: formErrors.value })}
          disabled
        />
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

        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={4} md={4}>
            <Box display="flex" justifyContent="center" mt={1}>
              <AddKitButton onClick={handleAddKit} />
            </Box>
          </Grid>
          {kits && kits.length > 0 ? (
            kits.map((kit) => (
              <Grid item xs={12} sm={6} md={4} key={kit.id}>
                <KitSelectionCard
                  kit={kit}
                  selected={selectedKitIds.includes(kit.id)}
                  onSelect={handleKitSelection}
                />
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

      <Dialog open={isAddKitModalOpen} onClose={handleAddKitCancel} maxWidth="md" fullWidth>
        <DialogContent dividers>
          <AddKitForm onSave={handleAddKitSave} onCancel={handleAddKitCancel} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default ProposalForm;
