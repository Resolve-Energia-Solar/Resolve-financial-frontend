'use client';

import { Alert, Button, Grid, Stack } from '@mui/material';
import { useParams } from 'next/navigation';

/* components */
import AutoCompleteCategory from '@/app/components/apps/inspections/auto-complete/Auto-Input-Category';
import AutoCompleteDeadline from '@/app/components/apps/inspections/auto-complete/Auto-Input-Deadline';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

/* hooks */
import useServiceCatalog from '@/hooks/inspections/service-catalog/useServiceCatalog';
import useServiceCatalogForm from '@/hooks/inspections/service-catalog/useServiceCatalogForm';
import AutoCompleteFormBuilder from '@/app/components/apps/inspections/auto-complete/Auto-Input-FormBuilder';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Editar Serviço de Campo',
  },
];

const ServiceCatalogForm = () => {
  const params = useParams();
  const { id } = params;

  const { loading, error, serviceCatalogData } = useServiceCatalog(id);

  const { formData, handleChange, handleSave, formErrors, success } = useServiceCatalogForm(
    serviceCatalogData,
    id,
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Edição de Serviço" description="Editor de Serviço">
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O serviço foi atualizado com sucesso!
        </Alert>
      )}
      <ParentCard title="Serviço">
        <Grid container spacing={3}>
          {/* Nome do Serviço */}
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">Nome do Serviço</CustomFormLabel>
            <CustomTextField
              name="name"
              placeholder="Nome do Serviço"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          {/* Descrição */}
          <Grid item xs={12}>
            <CustomTextField
              label="Descrição"
              name="description"
              placeholder="Descrição do serviço"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              {...(formErrors.description && { error: true, helperText: formErrors.description })}
            />
          </Grid>

          {/* Categoria do Serviço*/}
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="category">Categoria</CustomFormLabel>
            <AutoCompleteCategory
              fullWidth
              onChange={(id) => handleChange('category_id', id)}
              value={formData.category_id}
              {...(formErrors.category_id && { error: true, helperText: formErrors.category_id })}
            />
          </Grid>

          {/* Prazo */}
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="deadline">Prazo</CustomFormLabel>
            <AutoCompleteDeadline
              fullWidth
              onChange={(id) => handleChange('deadline_id', id)}
              value={formData.deadline_id}
              {...(formErrors.deadline_id && { error: true, helperText: formErrors.deadline_id })}
            />
          </Grid>

          {/* Formulário */}
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="form">Formulário</CustomFormLabel>
            <AutoCompleteFormBuilder
              fullWidth
              onChange={(id) => handleChange('form_id', id)}
              value={formData.form_id}
              {...(formErrors.form_id && { error: true, helperText: formErrors.form_id })}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Salvar
            </Button>
          </Stack>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ServiceCatalogForm;
