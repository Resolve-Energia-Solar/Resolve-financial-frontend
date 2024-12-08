'use client';
import { Grid, Button, Stack } from '@mui/material';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import { useParams } from 'next/navigation';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteSale from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Sales';
import FormDate from '@/app/components/forms/form-custom/FormDate';

import useProject from '@/hooks/projects/useProject';
import useProjectForm from '@/hooks/projects/useProjectForm';
import FormPageSkeleton from '../../../comercial/sale/components/FormPageSkeleton';

export default function EditProjectTab({ projectId=null, detail=false }) {
  const params = useParams();
  let id = projectId;
  if (!projectId) id = params.id;

  const { loading, error, projectData } = useProject(id);

  console.log('projectData', projectData);

  const { formData, handleChange, handleSave, formErrors, success } = useProjectForm(
    projectData,
    id,
  );

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

  if (loading) return <FormPageSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Venda</CustomFormLabel>
          <AutoCompleteSale
            onChange={(id) => handleChange('sale_id', id)}
            value={formData.sale_id}
            disabled={detail}
            {...(formErrors.sale_id && { error: true, helperText: formErrors.sale_id })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Projetista</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('designer_id', id)}
            value={formData.designer_id}
            disabled={detail}
            {...(formErrors.designer_id && { error: true, helperText: formErrors.designer_id })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Homologador</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('homologator_id', id)}
            value={formData.homologator_id}
            disabled={detail}
            {...(formErrors.homologator_id && {
              error: true,
              helperText: formErrors.homologator_id,
            })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status"
            options={status_options}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={detail}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormDate
            label="Data de Início"
            name="start_date"
            value={formData.start_date}
            onChange={(newValue) => handleChange('start_date', newValue)}
            disabled={detail}
            {...(formErrors.start_date && { error: true, helperText: formErrors.start_date })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormDate
            label="Data de Término"
            name="end_date"
            value={formData.end_date}
            onChange={(newValue) => handleChange('end_date', newValue)}
            disabled={detail}
            {...(formErrors.end_date && { error: true, helperText: formErrors.end_date })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            {!detail && (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Salvar alterações
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

