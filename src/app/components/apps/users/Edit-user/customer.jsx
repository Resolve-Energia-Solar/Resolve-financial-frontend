'use client';
import { Grid, Button, Stack, FormControlLabel, Alert } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import { useParams } from 'next/navigation';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteBranch from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteAddresses from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Addresses';
import AutoCompleteDepartament from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Departament';
import AutoCompleteRole from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Role';
import FormDate from '@/app/components/forms/form-custom/FormDate';

import useUser from '@/hooks/users/useUser';
import useUserForm from '@/hooks/users/useUserForm';
import FormPageSkeleton from '../../comercial/sale/components/FormPageSkeleton';

export default function EditCustomer({ userId = null }) {
  const params = useParams();
  let id = userId;
  if (!userId) id = params.id;

  const { loading, error, userData } = useUser(id);

  console.log('userData', userData);

  const { formData, handleChange, handleSave, formErrors, success } = useUserForm(userData, id);

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
    <Grid container spacing={3}>
      {success && (
        <Grid item xs={12}>
          <Alert severity="success">O usuário foi atualizado com sucesso!</Alert>
        </Grid>
      )}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="username">Nome de Usuário</CustomFormLabel>
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
        <FormSelect
          label="Gênero"
          options={gender_options}
          value={formData.gender}
          onChange={(e) => handleChange('gender', e.target.value)}
          {...(formErrors.gender && { error: true, helperText: formErrors.gender })}
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
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="phone">Telefone</CustomFormLabel>
        <CustomTextField
          name="phone"
          variant="outlined"
          fullWidth
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          {...(formErrors.phone && { error: true, helperText: formErrors.phone })}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
        <AutoCompleteAddresses
          onChange={(id) => handleChange('addresses_ids', id)}
          value={formData.addresses_ids}
          {...(formErrors.addresses_ids && { error: true, helperText: formErrors.addresses_ids })}
        />
      </Grid>

      <Grid item xs={12} sm={12} lg={12}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Editar
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
