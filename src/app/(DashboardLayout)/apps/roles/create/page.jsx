'use client';
import { Grid, Button, Stack, Alert } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useRoleForm from '@/hooks/role/useRoleForm';
import { useRouter } from 'next/navigation';

export default function FormCustom() {
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useRoleForm();

  const router = useRouter();

  if (success) {
    router.push('/apps/roles');
  }

  return (
    <PageContainer title="Criação de Cargo" description="Editor de Cargos">
      <Breadcrumb title="Criar Cargo" />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O cargo foi criado com sucesso!
        </Alert>
      )}
      <ParentCard title="Cargo">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="name">Nome do Cargo</CustomFormLabel>
            <CustomTextField
              name="name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
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
