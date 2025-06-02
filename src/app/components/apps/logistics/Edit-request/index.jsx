'use client';
import { Grid, Button, Stack, FormControlLabel, CircularProgress } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { useSelector } from 'react-redux';

import AutoCompleteCompanies from '../components/auto-complete/AutoCompleteConcessionaire';
import useEnergyCompany from '@/hooks/requestEnergyCompany/useEnergyCompany';
import useEnergyCompanyForm from '@/hooks/requestEnergyCompany/useEnergyCompanyForm';
import AutoCompleteRequestType from '../components/auto-complete/AutoCompleteRequestType';
import { useEffect } from 'react';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import AutoCompleteUserProject from '../../inspections/auto-complete/Auto-input-UserProject';
import AutoCompleteUnits from '../components/auto-complete/AutoCompleteUnits';
import AutoCompleteSituation from '../../comercial/sale/components/auto-complete/Auto-Input-Situation';
import Skeleton from '@mui/material/Skeleton';

export default function EditRequestCompany({
  requestId = null,
  onClosedModal = null,
  onRefresh = null,
}) {
  const id = requestId;

  const userAuth = useSelector((state) => state.user.user);

  const { loading, error, companyData } = useEnergyCompany(id, {
    fields: 'id,company.id,type.id,unit.id,status,interim_protocol,final_protocol,request_date,conclusion_date,situation.id,project',
    expand: 'company,type,unit,situation',
  });

  console.log('companyData', companyData);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading: loadingForm,
  } = useEnergyCompanyForm(companyData, id);

  useEffect(() => {
    if (formData && !formData.requested_by && userAuth?.id) {
      handleChange('requested_by', userAuth.id);
      handleChange('project', companyData?.project);
    }
  }, [formData, userAuth]);

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      }
    }
  }, [success]);

  const statusOptions = [
    { value: 'S', label: 'Solicitada' },
    { value: 'I', label: 'Indeferida' },
    { value: 'D', label: 'Deferida' },
    { value: 'ID', label: 'Indeferida por Débito' },
  ];

  if (loading || !formData) {
    return (
      <Grid container spacing={3}>
        {[...Array(9)].map((_, index) => (
          <Grid item xs={12} sm={12} lg={4} key={index}>
            <Skeleton variant="text" width="60%" height={30} />
            <Skeleton variant="rectangular" height={50} />
          </Grid>
        ))}
        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Skeleton variant="rectangular" width={150} height={40} />
          </Stack>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Distribuidora de Energia</CustomFormLabel>
          <AutoCompleteCompanies
            onChange={(id) => handleChange('company', id)}
            value={formData.company}
            {...(formErrors.company && { error: true, helperText: formErrors.company })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="type">Tipos de solicitação</CustomFormLabel>
          <AutoCompleteRequestType
            onChange={(id) => handleChange('type', id)}
            value={formData.type}
            {...(formErrors.type && { error: true, helperText: formErrors.type })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="unit">Unidade Consumidora</CustomFormLabel>
          <AutoCompleteUnits
            onChange={(id) => handleChange('unit', id)}
            value={formData.unit}
            {...(formErrors.unit && { error: true, helperText: formErrors.unit })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status da Solicitação"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
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

        <Grid item xs={12} sm={12} lg={4}>
          <FormDate
            label="Data de solicitação"
            name="request_date"
            value={formData.request_date}
            onChange={(newValue) => handleChange('request_date', newValue)}
            {...(formErrors.request_date && {
              error: true,
              helperText: formErrors.request_date,
            })}
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
          <CustomFormLabel htmlFor="situation">Situação</CustomFormLabel>
          <AutoCompleteSituation
            onChange={(id) => handleChange('situation', id)}
            value={formData.situation}
            {...(formErrors.situation && { error: true, helperText: formErrors.situation })}
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
              Salvar alterações
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
