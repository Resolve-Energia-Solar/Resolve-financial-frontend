'use client';
import { Grid, Button, Stack, FormControlLabel } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import { useParams } from 'next/navigation';
import Alert from '@mui/material/Alert';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

import useFinancialRecord from '@/hooks/financial_record/useFinancialRecord';
import useFinancialRecordForm from '@/hooks/financial_record/useFinancialRecordForm';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Editar Contas a Pagar',
  },
];

export default function FormCustom() {
  const params = useParams();
  const { id } = params;

  const { loading, error, financialRecordData } = useFinancialRecord(id);

  console.log('financialRecordData', financialRecordData);

  const { formData, handleChange, handleSave, formErrors, success } = useFinancialRecordForm(
    financialRecordData,
    id,
  );

  console.log('formData', formData);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Edição de Contas a Receber/Pagar" description="Editor de Departamentos">
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          A Conta a Receber/Pagar foi atualizada com sucesso!
        </Alert>
      )}
      <ParentCard title="Contas a Receber/Pagar">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="name">Nome da Contas a Receber/Pagar</CustomFormLabel>
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
