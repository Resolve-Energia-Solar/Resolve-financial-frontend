'use client';
import React, {
  useEffect,
} from "react";
import { useRouter } from 'next/navigation';

/* material */
import {
  Grid,
  Button,
  Stack,
  Alert
} from '@mui/material';

/* components */
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

/* hooks */
import useDeadlineForm from "@/hooks/inspections/deadline/useDeadlineForm";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import FormTimePicker from "@/app/components/forms/form-custom/FormTimePicker";

const DeadlineForm = () => {
  const router = useRouter();

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useDeadlineForm();

  useEffect(() => {
    if (success) {
      router.push('/apps/inspections/deadline');
    }
  }, [success, router]);

  return (
    <PageContainer
      title='Criação de Prazo'
    >
      <Breadcrumb
        title="Criar Prazo"
        description="Criador de Prazos"
      />
      {success && <Alert severity="success" sx={{ marginBottom: 3 }}>Prazo criado com sucesso!</Alert>}
      <ParentCard title='Novo Prazo'>
        <Grid container spacing={3}>

          {/* Name */}
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel
              htmlFor="deadline_name"
            >
              Nome
            </CustomFormLabel>
            <CustomTextField
              name="deadline_name"
              variant="outlined"
              required
              fullWidth
              onChange={(e) => handleChange('deadline_name', e.target.value)}
              {...(formErrors.deadline_name && { error: true, helperText: formErrors.deadline_name })}
            />
          </Grid>

          {/* Hours */}
          <Grid item xs={12} sm={12} lg={6}>
            <FormTimePicker
              label="Horas"
              name="deadline_hours"
              value={formData.deadline_hours}
              onChange={(newValue) => handleChange('deadline_hours', newValue)}
              {...(formErrors.deadline_hours && { error: true, helperText: formErrors.deadline_hours })}
            />
          </Grid>

          {/* Observation */}
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="deadline_observation">
              Observação
            </CustomFormLabel>
            <CustomTextField
              name="deadline_observation"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              onChange={(e) => handleChange('deadline_observation', e.target.value)}
              {...(formErrors.deadline_observation && { error: true, helperText: formErrors.deadline_observation })}
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
};

export default DeadlineForm;
