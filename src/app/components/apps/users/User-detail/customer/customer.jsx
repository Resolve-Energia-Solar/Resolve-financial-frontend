'use client';

import { Grid, Button, Stack, CircularProgress, useTheme } from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import { useParams } from 'next/navigation';

import useUser from '@/hooks/users/useUser';
import FormPageSkeleton from '@/app/components/apps/comercial/sale/components/FormPageSkeleton';

export default function DetailCustomer({ userId = null }) {
  const theme = useTheme();
  const params = useParams();
  let id = userId;
  if (!userId) id = params.id;

  const { loading, error, userData } = useUser(id);

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
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="username">Usuário</CustomFormLabel>
          <CustomFormLabel
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {userData.username}
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="first_name">Nome</CustomFormLabel>
          <CustomFormLabel
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {userData.first_name}
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomFormLabel
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {userData.email}
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="complete_name">Nome Completo</CustomFormLabel>
          <CustomFormLabel
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {userData.complete_name}
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="first_document">CPF</CustomFormLabel>
          <CustomFormLabel
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {userData.first_document}
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="gender">Gênero</CustomFormLabel>
          <CustomFormLabel
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {gender_options.find((opt) => opt.value === userData.gender)?.label || 'Não informado'}
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="status">Status</CustomFormLabel>
          <CustomFormLabel
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {status_options.find((opt) => opt.value === userData.is_active)?.label || 'Indefinido'}
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="birth_date">Data de Nascimento</CustomFormLabel>
          <CustomFormLabel
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            {userData.birth_date || 'Não informado'}
          </CustomFormLabel>
        </Grid>
      </Grid>
    </>
  );
}
