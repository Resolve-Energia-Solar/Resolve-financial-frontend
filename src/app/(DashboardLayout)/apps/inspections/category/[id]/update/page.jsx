'use client';

import {
  Alert,
  Button,
  Grid,
  Stack,
} from '@mui/material';
import { useParams } from 'next/navigation';

import AutoCompleteCategory from '@/app/components/apps/inspections/auto-complete/Auto-Input-Category';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import useCategory from '@/hooks/inspections/category/useCategory';
import useCategoryForm from '@/hooks/inspections/category/useCategoryForm';
import AutoCompleteUsers from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Users';

const CategoryForm = () => {
  const params = useParams();
  const { id } = params;

  const { loading, error, categoryData } = useCategory(id);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useCategoryForm(categoryData, id);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Edição de Categoria" description="Editor de Categoria">
      <Breadcrumb title="Editar Categoria" />
      { success && <Alert severity="success" sx={{ marginBottom: 3 }}>A categoria foi atualizada com sucesso!</Alert>}
      <ParentCard title="Categoria">
        <Grid container spacing={3}>

          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">Categoria</CustomFormLabel>
            <CustomTextField
              name="name"
              placeholder="Nome da Categoria"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="category">Categoria Principal</CustomFormLabel>
            <AutoCompleteCategory
              fullWidth
              onChange={(id) => handleChange('main_category', id)}
              value={formData.main_category}
              {...(formErrors.main_category && { error: true, helperText: formErrors.main_category })}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomFormLabel htmlFor="members">Membros</CustomFormLabel>
            <AutoCompleteUsers
              fullWidth
              value={formData.members}
              onChange={(ids) => handleChange('members', ids)}
              {...(formErrors.members && { error: true, helperText: formErrors.members })}
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
};

export default CategoryForm;
