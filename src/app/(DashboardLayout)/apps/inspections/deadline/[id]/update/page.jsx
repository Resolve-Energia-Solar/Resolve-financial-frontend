'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

/* material */
import { Grid, Button, Stack, Alert } from '@mui/material';

/* components */
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';

/* hooks */
import useDeadline from '@/hooks/inspections/deadline/useDeadline';
import useDeadlineForm from '@/hooks/inspections/deadline/useDeadlineForm';
import ParentCard from '@/app/components/shared/ParentCard';

const DeadlineForm = () => {
  const params = useParams();
  const { id } = params;

  const { loading, error, deadlineData } = useDeadline(id);

  const { formData, handleChange, handleSave, formErrors, success } = useDeadlineForm(
    deadlineData,
    id,
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title={'Edição de Prazo'} description={'Editor de Prazo'}>
      <Breadcrumb title={'Editar Prazo'} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          Prazo atualizado com sucesso!
        </Alert>
      )}
      <ParentCard title="Prazo">
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">Nome do Prazo</CustomFormLabel>
            <CustomTextField
              name="name"
              variant="outlined"
              fullWidth
              value={formData.deadline_name}
              onChange={(e) => handleChange('deadline_name', e.target.value)}
              {...(formErrors.deadline_name && {
                error: true,
                helperText: formErrors.deadline_name,
              })}
            />
          </Grid>

          {/* Hours */}
          <Grid item xs={12} sm={12} lg={6}>
            <FormTimePicker
              label="Horas"
              name="deadline_hours"
              value={formData.deadline_hours}
              onChange={(newValue) => handleChange('deadline_hours', newValue)}
              {...(formErrors.deadline_hours && {
                error: true,
                helperText: formErrors.deadline_hours,
              })}
            />
          </Grid>

          {/* Observation */}
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="observation">Observação</CustomFormLabel>
            <CustomTextField
              name="observation"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={formData.deadline_observation}
              onChange={(e) => handleChange('deadline_observation', e.target.value)}
              {...(formErrors.deadline_observation && {
                error: true,
                helperText: formErrors.deadline_observation,
              })}
            />
          </Grid>

          {/* Botão de Ação */}
          <Grid item xs={12} sm={12} lg={12}>
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
};

export default DeadlineForm;
