import { Grid, TextField, MenuItem, Box, Button } from '@mui/material';
import AutoCompleteLead from '../../comercial/sale/components/auto-complete/Auto-Input-Leads';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useProposalForm from '@/hooks/proposals/useProposalForm';

const ProposalForm = ({
  saleData,
  setSaleData,
  sellers = [],
  sdrs = [],
  managers = [],
  supervisors = [],
  branches = [],
  campaigns = [],
  allUsers = [],
  leadData = [],
}) => {
  const { formData, handleChange, handleSave, formErrors, success } = useProposalForm();

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
        <TextField
          fullWidth
          label="Criado por"
          select
          value={formData.created_by_id || ''}
          onChange={(e) => handleChange('created_by_id', e.target.value)}
        >
          {allUsers.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.complete_name}
            </MenuItem>
          ))}
        </TextField>
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

      <Grid item xs={6}>
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

      <Grid item xs={6}>
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
        <TextField
          fullWidth
          label="Kits"
          type="number"
          value={formData.kits.join(', ') || ''}
          onChange={(e) => handleChange('kits', e.target.value.split(',').map((kit) => parseInt(kit.trim(), 10)))}
          helperText="Digite os IDs dos kits separados por vírgula"
          {...(formErrors.kits && { error: true, helperText: formErrors.kits })}
        />
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
