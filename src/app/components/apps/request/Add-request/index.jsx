'use client';
import { Grid, Button, Stack, FormControlLabel, CircularProgress, Box, Typography } from '@mui/material';
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
import AutoCompleteUnits from '../components/auto-complete/AutoCompleteUnits';
import AutoCompleteUserProject from '../../inspections/auto-complete/Auto-input-UserProject';
import AutoCompleteProject from '../../inspections/auto-complete/Auto-input-Project';
import AutoCompleteSituation from '../../comercial/sale/components/auto-complete/Auto-Input-Situation';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';

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

  formData.requested_by ? formData.requested_by : (formData.requested_by = userAuth.id);
  formData.project ? formData.project : (formData.project = projectId);
  formData.status ? formData.status : (formData.status = 'S');

  console.log('formData', formData);

  const today = new Date();
  //const formattedDate =
  //today.getFullYear() +
  //'-' +
  //(today.getMonth() + 1).toString().padStart(2, '0') +
  //'-' +
  //today.getDate().toString().padStart(2, '0');

  //formData.request_date = formattedDate;

  //console.log('formData', formData);

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
            onChange={(id) => handleChange('company', id)}
            value={formData.company}
            {...(formErrors.company && { error: true, helperText: formErrors.company })}
          />
        </Grid>

        {formData.project ? null : (
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="name">Projeto</CustomFormLabel>
            <AutoCompleteProject
              onChange={(id) => handleChange('project', id)}
              value={formData.project}
              {...(formErrors.project && { error: true, helperText: formErrors.project })}
            />
          </Grid>
        )}

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
          {/* <AutoCompleteUnits
            onChange={(id) => handleChange('unit', id)}
            value={formData.unit}
            {...(formErrors.unit && { error: true, helperText: formErrors.unit })}
          /> */}
          <GenericAsyncAutocompleteInput
            label="Unidade Consumidora"
            noOptionsText="Nenhuma unidade encontrado"
            endpoint="/api/units"
            queryParam="name__contains"
            value={formData.unit}
            onChange={(option) => {
              handleChange('unit', option.value || null);
            }}
            extraParams={{
              expand: [
                'address',
                'project.sale.customer',
                'project.homologator',
              ],
              fields: [
                'id',
                'address.complete_address',
                'project.sale.customer.complete_name',
                'project.homologator.complete_name',
                'project.sale.customer.id',
                'project.project_number',
                'unit_number',
                'project.id',
                'project.sale.customer.id',
                'project.homologator.id',
                'address.id',
              ],
            }}
            mapResponse={(data) => {
              console.log('API Response Data:', data);
              return data.results.map((p) => ({
              label: `${p.unit_number} - ${p.address?.complete_address || ''}`,
              value: p.id,
              project_number: {
                label: p.project.project_number,
                value: p.project.id,
              },
              customer: {
                label: p.project.sale.customer.complete_name,
                value: p.project.sale.customer.id,
              },
              address: {
                label: p.address?.complete_address || '',
                value: p.address?.id || null,
              },
              contract_number: p.unit_number,
              homologator: {
                label: p.project.homologator?.complete_name || 'Homologador não disponível',
                value: p.project.homologator?.id || null,
              },
              })
            );
            }}
            renderOption={(props, option) => (
              <li {...props}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Projeto:</strong>
                    {option.project_number.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  <strong>Endereço:</strong> 
                    {option.address.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Conta Contrato:</strong>
                    {option.contract_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Cliente:</strong>
                    {option.customer.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Homologador:</strong>
                    {option.homologator.label}
                  </Typography>
                </Box>
              </li>
            )}
            {...(formErrors.project && { error: true, helperText: formErrors.project })}
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
              Criar Solicitação
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
