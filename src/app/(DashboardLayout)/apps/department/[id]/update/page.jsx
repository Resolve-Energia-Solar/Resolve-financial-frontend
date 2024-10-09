'use client';
import { Grid, Button, Stack, FormControlLabel } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import { useParams } from 'next/navigation';
import Alert from '@mui/material/Alert';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

import useDepartment from '@/hooks/department/useDepartment';
import useDepartmentForm from '@/hooks/department/useDepartmentForm';

export default function FormCustom() {
  const params = useParams();
  const { id } = params;

  const { loading, error, departmentData } = useDepartment(id);

  console.log('departmentData', departmentData);

  const { formData, handleChange, handleSave, formErrors, success } = useDepartmentForm(
    departmentData,
    id,
  );

  console.log('formData', formData);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Edição de Departamento" description="Editor de Departamentos">
      <Breadcrumb title="Editar Departamento" />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O departamento foi atualizado com sucesso!
        </Alert>
      )}
      <ParentCard title="Departamento">
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
                Editar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}
