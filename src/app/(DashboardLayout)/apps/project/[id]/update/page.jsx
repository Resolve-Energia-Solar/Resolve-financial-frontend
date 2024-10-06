'use client';
import { Grid, Button, Stack, FormControlLabel } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import ParentCard from '@/app/components/shared/ParentCard';
import { useParams } from 'next/navigation';
import Alert from '@mui/material/Alert';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-User';
import AutoCompleteSale from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-Sales';
import AutoCompleteAddress from '@/app/components/apps/comercial/sale/auto-complete/Auto-Input-Addresses';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import FormDate from '@/app/components/forms/form-custom/FormDate';

import useProject from '@/hooks/projects/useProject';
import useProjectForm from '@/hooks/projects/useProjectForm';

export default function FormCustom() {
  const params = useParams();
  const { id } = params;

  const { loading, error, projectData } = useProject(id);

  console.log('projectData', projectData);

  const { formData, handleChange, handleSave, formErrors, success } = useProjectForm(
    projectData,
    id,
  );

  const { formattedValue, handleValueChange } = useCurrencyFormatter(formData.totalValue);

  console.log('formData', formData);

  const supply_type_options = [
    { value: 'M', label: 'Monofásico' },
    { value: 'B', label: 'Bifásico' },
    { value: 'T', label: 'Trifásico' },
  ];

  const status_options = [
    { value: 'P', label: 'Pendente' },
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Edição de projeto" description="Editor de Projetos">
      <Breadcrumb title="Editar projeto" />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O projeto foi atualizada com sucesso!
        </Alert>
      )}
      <ParentCard title="Projeto">
        <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Venda</CustomFormLabel>
            <AutoCompleteSale
              onChange={(id) => handleChange('sale_id', id)}
              value={formData.sale_id}
              {...(formErrors.sale_id && { error: true, helperText: formErrors.sale_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Projetista</CustomFormLabel>
            <AutoCompleteUser
              onChange={(id) => handleChange('designer_id', id)}
              value={formData.designer_id}
              {...(formErrors.designer_id && { error: true, helperText: formErrors.designer_id })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Homologador</CustomFormLabel>
            <AutoCompleteUser
              onChange={(id) => handleChange('homologator_id', id)}
              value={formData.homologator_id}
              {...(formErrors.homologator_id && {
                error: true,
                helperText: formErrors.homologator_id,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="valor">KWp</CustomFormLabel>
            <CustomTextField
              name="kwp"
              variant="outlined"
              fullWidth
              value={formData.kwp}
              onChange={(e) => handleChange('kwp', e.target.value)}
              {...(formErrors.kwp && { error: true, helperText: formErrors.kwp })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormSelect
              label="Status"
              options={status_options}
              value={formData.status}
              onChange={(e) => handleChange('supply_type', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormSelect
              label="Tipo de Fornecimento"
              options={supply_type_options}
              value={formData.supply_type}
              onChange={(e) => handleChange('supply_type', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormDate
              label="Data de Início"
              name="start_date"
              value={formData.start_date}
              onChange={(newValue) => handleChange('start_date', newValue)}
              {...(formErrors.start_date && { error: true, helperText: formErrors.start_date })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <FormDate
              label="Data de Término"
              name="end_date"
              value={formData.end_date}
              onChange={(newValue) => handleChange('end_date', newValue)}
              {...(formErrors.end_date && { error: true, helperText: formErrors.end_date })}
            />
          </Grid>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Endereço</CustomFormLabel>
            <AutoCompleteAddress
              onChange={(id) => handleChange('addresses_ids', id)}
              value={formData.addresses_ids}
              {...(formErrors.addresses_ids && { error: true, helperText: formErrors.addresses_ids })}
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
