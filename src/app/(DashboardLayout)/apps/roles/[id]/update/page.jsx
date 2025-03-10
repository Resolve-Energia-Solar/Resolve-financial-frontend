'use client';
import { Grid, Button, Stack, Alert } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useRoleForm from '@/hooks/role/useRoleForm';
import useRole from '@/hooks/role/useRole';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Editar Função',
  },
];

export default function FormCustom() {
  const params = useParams();
  const { id } = params;

  const { loading, error, roleData } = useRole(id);

  const { formData, handleChange, handleSave, formErrors, success } = useRoleForm(roleData, id);

  const router = useRouter();

  return (
    <PageContainer title="Edição de Função" description="Editor de Funções">
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          A função foi atualizada com sucesso!
        </Alert>
      )}
      <ParentCard title="Função">
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
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Salvar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}
