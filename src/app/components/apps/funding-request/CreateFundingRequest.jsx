import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material';
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
  disabledManaging,
}) => {
  return (
    <Box sx={{ marginBottom: 4, overflow: 'auto', height: '100vh', paddingBottom: 30 }}>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5">Contratante</Typography>
        <Divider sx={{ marginTop: 2 }} />
        <Grid container spacing={3} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={12} lg={4}>
            <FormSelect
              name="person_type"
              label="Tipo de Pessoa *"
              options={[
                { value: 'PJ', label: 'PJ' },
                { value: 'PF', label: 'PF' },
              ]}
              value={formData?.person_type}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="first_document">
              {formData?.person_type == 'PF'
                ? 'CPF (Digite os 11 digitos)*'
                : 'CNPJ * (Digite os 14 digitos)'}
            </CustomFormLabel>
            <CustomTextField
              name="first_document"
              variant="outlined"
              value={formData?.first_document}
              fullWidth
              max={formData?.person_type == 'PF' ? 11 : 14}
              min={formData?.person_type == 'PF' ? 11 : 14}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="complete_name">Nome Completo *</CustomFormLabel>
            <CustomTextField
              name="complete_name"
              variant="outlined"
              value={formData?.complete_name}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="email">E-mail *</CustomFormLabel>
            <CustomTextField
              name="email"
              variant="outlined"
              value={formData?.email}
              fullWidth
              onChange={handleChange}
            />
          </Grid>

          {formData?.person_type === 'PF' && (
            <Grid item xs={12} sm={12} lg={4}>
              <FormDate
                label="Data de Nascimento *"
                name="birth_date"
                value={formData?.birth_date}
                onChange={(newValue) =>
                  handleChange({ target: { value: newValue, name: 'birth_date' } })
                }
              />
            </Grid>
          )}

          <Grid item xs={12} sm={12} lg={4}>
            <FormSelect
              name="gender"
              label="Gênero"
              disabled={formData?.person_type === 'PJ' && true}
              value={formData?.person_type === 'PF' ? formData?.gender : 'O'}
              options={[
                { value: 'M', label: 'Masculino' },
                { value: 'F', label: 'Feminino' },
                { value: 'O', label: 'Empresa' },
              ]}
              onChange={handleChange}
            />
          </Grid>

          {formData?.person_type === 'PF' && (
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="occupation">Ocupação *</CustomFormLabel>
              <CustomTextField
                name="occupation"
                variant="outlined"
                value={rFormData?.occupation}
                fullWidth
                onChange={handleChangeRFormData}
                required={formData?.person_type === 'PF'}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="monthly_income">
              {formData?.person_type === 'PF' ? 'Renda Comprovada *' : 'Faturamento Médio *'}
            </CustomFormLabel>
            <CustomTextField
              name="monthly_income"
              variant="outlined"
              value={rFormData?.monthly_income}
              fullWidth
              onChange={handleChangeRFormData}
            />
          </Grid>
        </Grid>
      </Box>
      {formData?.person_type == 'PJ' && (
        <>
          <Box>
            <Typography variant="h5">Sócio Administrador</Typography>
            <Divider sx={{ marginTop: 2 }} />
            <Grid container spacing={3} sx={{ marginBottom: 2 }}>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="person_type">Natureza</CustomFormLabel>
                <CustomTextField
                  disabled={true}
                  name="person_type"
                  variant="outlined"
                  value={'PF'}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="first_document">CPF</CustomFormLabel>
                <CustomTextField
                  name="first_document"
                  variant="outlined"
                  value={formDataManaging?.first_document}
                  min={11}
                  max={11}
                  fullWidth
                  onChange={handleChangeManaging}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="complete_name">Nome Complete</CustomFormLabel>
                <CustomTextField
                  name="complete_name"
                  variant="outlined"
                  value={formDataManaging?.complete_name}
                  fullWidth
                  onChange={handleChangeManaging}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="email">E-mail</CustomFormLabel>
                <CustomTextField
                  name="email"
                  variant="outlined"
                  value={formDataManaging?.email}
                  fullWidth
                  onChange={handleChangeManaging}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <FormDate
                  label="Data de Nascimento"
                  name="birth_date"
                  value={formDataManaging?.birth_date}
                  onChange={(newValue) =>
                    handleChangeManaging({ target: { value: newValue, name: 'birth_date' } })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={12} lg={4}>
                <FormSelect
                  name="gender"
                  label="Gênero"
                  value={formDataManaging?.gender}
                  options={[
                    { value: 'M', label: 'Masculino' },
                    { value: 'F', label: 'Feminino' },
                  ]}
                  onChange={handleChangeManaging}
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {children}
    </Box>
  );
};

export default CreateFundingRequest;
