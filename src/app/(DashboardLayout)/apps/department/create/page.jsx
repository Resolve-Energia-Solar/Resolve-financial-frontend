'use client';
import { Grid, Button, Stack } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

import useDepartmentForm from '@/hooks/department/useDepartmentForm';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Criar Departamento',
  },
];

export default function FormCustom() {
  const router = useRouter();
  const { formData, handleChange, handleSave, formErrors, success } = useDepartmentForm();

  if (success) {
    router.push('/apps/department');
  }

  return (
    <PageContainer
      title="Criação de Departamento"
      description="Formulário para criar novo departamento"
    >
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O departamento foi criado com sucesso!
        </Alert>
      )}
      <ParentCard title="Novo Departamento">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="name">Nome do Departamento</CustomFormLabel>
            <CustomTextField
              name="name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Criar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}
