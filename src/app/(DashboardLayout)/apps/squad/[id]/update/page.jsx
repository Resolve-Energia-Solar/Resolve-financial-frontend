'use client';
import { Grid, Button, Stack, Alert } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import ParentCard from '@/app/components/shared/ParentCard';
import { useParams } from 'next/navigation';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUsers from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-Users';
import useSquad from '@/hooks/squad/useSquad';
import useSquadForm from '@/hooks/squad/useSquadForm';

export default function SquadForm() {
  const params = useParams();
  const { id } = params;

  const { loading, error, squadData } = useSquad(id);

  const { formData, handleChange, handleSave, formErrors, success } = useSquadForm(
    squadData,
    id,
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Edição de Squad" description="Editor de Squads">
      <Breadcrumb title="Editar Squad" />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O squad foi atualizado com sucesso!
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
                Editar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}
