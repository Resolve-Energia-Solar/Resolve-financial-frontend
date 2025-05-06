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
import { formatDate } from '@/utils/dateUtils';

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

  console.log('formData', formData);

  formData.requested_by ? formData.requested_by : (formData.requested_by = userAuth.id);
  formData.project ? formData.project : (formData.project = projectId);
  formData.status ? formData.status : (formData.status = 'S');

  const today = new Date();

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      }
    }
  }, [success]);


  const saleStatusMap = {
    P: ['Pendente', 'warning'],
    F: ['Finalizado', 'success'],
    EA: ['Em Andamento', 'info'],
    C: ['Cancelado', 'error'],
    D: ['Distrato', 'default'],
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

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

        {!!projectId && formData.project ? null : (
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="project">Projeto</CustomFormLabel>
            <GenericAsyncAutocompleteInput
              label="Projeto"
              value={formData.project || {}}
              onChange={(newValue) => {
                console.log('newValue', newValue);
                handleChange('project', newValue.value || null);
              }}
              endpoint="/api/projects/"
              queryParam="q"
              extraParams={{
                expand: [
                  'sale.customer',
                  'sale',
                  'sale.branch',
                  'product',
                  'sale.homologator',
                ],
                fields: [
                  'id',
                  'project_number',
                  'address',
                  'sale.total_value',
                  'sale.contract_number',
                  'sale.customer.complete_name',
                  'sale.customer.id',
                  'sale.branch.id',
                  'sale.branch.name',
                  'product.id',
                  'product.name',
                  'product.description',
                  'sale.signature_date',
                  'sale.status',
                  'sale.homologator.complete_name',
                  'address.complete_address',
                ],
                limit: 15,
                page: 1,
              }}
              mapResponse={(data) => {
                return data.results.map((p) => {
                  console.log('API Response:', data);
                  const projectNumber = p?.project_number || 'Número de projeto não disponível';
                  const customerName = p?.sale?.customer?.complete_name || 'Cliente não disponível';
              
                  return {
                    label: `${projectNumber} - ${customerName}`,
                    value: p?.id || null,
                    project_number: projectNumber,
                    total_value: p?.sale?.total_value || null,
                    customer: {
                      label: customerName,
                      value: p?.sale?.customer?.id || null,
                    },
                    branch: {
                      label: p?.sale?.branch?.name || 'Filial não disponível',
                      value: p?.sale?.branch?.id || null,
                    },
                    address: {
                      label: p?.address?.complete_address || 'Endereço não disponível',
                      value: p?.address?.id || null,
                    },
                    product: {
                      label: p?.product?.name || 'Produto não disponível',
                      value: p?.product?.id || null,
                    },
                    contract_number: p?.sale?.contract_number || 'Contrato não disponível',
                    homologator: {
                      label: p?.sale?.homologator?.complete_name || 'Homologador não disponível',
                      value: p?.sale?.homologator?.id || null,
                    },
                    signature_date: p?.sale?.signature_date || 'Data não disponível',
                    status: p?.sale?.status || 'Status não disponível',
                  };
                });
              }}
              
              fullWidth
              renderOption={(props, option) => (
                <li {...props}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">
                      <strong>Projeto:</strong> {option.project_number}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Cliente:</strong>{' '}
                      {option.customer.label || 'Cliente não Disponível'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Valor total:</strong>{' '}
                      {option.total_value
                        ? formatCurrency(option.total_value)
                        : 'Sem valor Total'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Contrato:</strong>{' '}
                      {option.contract_number || 'Contrato não Disponível'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Homologador:</strong>{' '}
                      {option.homologator.label || 'Homologador não Disponível'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Data de Contrato:</strong>{' '}
                      {formatDate(option.signature_date) || 'Data de Contrato não Disponível'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Endereço:</strong>{' '}
                      {option.address.label || 'Endereço não Disponível'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status da Venda:</strong>{' '}
                      {option.status ? (
                        <Grid
                          label={saleStatusMap[option.status][0] || 'Status Desconhecido'}
                          size="small"
                          color={saleStatusMap[option.status][1] || 'default'}
                        />
                      ) : (
                        'Status não Disponível'
                      )}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Produto:</strong>{' '}
                      {option.product.label || 'Produto não Disponível'}
                    </Typography>
                  </Box>
                </li>
              )}
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
              project: projectId || formData.project || '',
              limit: 15,
              page: 1,
            }}
            mapResponse={(data) => {
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
