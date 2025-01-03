'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { Button, Grid, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

// Hooks, Services and utils
import useServiceOpinionsForm from '@/hooks/inspections/service-opinions/useServiceOpinionsForm';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';

const ServiceOpinionsForm = () => {
  const router = useRouter();

  const { formData, handleChange, handleSave, formErrors, success } = useServiceOpinionsForm();

  // Breadcrumb
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      to: '/apps/inspections/service-opinions',
      title: 'Parecer do Serviço',
    },
    {
      title: 'Criar Parecer do Serviço',
    },
  ];

  useEffect(() => {
    if (success) {
      router.push('/apps/inspections/service-opinions');
    }
  }, [success, router]);

  return (
    <PageContainer
      title={'Criação de Parecer do Serviço'}
      description={'Formulário para criar novo Parecer do Serviço'}
    >
      <Breadcrumb title="Criar Parecer do Serviço" items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O parecer do serviço foi criado com sucesso!
        </Alert>
      )}
      <ParentCard title="Novo Parecer do Serviço">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="name">Nome do Parecer</CustomFormLabel>
            <CustomTextField
              name="name"
              variant="outlined"
              fullWidth
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="description">Serviço</CustomFormLabel>
            <AutoCompleteServiceCatalog
              fullWidth
              onChange={(id) => handleChange('service_id', id)}
              {...(formErrors.service_id && {
                error: true,
                helperText: formErrors.service_id,
              })}
            />
          </Grid>
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

export default ServiceOpinionsForm;
