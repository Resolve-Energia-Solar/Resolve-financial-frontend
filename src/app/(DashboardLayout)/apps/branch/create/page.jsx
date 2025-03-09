'use client';
import { Grid, Button, Stack, FormControlLabel } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import AutoCompleteAddress from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Address';
import useBranchForm from '@/hooks/branch/useBranchForm';
import { useRouter } from 'next/navigation';
import ParentCard from '@/app/components/shared/ParentCard';
import Alert from '@mui/material/Alert';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUsers from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Users';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Unidades',
  },
];

export default function BranchForm() {
  const router = useRouter();

  const { handleChange, handleSave, formErrors, success } = useBranchForm();

  if (success) {
    router.push('/apps/branch');
  }

  return (
    <PageContainer title="Criação de Franquias" description="Criador de Franquias">
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          A franquia foi criada com sucesso!
        </Alert>
      )}
      <ParentCard title="Franquias">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">Franquia</CustomFormLabel>
            <CustomTextField
              name="name"
              placeholder="Nome da Franquia"
              fullWidth
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
            <AutoCompleteAddress
              fullWidth
              onChange={(id) => handleChange('address_id', id)}
              {...(formErrors.address_id && { error: true, helperText: formErrors.address_id })}
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="owners">Proprietários</CustomFormLabel>
            <AutoCompleteUsers
              fullWidth
              onChange={(ids) => handleChange('owners_ids', ids)}
              {...(formErrors.owners_ids && { error: true, helperText: formErrors.owners_ids })}
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
