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
import AutoCompleteLead from '../../comercial/sale/components/auto-complete/Auto-Input-Leads';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useProposalForm from '@/hooks/proposals/useProposalForm';
import AutoCompleteUser from '../../comercial/sale/components/auto-complete/Auto-Input-User';
import KitSolarService from '@/services/kitSolarService';
import { useEffect, useState } from 'react';

const ProposalForm = ({}) => {
  const { formData, handleChange, handleSave, formErrors, success } = useProposalForm();
  const [kits, setKits] = useState([]);
  const [selectedKits, setSelectedKits] = useState([]);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const response = await KitSolarService.getKitSolar();
        console.log('response', response);
        setKits(response.results || []);
      } catch (error) {
        console.error('Erro ao buscar kits solares', error);
        setKits([]);
      }
    };
    fetchKits();
  }, []);

  const handleKitSelection = (kitId) => {
    setSelectedKits((prevSelectedKits) => {
      if (prevSelectedKits.includes(kitId)) {
        return prevSelectedKits.filter((id) => id !== kitId);
      } else {
        return [...prevSelectedKits, kitId];
      }
    });
    handleChange('kits', selectedKits);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <CustomFormLabel htmlFor="leads">Lead</CustomFormLabel>
        <AutoCompleteLead
          onChange={(id) => handleChange('lead_id', id)}
          value={formData.lead_id}
          {...(formErrors.lead_id && { error: true, helperText: formErrors.lead_id })}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomFormLabel htmlFor="created_by_id">Criado por</CustomFormLabel>
        <AutoCompleteUser
          label="Criado por"
          onChange={(id) => handleChange('created_by_id', id)}
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
          {kits.length > 0 ? (
            kits.map((kit) => (
              <Grid item xs={12} sm={6} md={6} key={kit.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderColor: selectedKits.includes(kit.id) ? 'primary.main' : 'grey.400',
                    borderWidth: selectedKits.includes(kit.id) ? 2 : 1,
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
                      {kit.inversors_model.description}
                    </Typography>
                    <Typography variant="subtitle1" color="text.primary" fontWeight="bold">
                      {`Preço: R$ ${Math.round(kit.price).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    </Typography>
                  </CardContent>
                  <Checkbox
                    checked={selectedKits.includes(kit.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleKitSelection(kit.id);
                    }}
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      color: selectedKits.includes(kit.id) ? 'primary.main' : 'grey.400',
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
