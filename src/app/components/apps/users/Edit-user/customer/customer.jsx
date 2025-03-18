'use client';
import { Grid, Button, Stack, Alert, CircularProgress, TextField } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import { useParams } from 'next/navigation';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDate from '@/app/components/forms/form-custom/FormDate';

import useUser from '@/hooks/users/useUser';
import useUserForm from '@/hooks/users/useUserForm';
import FormPageSkeleton from '@/app/components/apps/comercial/sale/components/FormPageSkeleton';
import { useSelector } from 'react-redux';

export default function EditCustomer({ userId = null }) {
  const loggedUser = useSelector(state => state.user?.user);
  const isSuperUser = loggedUser?.is_superuser;
  const params = useParams();
  let id = userId;
  if (!userId) id = params.id;

  const { loading, error, userData } = useUser(id);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = useUserForm(userData, id);

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

  const formatDocument = (value) => {
    const numeric = value.replace(/\D/g, '');
    if (numeric.length <= 11) {
      // Formata como CPF: 000.000.000-00
      return numeric
        .substring(0, 3) + (numeric.length > 3 ? '.' : '') +
        numeric.substring(3, 6) + (numeric.length > 6 ? '.' : '') +
        numeric.substring(6, 9) + (numeric.length > 9 ? '-' : '') +
        numeric.substring(9, 11);
    } else {
      // Formata como CNPJ: 00.000.000/0000-00
      return numeric
        .substring(0, 2) + (numeric.length > 2 ? '.' : '') +
        numeric.substring(2, 5) + (numeric.length > 5 ? '.' : '') +
        numeric.substring(5, 8) + (numeric.length > 8 ? '/' : '') +
        numeric.substring(8, 12) + (numeric.length > 12 ? '-' : '') +
        numeric.substring(12, 14);
    }
  };

  return (
    <>
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Usuário editado com sucesso!
        </Alert>
      )}
      <Grid container spacing={3}>
        {isSuperUser ? (
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="email">E-mail</CustomFormLabel>
            <CustomTextField
              name="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              {...(formErrors.email && { error: true, helperText: formErrors.email })}
            />
          </Grid>
        ) : (
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="email">E-mail</CustomFormLabel>
            <TextField fullWidth value={formData.email} disabled />
          </Grid>
        )}
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
        {isSuperUser ? (
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="first_document">CPF</CustomFormLabel>
            <CustomTextField
              name="first_document"
              variant="outlined"
              fullWidth
              value={formData.first_document}
              onChange={(e) => handleChange('first_document', e.target.value)}
              disabled={!isSuperUser}
              {...(formErrors.first_document && {
                error: true,
                helperText: formErrors.first_document,
              })}
            />
          </Grid>
        ) : (
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="first_document">CPF</CustomFormLabel>
            <TextField fullWidth value={formatDocument(formData.first_document)} disabled />
          </Grid>
        )}
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Gênero"
            options={gender_options}
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            {...(formErrors.gender && { error: true, helperText: formErrors.gender })}
          />
        </Grid>
        {/* <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status"
            options={status_options}
            value={formData.is_active}
            onChange={(e) => handleChange('is_active', e.target.value)}
            {...(formErrors.is_active && { error: true, helperText: formErrors.is_active })}
          />
        </Grid> */}
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
