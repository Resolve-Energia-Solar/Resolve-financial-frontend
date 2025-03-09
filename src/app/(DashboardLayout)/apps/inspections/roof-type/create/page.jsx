'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* material */
import { Grid, Button, Stack, Alert } from '@mui/material';

/* components */
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

/* hooks */
import useRoofTypeForm from '@/hooks/inspections/roof-type/useRoofTypeForm';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Criar Tipo de Tenhado',
  },
];

const RoofTypeForm = () => {
  const router = useRouter();

  const { formData, handleChange, handleSave, formErrors, success } = useRoofTypeForm();

  useEffect(() => {
    if (success) {
      router.push('/apps/inspections/roof-type');
    }
  }, [success, router]);

  return (
    <PageContainer
      title="Criação de Tipo de Telhado"
      description="Formulário para criar novo Tipo de Telhado"
    >
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O tipo de telhado foi criado com sucesso!
        </Alert>
      )}
      <ParentCard title="Novo Tipo de Telhado">
        <Grid container spacing={2}>
          {/* Nome do Tipo de Telhado */}
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="rooftype">Tipo de Telhado</CustomFormLabel>
            <CustomTextField
              name="rooftype"
              placeholder="Digite o tipo de telhado"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          {/* Botão de Salvar */}
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

export default RoofTypeForm;
