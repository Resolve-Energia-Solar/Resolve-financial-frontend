'use client';
import React from "react";

import {
  Button,
  Grid,
  Stack
} from "@mui/material";

import useCategoryForm from '@/hooks/inspections/category/useCategoryForm';

import { useRouter } from 'next/navigation';

import Alert from '@mui/material/Alert';
import AutoCompleteUsers from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Users';
import AutoCompleteCategory from "@/app/components/apps/inspections/auto-complete/Auto-Input-Category";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";

const CategoryForm = () => {
  const router = useRouter();

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useCategoryForm();

  if (success) {
    router.push('/apps/inspections/category');
  }

  return (
    <PageContainer title={'Criação de Categoria'} description={'Formulário para criar nova Categoria'}>
      <Breadcrumb title="Criar Categoria" />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          A categoria foi criada com sucesso!
        </Alert>
      )}
      <ParentCard title="Nova Categoria">
        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} lg={6}>
            <CustomFormLabel htmlFor="name">Nome da Categoria</CustomFormLabel>
            <CustomTextField
              name="name"
              variant="outlined"
              fullWidth
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={6}>
            <CustomFormLabel htmlFor="category">Categoria Principal</CustomFormLabel>
            <AutoCompleteCategory
              fullWidth
              onChange={(id) => handleChange('main_category', id)}
              {...(formErrors.main_category && { error: true, helperText: formErrors.main_category })}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomFormLabel htmlFor="members">Membros</CustomFormLabel>
            <AutoCompleteUsers
              fullWidth
              onChange={(ids) => handleChange('members', ids)}
              {...(formErrors.members && { error: true, helperText: formErrors.members })}
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

export default CategoryForm;
