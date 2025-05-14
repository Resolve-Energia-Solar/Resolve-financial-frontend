import { Box, Divider, Grid, Typography, InputAdornment, CircularProgress } from '@mui/material';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import FormDate from '../../forms/form-custom/FormDate';
import FormSelect from '../../forms/form-custom/FormSelect';

const CreateFundingRequest = ({
  formData,
  handleChange,
  formDataManaging,
  handleChangeManaging,
  rFormData,
  handleChangeRFormData,
  children,
  disabled,
  disabledManaging,
  loadingUser,
}) => {
  const personTypeSelected = Boolean(formData?.person_type);

  return (
    <Box sx={{ mb: 4, overflow: 'auto', height: '100vh', pb: 30 }}>
      <Typography variant="h5">Contratante</Typography>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <FormSelect
            name="person_type"
            label="Tipo de Pessoa *"
            options={[{ value: 'PJ', label: 'PJ' }, { value: 'PF', label: 'PF' }]}
            value={formData?.person_type || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <CustomFormLabel htmlFor="first_document">
            {formData?.person_type === 'PF' ? 'CPF (11 dígitos) *' : 'CNPJ (14 dígitos) *'}
          </CustomFormLabel>
          <CustomTextField
            name="first_document"
            variant="outlined"
            value={formData?.first_document || ''}
            fullWidth
            onChange={handleChange}
            disabled={!personTypeSelected}
            InputProps={{
              endAdornment: loadingUser ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <CustomFormLabel htmlFor="complete_name">Nome Completo *</CustomFormLabel>
          <CustomTextField
            name="complete_name"
            variant="outlined"
            value={formData?.complete_name || ''}
            fullWidth
            onChange={handleChange}
            disabled={!personTypeSelected || loadingUser}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <CustomFormLabel htmlFor="email">E-mail *</CustomFormLabel>
          <CustomTextField
            name="email"
            variant="outlined"
            value={formData?.email || ''}
            fullWidth
            onChange={handleChange}
            disabled={!personTypeSelected || loadingUser}
          />
        </Grid>
        {formData?.person_type === 'PF' && (
          <Grid item xs={12} sm={6} lg={4}>
            <FormDate
              label="Data de Nascimento *"
              name="birth_date"
              value={formData?.birth_date || null}
              onChange={(newValue) => handleChange({ target: { name: 'birth_date', value: newValue } })}
              disabled={!personTypeSelected || loadingUser}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} lg={4}>
          <FormSelect
            name="gender"
            label="Gênero"
            options={[
              { value: 'M', label: 'Masculino' },
              { value: 'F', label: 'Feminino' },
              { value: 'O', label: 'Empresa' },
            ]}
            value={formData?.person_type === 'PF' ? formData?.gender || '' : 'O'}
            onChange={handleChange}
            disabled={!personTypeSelected || loadingUser}
          />
        </Grid>
        {formData?.person_type === 'PF' && (
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="occupation">Ocupação *</CustomFormLabel>
            <CustomTextField
              name="occupation"
              variant="outlined"
              value={rFormData?.occupation || ''}
              fullWidth
              onChange={handleChangeRFormData}
              disabled={!personTypeSelected}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} lg={4}>
          <CustomFormLabel htmlFor="monthly_income">
            {formData?.person_type === 'PF' ? 'Renda Comprovada *' : 'Faturamento Médio *'}
          </CustomFormLabel>
          <CustomTextField
            name="monthly_income"
            variant="outlined"
            value={rFormData?.monthly_income || ''}
            fullWidth
            onChange={handleChangeRFormData}
            disabled={!personTypeSelected}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <CustomFormLabel htmlFor="project_value">Valor do Projeto *</CustomFormLabel>
          <CustomTextField
            name="project_value"
            variant="outlined"
            value={rFormData?.project_value || ''}
            fullWidth
            onChange={handleChangeRFormData}
            disabled={!personTypeSelected}
          />
        </Grid>
      </Grid>

      {formData?.person_type === 'PJ' && (
        <>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Sócio Administrador
          </Typography>
          <Divider sx={{ mt: 2, mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={4}>
              <CustomFormLabel htmlFor="person_type">Natureza</CustomFormLabel>
              <CustomTextField
                name="person_type"
                variant="outlined"
                value="PF"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <CustomFormLabel htmlFor="first_document">CPF *</CustomFormLabel>
              <CustomTextField
                name="first_document"
                variant="outlined"
                value={formDataManaging?.first_document || ''}
                fullWidth
                onChange={handleChangeManaging}
                disabled={disabledManaging}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <CustomFormLabel htmlFor="complete_name">Nome Completo *</CustomFormLabel>
              <CustomTextField
                name="complete_name"
                variant="outlined"
                value={formDataManaging?.complete_name || ''}
                fullWidth
                onChange={handleChangeManaging}
                disabled={disabledManaging}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <CustomFormLabel htmlFor="email">E-mail *</CustomFormLabel>
              <CustomTextField
                name="email"
                variant="outlined"
                value={formDataManaging?.email || ''}
                fullWidth
                onChange={handleChangeManaging}
                disabled={disabledManaging}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <FormDate
                label="Data de Nascimento *"
                name="birth_date"
                value={formDataManaging?.birth_date || null}
                onChange={(newValue) =>
                  handleChangeManaging({ target: { name: 'birth_date', value: newValue } })
                }
                disabled={disabledManaging}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <FormSelect
                name="gender"
                label="Gênero *"
                options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }]}
                value={formDataManaging?.gender || ''}
                onChange={handleChangeManaging}
                disabled={disabledManaging}
              />
            </Grid>
          </Grid>
        </>
      )}

      {children}
    </Box>
  );
};

export default CreateFundingRequest;