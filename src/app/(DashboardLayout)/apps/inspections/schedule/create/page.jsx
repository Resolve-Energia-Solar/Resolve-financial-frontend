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
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

/* hooks */
import useSheduleForm from '@/hooks/inspections/schedule/useScheduleForm';

const ScheduleForm = () => {
  const router = useRouter();

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useSheduleForm();

  useEffect(() => {
    if (success) {
      router.push('/apps/inspections/schedule');
    }
  }, [success, router]);

  return (
    <PageContainer>
      <Breadcrumb
        title="Criar Agendamento"
        description=''
      />
      {success && <Alert severity="success" sx={{ marginBottom: 3 }}>Agendamento criado com sucesso!</Alert>}
      <ParentCard title='Novo Agendamento'>
        <Grid container spacing={2}>
          {/* Nome do Agendamento */}
          

          {/* Botão de Salvar */}
          <Grid item xs={12} sm={12} lg={12}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Salvar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}

export default ScheduleForm;
