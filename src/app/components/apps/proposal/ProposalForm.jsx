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
} from '@mui/material';
import AutoCompleteLead from '../comercial/sale/components/auto-complete/Auto-Input-Leads';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useProposalForm from '@/hooks/proposals/useProposalForm';
import AutoCompleteUser from '../comercial/sale/components/auto-complete/Auto-Input-User';
import KitSolarService from '@/services/kitSolarService';
import { useEffect, useState } from 'react';

const ProposalForm = () => {
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
  } = useProposalForm();
  const [availableKits, setAvailableKits] = useState([]);
  const [selectedKitIds, setSelectedKitIds] = useState([]);

  useEffect(() => {
    const fetchAvailableKits = async () => {
      try {
        const response = await KitSolarService.getKitSolar();
        setAvailableKits(response.results || []);
      } catch (error) {
        console.error('Erro ao buscar kits solares', error);
        setAvailableKits([]);
      }
    };
    fetchAvailableKits();
  }, []);

  const handleKitSelection = (kitId) => {
    setSelectedKitIds((prevSelectedKitIds) =>
      prevSelectedKitIds.includes(kitId)
        ? prevSelectedKitIds.filter((id) => id !== kitId)
        : [...prevSelectedKitIds, kitId]
    );
    handleChange('kitIds', selectedKitIds);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <CustomFormLabel htmlFor="leadId">Lead</CustomFormLabel>
        <AutoCompleteLead
          onChange={(leadId) => handleChange('leadId', leadId)}
          value={formData.leadId}
          {...(formErrors.leadId && { error: true, helperText: formErrors.leadId })}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomFormLabel htmlFor="createdById">Criado por</CustomFormLabel>
        <AutoCompleteUser
          label="Criado por"
          onChange={(createdById) => handleChange('createdById', createdById)}
          value={formData.createdById}
          {...(formErrors.createdById && { error: true, helperText: formErrors.createdById })}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Prazo para Aceitação"
          type="date"
          value={formData.dueDate || ''}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          InputLabelProps={{ shrink: true }}
          {...(formErrors.dueDate && { error: true, helperText: formErrors.dueDate })}
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
          {availableKits.length > 0 ? (
            availableKits.map((kit) => (
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
        <Button variant="outlined" color="secondary" sx={{ mr: 2 }}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Salvar
        </Button>
      </Box>
    </Grid>
  );
};

export default ProposalForm;

