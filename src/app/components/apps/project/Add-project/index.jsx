'use client';
import { Grid, Button, Stack, FormControlLabel } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteSale from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Sales';
import AutoCompleteAddresses from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Addresses';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import { useRouter } from 'next/navigation';

import useProjectForm from '@/hooks/projects/useProjectForm';

export default function CreateProject() {
  const { formData, handleChange, handleSave, formErrors, success } = useProjectForm();

  const router = useRouter();

  const status_options = [
    { value: 'P', label: 'Pendente' },
    { value: 'CO', label: 'Concluido' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  if (success) {
    router.push('/apps/financial-record');
  }

  return (
    <>
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
          <FormSelect
            label="Status"
            options={status_options}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
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
        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Criar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
