'use client';
import { Grid, Button, Stack, FormControlLabel, CircularProgress } from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { useSelector } from 'react-redux';

import { useParams, useRouter } from 'next/navigation';

import AutoCompleteCompanies from '../components/AutoCompleteConcessionaire';
import useEnergyCompany from '@/hooks/requestEnergyCompany/useEnergyCompany';
import useEnergyCompanyForm from '@/hooks/requestEnergyCompany/useEnergyCompanyForm';
import AutoCompleteRequestType from '../components/AutoCompleteRequestType';
import { useEffect } from 'react';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import AutoCompleteUserProject from '../../inspections/auto-complete/Auto-input-UserProject';
import AutoCompleteUnits from '../components/AutoCompleteUnits';

export default function EditRequestCompany({
  requestId = null,
  onClosedModal = null,
  onRefresh = null,
}) {
  const params = useParams();
  let id = requestId;
  if (!requestId) id = params.id;

  const userAuth = useSelector((state) => state.user.user);

  const { loading, error, companyData } = useEnergyCompany(id);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading: loadingForm,
  } = useEnergyCompanyForm(companyData, id);

  formData.requested_by_id ? formData.requested_by_id : (formData.requested_by_id = userAuth.id);

  console.log('formData', formData);

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
  ];

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
