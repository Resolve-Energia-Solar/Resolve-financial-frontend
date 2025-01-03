'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

// Components
import { Alert, Button, Grid, Snackbar, Stack } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

// Hooks, Services and utils
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import useServiceOpinions from '@/hooks/inspections/service-opinions/useServiceOpinions';
import useServiceOpinionsForm from '@/hooks/inspections/service-opinions/useServiceOpinionsForm';

const ServiceOpinionsFormEdit = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { loading, error, serviceOpinionData } = useServiceOpinions(id);

  const { formData, handleChange, handleSave, formErrors, success } = useServiceOpinionsForm(
    serviceOpinionData,
    id,
  );

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    if (success) {
      showAlert('O parecer do serviço foi atualizado com sucesso!', 'success');
      router.push('/apps/inspections/service-opinions');
    }
  }, [success]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <ParentCard title="Editar Parecer do Serviço">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="name">Nome do Parecer</CustomFormLabel>
            <CustomTextField
              name="name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="description">Serviço</CustomFormLabel>
            <AutoCompleteServiceCatalog
              fullWidth
              value={formData.service_id}
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
      {/* Alerta */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ServiceOpinionsFormEdit;
