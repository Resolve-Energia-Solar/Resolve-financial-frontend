import {
  Grid,
  TextField,
  MenuItem,
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
import AutoCompleteUser from '../../comercial/sale/components/auto-complete/Auto-Input-User';
import { useState, useEffect } from 'react';
import KitSelectionCard from '../../kits/KitSelectionCard';
import AddKitButton from '../../kits/AddKitCard'; 
import AddKitForm from '../../kits/AddKitForm';

const ProposalEditForm = ({ kits, selectedLead, handleCloseForm, proposal, reloadKits }) => {
  const {
    formData,
    setFormData,
    handleChange,
    handleUpdate,
    formErrors,
    snackbar,
    closeSnackbar,
  } = useProposalForm();
  const [selectedKitIds, setSelectedKitIds] = useState([]);
  const [isEditingKits, setIsEditingKits] = useState(false);
  const [isAddKitModalOpen, setIsAddKitModalOpen] = useState(false); 

  useEffect(() => {
    if (proposal) {
      setFormData({
        lead_id: proposal.leadId || selectedLead.id,
        created_by_id: proposal.created_by.id || '',
        due_date: proposal.due_date || '',
        value: proposal.value || '',
        status: proposal.status || '',
        observation: proposal.observation || '',
      });

      const kitIds = proposal.kits ? proposal.kits.map((kit) => kit.id) : [];
      setSelectedKitIds(kitIds);
    } else {
      setFormData({
        lead_id: selectedLead.id,
        created_by_id: '',
        due_date: '',
        value: '',
        status: '',
        observation: '',
      });
      setSelectedKitIds([]);
    }
  }, [proposal, selectedLead, setFormData]);

  useEffect(() => {
    const selectedKits = kits.filter((kit) => selectedKitIds.includes(kit.id));
    const totalValue = selectedKits.reduce((sum, kit) => sum + Number(kit.price || 0), 0);

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

  const toggleEditKits = () => {
    setIsEditingKits(!isEditingKits);
  };

  const handleAddKit = () => {
    setIsAddKitModalOpen(true);
  };

  const handleAddKitSave = (newKitData) => {
    console.log('Novo Kit Adicionado:', newKitData);
    setSelectedKitIds((prevSelectedKits) => [...prevSelectedKits, newKitData.id]);
    kits.push(newKitData);
    if (reloadKits) reloadKits();
    setIsAddKitModalOpen(false);
  };

  const handleAddKitCancel = () => {
    setIsAddKitModalOpen(false);
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <CustomFormLabel>{isEditingKits ? 'Todos os Kits' : 'Kits Selecionados'}</CustomFormLabel>
          <Button variant="outlined" color="primary" onClick={toggleEditKits}>
            {isEditingKits ? 'Concluir' : 'Mudar Kits'}
          </Button>
        </Box>

        <Grid container spacing={1.5}>
          {isEditingKits && (
            <Grid item xs={12} sm={6} md={4}>
              <Box display="flex" justifyContent="center" mt={1}>
                <AddKitButton onClick={handleAddKit} />
              </Box>
            </Grid>
          )}
          {kits && kits.length > 0 ? (
            kits
              .filter((kit) => isEditingKits || selectedKitIds.includes(kit.id))
              .map((kit) => (
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
          onClick={() =>
            handleUpdate(proposal.id, selectedLead.id, selectedKitIds, handleCloseForm)
          }
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

export default ProposalEditForm;
