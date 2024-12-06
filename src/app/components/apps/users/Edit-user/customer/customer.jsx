'use client';
import { Grid, Button, Stack, Alert, CircularProgress } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import { useParams } from 'next/navigation';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDate from '@/app/components/forms/form-custom/FormDate';

import useUser from '@/hooks/users/useUser';
import useUserForm from '@/hooks/users/useUserForm';
import FormPageSkeleton from '@/app/components/apps/comercial/sale/components/FormPageSkeleton';

export default function EditCustomer({ userId = null }) {
  const params = useParams();
  let id = userId;
  if (!userId) id = params.id;

  const { loading, error, userData } = useUser(id);

  console.log('userData', userData);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = useUserForm(userData, id);

  console.log('formData', formData);

  const gender_options = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'O', label: 'Outro' },
  ];

  const status_options = [
    { value: true, label: 'Ativo' },
    { value: false, label: 'Inativo' },
  ];

  if (loading) return <FormPageSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <>
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Usuário editado com sucesso!
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="username">Usuário</CustomFormLabel>
          <CustomTextField
            name="username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            {...(formErrors.username && { error: true, helperText: formErrors.username })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="first_name">Nome</CustomFormLabel>
          <CustomTextField
            name="first_name"
            variant="outlined"
            fullWidth
            value={formData.first_name}
            onChange={(e) => handleChange('first_name', e.target.value)}
            {...(formErrors.first_name && { error: true, helperText: formErrors.first_name })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomTextField
            name="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            {...(formErrors.email && { error: true, helperText: formErrors.email })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="email">Nome Completo</CustomFormLabel>
          <CustomTextField
            name="complete_name"
            variant="outlined"
            fullWidth
            value={formData.complete_name}
            onChange={(e) => handleChange('complete_name', e.target.value)}
            {...(formErrors.complete_name && { error: true, helperText: formErrors.complete_name })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="email">CPF</CustomFormLabel>
          <CustomTextField
            name="first_document"
            variant="outlined"
            fullWidth
            value={formData.first_document}
            onChange={(e) => handleChange('first_document', e.target.value)}
            {...(formErrors.first_document && {
              error: true,
              helperText: formErrors.first_document,
            })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Gênero"
            options={gender_options}
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            {...(formErrors.gender && { error: true, helperText: formErrors.gender })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status"
            options={status_options}
            value={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.value)}
            {...(formErrors.is_active && { error: true, helperText: formErrors.is_active })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormDate
            label="Data de Nascimento"
            name="birth_date"
            value={formData.birth_date}
            onChange={(newValue) => handleChange('birth_date', newValue)}
            {...(formErrors.birth_date && { error: true, helperText: formErrors.birth_date })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={formLoading}
              endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {formLoading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
