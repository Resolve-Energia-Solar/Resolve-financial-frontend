'use client';
import { Grid, Button, Stack, FormControlLabel, CircularProgress } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { useSelector } from 'react-redux';

import AutoCompleteCompanies from '../components/AutoCompleteConcessionaire';
import useEnergyCompany from '@/hooks/requestEnergyCompany/useEnergyCompany';
import useEnergyCompanyForm from '@/hooks/requestEnergyCompany/useEnergyCompanyForm';
import AutoCompleteRequestType from '../components/AutoCompleteRequestType';
import { useEffect } from 'react';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import AutoCompleteUnits from '../components/AutoCompleteUnits';
import AutoCompleteUserProject from '../../inspections/auto-complete/Auto-input-UserProject';
import AutoCompleteProject from '../../inspections/auto-complete/Auto-input-Project';

export default function AddRequestCompany({
  onClosedModal = null,
  onRefresh = null,
  projectId = null,
}) {
  const userAuth = useSelector((state) => state.user.user);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading: loadingForm,
  } = useEnergyCompanyForm();

  formData.requested_by_id ? formData.requested_by_id : (formData.requested_by_id = userAuth.id);
  formData.project_id ? formData.project_id : (formData.project_id = projectId);
  formData.status ? formData.status : (formData.status = 'S');

  const today = new Date();
  const formattedDate = today.getFullYear() + '-' + 
                        (today.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                        today.getDate().toString().padStart(2, '0');
  
  formData.request_date = formattedDate;
  
  console.log('formData', formData);

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      }
    }
  }, [success]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Distribuidora de Energia</CustomFormLabel>
          <AutoCompleteCompanies
            onChange={(id) => handleChange('company_id', id)}
            value={formData.company_id}
            {...(formErrors.company_id && { error: true, helperText: formErrors.company_id })}
          />
        </Grid>

        { formData.project_id ? null : (
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Projeto</CustomFormLabel>
          <AutoCompleteProject
            onChange={(id) => handleChange('project_id', id)}
            value={formData.project_id}
            {...(formErrors.project_id && { error: true, helperText: formErrors.project_id })}
          />
        </Grid>
        )}

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="type_id">Tipos de solicitação</CustomFormLabel>
          <AutoCompleteRequestType
            onChange={(id) => handleChange('type_id', id)}
            value={formData.type_id}
            {...(formErrors.type_id && { error: true, helperText: formErrors.type_id })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="unit_id">Unidade Consumidora</CustomFormLabel>
          <AutoCompleteUnits
            onChange={(id) => handleChange('unit_id', id)}
            value={formData.unit_id}
            {...(formErrors.unit_id && { error: true, helperText: formErrors.unit_id })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <FormDate
            label="Data da Conclusão"
            name="conclusion_date"
            value={formData.conclusion_date}
            onChange={(newValue) => handleChange('conclusion_date', newValue)}
            {...(formErrors.conclusion_date && {
              error: true,
              helperText: formErrors.conclusion_date,
            })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="interim_protocol">Protocolo Temporário</CustomFormLabel>
          <CustomTextField
            name="interim_protocol"
            variant="outlined"
            fullWidth
            value={formData.interim_protocol}
            onChange={(e) => handleChange('interim_protocol', e.target.value)}
            {...(formErrors.interim_protocol && {
              error: true,
              helperText: formErrors.interim_protocol,
            })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="final_protocol">Protocolo Definitivo</CustomFormLabel>
          <CustomTextField
            name="final_protocol"
            variant="outlined"
            fullWidth
            value={formData.final_protocol}
            onChange={(e) => handleChange('final_protocol', e.target.value)}
            {...(formErrors.final_protocol && {
              error: true,
              helperText: formErrors.final_protocol,
            })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              endIcon={loadingForm ? <CircularProgress color="inherit" size={20} /> : null}
              disabled={loadingForm}
            >
              Criar Solicitação
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
