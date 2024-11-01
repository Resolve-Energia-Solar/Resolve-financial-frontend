import { Grid, TextField, Box, Button, Typography, Snackbar, Alert, Switch } from '@mui/material';
import useKitForm from '@/hooks/kits/usekitForm';
import AutoCompleteBranch from '../../comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteModule from '../../materials/autoCompleteModule';
import AutoCompleteInversor from '../../materials/autoCompleteInversor';
import AutoCompleteRoofType from '../../roof/autoCompleteRoof';
const AddKitForm = ({ onCancel, onSave }) => {
  const { formData, handleChange, handleSave, formErrors, snackbar, closeSnackbar } = useKitForm();

  const handleFormSubmit = async () => {
    await handleSave();
    if (snackbar.severity === 'success') {
      onSave(formData);
    }
  };

  return (
    <Box component="form" sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
        Adicionar Novo Kit Personalizado
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <AutoCompleteInversor
            onChange={(id) => handleChange('inversors_model_id', id)}
            value={formData.inversors_model_id}
            error={!!formErrors.inversors_model_id}
            helperText={formErrors.inversors_model_id}
          />
        </Grid>
        <Grid item xs={6}>
          <AutoCompleteModule
            onChange={(id) => handleChange('modules_model_id', id)}
            value={formData.modules_model_id}
            error={!!formErrors.modules_model_id}
            helperText={formErrors.modules_model_id}
          />
        </Grid>
        <Grid item xs={6}>
          <AutoCompleteBranch
            onChange={(id) => handleChange('branch_id', id)}
            value={formData.branch_id}
            {...(formErrors.branch_id && { error: true, helperText: formErrors.branch_id })}
          />
        </Grid>
        <Grid item xs={6}>
          <AutoCompleteRoofType
            onChange={(id) => handleChange('roof_type_id', id)}
            value={formData.roof_type_id}
            {...(formErrors.roof_type_id && { error: true, helperText: formErrors.roof_type_id })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Quantidade de Inversores"
            type="number"
            fullWidth
            required
            value={formData.inversor_amount}
            onChange={(e) => handleChange('inversor_amount', e.target.value)}
            error={!!formErrors.inversor_amount}
            helperText={formErrors.inversor_amount}
            inputProps={{ min: 0, max: 65535 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Quantidade de Módulos"
            type="number"
            fullWidth
            required
            value={formData.modules_amount}
            onChange={(e) => handleChange('modules_amount', e.target.value)}
            error={!!formErrors.modules_amount}
            helperText={formErrors.modules_amount}
            inputProps={{ min: 0, max: 65535 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Preço"
            type="number"
            fullWidth
            required
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            error={!!formErrors.price}
            helperText={formErrors.price}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Descrição Técnica do Inversor"
            fullWidth
            value={formData.inversors_model_technical_description}
            onChange={(e) => handleChange('inversors_model_technical_description', e.target.value)}
            error={!!formErrors.inversors_model_technical_description}
            helperText={formErrors.inversors_model_technical_description}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Descrição Técnica do Módulo"
            fullWidth
            value={formData.modules_model_technical_description}
            onChange={(e) => handleChange('modules_model_technical_description', e.target.value)}
            error={!!formErrors.modules_model_technical_description}
            helperText={formErrors.modules_model_technical_description}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Unidade de Medida"
            fullWidth
            required
            value={formData.measure_unit}
            onChange={(e) => handleChange('measure_unit', e.target.value)}
            error={!!formErrors.measure_unit}
            helperText={formErrors.measure_unit}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Tipo Atual"
            fullWidth
            value={formData.current_type}
            onChange={(e) => handleChange('current_type', e.target.value)}
            error={!!formErrors.current_type}
            helperText={formErrors.current_type}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Categoria do Tipo Atual"
            fullWidth
            value={formData.current_type_category}
            onChange={(e) => handleChange('current_type_category', e.target.value)}
            error={!!formErrors.current_type_category}
            helperText={formErrors.current_type_category}
          />
        </Grid>
        <Grid item xs={12} display="flex" alignItems="center">
          <Typography variant="body1" sx={{ mr: 2 }}>
            Padrão:
          </Typography>
          <Switch
            checked={formData.is_default}
            onChange={(e) => handleChange('is_default', e.target.checked)}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          Salvar Kit
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
    </Box>
  );
};

export default AddKitForm;
