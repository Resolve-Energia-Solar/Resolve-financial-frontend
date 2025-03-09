'use client';
import { Grid, Button, Stack, Alert } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUsers from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Users';
import useSquad from '@/hooks/squad/useSquad';
import useSquadForm from '@/hooks/squad/useSquadForm';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Criar Squad',
  },
];

export default function SquadForm() {
  const { formData, handleChange, handleSave, formErrors, success } = useSquadForm();

  return (
    <PageContainer title="Criação de Squad" description="Criador de Squads">
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O squad foi criado com sucesso!
        </Alert>
      )}
      <ParentCard title="Squad">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="name">Nome do Squad</CustomFormLabel>
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
            <CustomFormLabel htmlFor="members">Membros</CustomFormLabel>
            <AutoCompleteUsers
              name="members"
              value={formData.members_ids}
              onChange={(value) => handleChange('members_ids', value)}
              {...(formErrors.members_ids && { error: true, helperText: formErrors.members_ids })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="description">Descrição</CustomFormLabel>
            <CustomTextField
              name="description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              {...(formErrors.description && { error: true, helperText: formErrors.description })}
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
