'use client';
import { Grid, Typography, Stack, CircularProgress, Button, InputAdornment, Box, TextField, Select, FormControlLabel, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import useScheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';

import { useSelector } from 'react-redux';
import CreateAddressPage from '@/app/components/apps/address/Add-address';
import { formatDate } from '@/utils/dateUtils';
import AddUser from '@/app/components/apps/users/Add-user/addUser';




import { IconAlarm } from '@tabler/icons-react';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';


function AddSchedulePage({ form = null, serviceId, onRefresh = null, onClose = null}) {
  const userPermissions = useSelector((state) => state.user.permissions);
  const theme = useTheme();
  const [isProject, setIsProject] = useState(false);

  console.log('form: ', form)

  const { enqueueSnackbar } = useSnackbar();

  const { formData, setFormData, setFormErrors,formErrors, handleChange, handleSave, setLoading: setFormLoading,loading: formLoading } = useScheduleForm()

  serviceId ? (formData.service = serviceId) : null;
  form.schedule_agent ? (formData.schedule_agent = form.schedule_agent) : null;
  form.schedule_date ? (formData.schedule_date = form.schedule_date) : null;
  console.log('formData: ', formData)
  console.log('formErrors: ', formErrors)


  const timeOptions = [
    { value: '08:30:00', label: '08:30', value_end: '09:30:00' },
    { value: '10:00:00', label: '10:00', value_end: '11:00:00' },
    { value: '13:00:00', label: '13:00', value_end: '14:00:00' },
    { value: '14:30:00', label: '14:30', value_end: '15:30:00' },
    { value: '16:00:00', label: '16:00', value_end: '17:00:00' },
  ];

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Confirmado', label: 'Confirmado' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];

  const saleStatusMap = {
    P: ['Pendente', 'warning'],
    F: ['Finalizado', 'success'],
    EA: ['Em Andamento', 'info'],
    C: ['Cancelado', 'error'],
    D: ['Distrato', 'default'],
  };

  const fieldLabels = {
    schedule_date: 'Data do Agendamento',
    schedule_start_time: 'Horário de Início',
    schedule_end_date: 'Data Final',
    schedule_end_time: 'Horário Final',
    service: 'Serviço',
    customer: 'Cliente',
    project: 'Projeto',
    schedule_agent: 'Agente',
    branch: 'Unidade',
    address: 'Endereço',
    observation: 'Observação',
    schedule_creator: 'Criador do Agendamento',
  };

  useEffect(() => {
    if ('available_time' in formErrors) {
      const { message, available_time } = formErrors;
      const timeSlots = available_time.map((slot) => (
        <li key={`${slot.start}-${slot.end}`}>
          {slot.start} - {slot.end}
        </li>
      ));
      enqueueSnackbar(
        <div>
          <Typography variant="body1">{message}</Typography>
          <Typography variant="body2">Horários disponíveis:</Typography>
          <ul>{timeSlots}</ul>
        </div>,
        { variant: 'warning' },
      );
    }

    // Caso tenha erros no formulário e seja um projeto
    if (formErrors && Object.keys(formErrors).length > 0 && isProject && !'available_time' in formErrors) {
      Object.keys(formErrors).forEach((key) => {
        if (formErrors[key] && formErrors[key].length > 0) {
          const label = fieldLabels[key] || key;
          enqueueSnackbar(`${label}: ${formErrors[key][0]}`, { variant: 'error' });
        }
      });
    }
  }, [formErrors]);



  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleSaveForm = async () => {
    try {
      setFormErrors({});
      setFormLoading(true);
      const requiredFields = [
        'schedule_date',
        'schedule_start_time',
        'schedule_end_date',
        'schedule_end_time',
        'service',
        'customer',
        'branch',
        'address',
      ];

      const newErrors = {};

      for (const field of requiredFields) {
        if (!formData[field]) {
          newErrors[field] = ['Este campo não pode ser nulo.'];
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setFormErrors(newErrors);
        setFormLoading(false);
        return;
      }

      const response = await handleSave();
      if (response) {
        if (onRefresh) onRefresh()
        if(onClose) onClose()
      }
    } catch (error) {
      console.error('Error saving form:', error);
      enqueueSnackbar('Erro ao salvar o agendamento', { variant: 'error' });
      setFormLoading(false);
    }
  };


  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: "flex-start", flexDirection: 'column'}}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: "24px", fontWeight: 700, color: "#303030" }}>
              Agende uma visita
            </Typography>
          </Grid>
          <Grid item xs={12} mb={1}>
            <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#98959D" }}>
              Selecione data, horário e selecione o endereço do cliente para criar o agendamento.
            </Typography>
          </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
          {serviceId ? null : (
          <Grid item xs={12}>
              <CustomFormLabel htmlFor="service">Serviço</CustomFormLabel>
              <AutoCompleteServiceCatalog
                fullWidth
                value={serviceId}
                onChange={(id) => handleChange('service', id)}
                {...(formErrors.service && {
                  error: true,
                  helperText: formErrors.service,
                })}
              />
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
          <CustomFormLabel>Este agendamento possui projeto?</CustomFormLabel>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={isProject}
                onChange={(e) => setIsProject(!isProject)}
              />
            }
            label={isProject ? 'Sim' : 'Não'}
          />
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
          {isProject && (
            <Grid item xs={12} sm={6}>
            <GenericAsyncAutocompleteInput
              label="Projeto"
              value={formData.project}
              onChange={(newValue) => {
                if (newValue) {
                  setFormData({
                    ...formData,
                    project: newValue,
                    customer: newValue.customer,
                    branch: newValue.branch,
                    address: newValue.address,
                    product: newValue.product,
                  });
                } else {
                  setFormData({
                    ...formData,
                    project: null,
                    customer: null,
                    branch: null,
                    address: null,
                    product: null,
                  });
                }
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
                filter: 'status__in=C,P,EA',
              }}
              mapResponse={(data) =>
                data.results.map((p) => ({
                  label: `${p.project_number} - ${p.sale.customer.complete_name}`,
                  value: p.id,
                  project_number: p.project_number,
                  total_value: p.sale.total_value,
                  customer: {
                    label: p.sale.customer.complete_name,
                    value: p.sale.customer.id,
                  },
                  branch: { label: p.sale.branch.name, value: p.sale.branch.id },
                  address: {
                    label: p.address?.complete_address || '',
                    value: p.address?.id || null,
                  },
                  product: { label: p.product.name, value: p.product.id },
                  contract_number: p.sale.contract_number,
                  homologator: {
                    label: p.sale.homologator?.complete_name || 'Homologador não disponível',
                    value: p.sale.homologator?.id || null,
                  },
                  signature_date: p.sale.signature_date,
                  status: p.sale.status,
                }))
              }
              fullWidth
              helperText={formErrors.project?.[0] || ''}
              error={!!formErrors.project}
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
          {!isProject && (
            <>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Cliente"
                  value={formData.customer}
                  onChange={(newValue) => setFormData({ ...formData, customer: newValue })}
                  endpoint="/api/users/"
                  queryParam="complete_name__icontains"
                  extraParams={{ fields: ['id', 'complete_name'] }}
                  mapResponse={(data) =>
                    data.results.map((u) => ({ label: u.complete_name, value: u.id }))
                  }
                  fullWidth
                  helperText={formErrors.customer?.[0] || ''}
                  error={!!formErrors.customer}
                  renderCreateModal={({ onClose }) => (
                    <AddUser
                      hideSaveButton={false}
                      onClose={onClose}
                      onUserSaved={user => {
                        setFormData({
                          ...formData,
                          customer: { label: user.complete_name, value: user.id },
                        });
                        onClose();
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Unidade"
                  value={formData.branch}
                  onChange={(newValue) => setFormData({ ...formData, branch: newValue })}
                  endpoint="/api/branches/"
                  queryParam="name__icontains"
                  extraParams={{ fields: ['id', 'name'] }}
                  mapResponse={(data) =>
                    data.results.map((b) => ({ label: b.name, value: b.id }))
                  }
                  fullWidth
                  helperText={formErrors.branch?.[0] || ''}
                  error={!!formErrors.branch}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Produto"
                  value={formData.product}
                  onChange={(newValue) => setFormData({ ...formData, product: newValue })}
                  endpoint="/api/products/"
                  queryParam="name__icontains"
                  extraParams={{ fields: ['id', 'description', 'name'] }}
                  mapResponse={(data) =>
                    data.results.map((p) => ({ label: p.description || p.name, value: p.id }))
                  }
                  fullWidth
                  helperText={formErrors.product?.[0] || ''}
                  error={!!formErrors.product}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <GenericAsyncAutocompleteInput
                  label="Endereço"
                  value={formData.address}
                  onChange={(newValue) => handleChange('address', newValue)}
                  endpoint="/api/addresses"
                  queryParam="q"
                  extraParams={{
                    fields: ['id', 'complete_address'],
                    customer_id: formData.customer?.value || '',
                  }}
                  mapResponse={(data) =>
                    data.results.map((a) => ({ label: a.complete_address, value: a.id }))
                  }
                  fullWidth
                  helperText={formErrors.address?.[0] || ''}
                  error={!!formErrors.address}
                  required
                  renderCreateModal={({ open, onClose }) =>
                    <CreateAddressPage
                      open={open}
                      onClose={onClose}
                      userId={formData.customer?.value}
                      onAdd={created => {
                        handleChange('address', created);
                        onClose();
                      }}
                    />
                  }
                />
              </Grid>
            </>
         )}

          {(formData.customer || formData.project) && (
            <Grid item xs={12} sm={6}>
              <GenericAsyncAutocompleteInput
                label="Serviços Relacionados"
                value={formData.parent_schedules}
                onChange={(newValue) => handleChange('parent_schedules', newValue)}
                endpoint="/api/schedule"
                queryParam="q"
                extraParams={{
                  fields:
                    'id,protocol,schedule_date,schedule_start_time,schedule_end_date,schedule_end_time,status,service,customer.complete_name,address.complete_address,schedule_agent.complete_name,branch.name,service_opinion,final_service_opinion',
                  expand:
                    'customer,schedule_agent,service,address,final_service_opinion,service_opinion,branch',
                  customer: formData.customer?.value || '',
                  project: formData.project?.value || '',
                  customer_project_or: true,
                }}
                mapResponse={(data) => {
                  return data.results.map((s) => ({
                    label: `${s.service?.name || ''} nº ${s.protocol} - ${
                      s.customer?.complete_name || ''
                    } - ${s.schedule_date} ${s.schedule_start_time.toLocaleString()}`,
                    value: s.id,
                    ...s,
                  }));
                }}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2">
                        <strong>Protocolo:</strong> {option.protocol}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Início:</strong> {formatDate(option.schedule_date)}{' '}
                        {option.schedule_start_time.toLocaleString()} | <strong>Término:</strong>{' '}
                        {formatDate(option.schedule_end_date)}{' '}
                        {option.schedule_end_time.toLocaleString()}
                      </Typography>
                      {option.customer && (
                        <Typography variant="body1">
                          <strong>Cliente:</strong> {option.customer?.complete_name}
                        </Typography>
                      )}
                      {option.service && (
                        <Typography variant="body1">
                          <strong>Serviço:</strong> {option.service.name}
                        </Typography>
                      )}
                      {option.schedule_agent && (
                        <Typography variant="body1">
                          <strong>Agente:</strong> {option.schedule_agent.complete_name}
                        </Typography>
                      )}
                      <Typography variant="body1">
                        <strong>Status:</strong> {option.status}
                      </Typography>
                      {option.address && (
                        <Typography variant="body1">
                          <strong>Endereço:</strong> {option.address.complete_address}
                        </Typography>
                      )}
                      {option.branch && option.branch.name && (
                        <Typography variant="body1">
                          <strong>Filial:</strong> {option.branch.name}
                        </Typography>
                      )}
                      {option.service_opinion && option.service_opinion.name && (
                        <Typography variant="body1">
                          <strong>Parecer de Serviço:</strong> {option.service_opinion.name}
                        </Typography>
                      )}
                      {option.final_service_opinion && option.final_service_opinion.name && (
                        <Typography variant="body1">
                          <strong>Parecer Final:</strong> {option.final_service_opinion.name}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
                helperText={formErrors.parent_schedules?.[0] || ''}
                error={!!formErrors.parent_schedules}
                fullWidth
                // multiselect
                required
              />
            </Grid>
          )}

        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
          {!form.schedule_date && (
          <Grid item xs={12}>
            <CustomFormLabel
              htmlFor="start_datetime"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Data
            </CustomFormLabel>
            <FormDate
              name="start_datetime"
              value={formData.schedule_date}
              onChange={(newValue) => handleChange('schedule_date', newValue)}
              {...(formErrors.schedule_date && {
                error: true,
                helperText: formErrors.schedule_date,
              })}
              sx={{
                input: {
                  color: '#7E92A2',
                  fontWeight: '400',
                  fontSize: '14px',
                  opacity: 1,
                },
                '& .MuiOutlinedInput-root': {
                  border: '1px solid #3E3C41',
                  borderRadius: '9px',
                },
              }}
            />
          </Grid>
          )}
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
          <Grid item xs={12}>
            <CustomFormLabel
              htmlFor="start_datetime"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Horário
            </CustomFormLabel>
            <FormSelect
              options={timeOptions}
              onChange={(e) => {
                handleChange('schedule_start_time', e.target.value)
                handleChange('schedule_end_time', e.target.value_end)
              }}
              value={formData.schedule_start_time || ''}
              {...(formErrors.schedule_start_time && {
                error: true,
                helperText: formErrors.schedule_start_time,
              })}
              sx={{
                '& .MuiInputBase-formControl': {
                  border: '1px solid #3E3C41 !important',
                  borderRadius: '9px',
                  '&:hover': {
                    borderColor: '#3E3C41 !important',
                  },
                },
                '& .MuiSelect-select': {
                  color: '#7E92A2',
                  fontWeight: '400',
                  fontSize: '14px',
                  opacity: 1,
                },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <IconAlarm color={theme.palette.primary.main} position='absolute' left='10px' top='50%' />
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
          <CustomFormLabel
            htmlFor="observation"
            sx={{
              color: '#303030',
              fontWeight: '700',
              fontSize: '16px',
              marginBottom: 0,
            }}
          >
            Observação
          </CustomFormLabel>
          <CustomTextField
            name="observation"
            placeholder="Observação do agendamento"
            variant="outlined"
            fullWidth
            multiline
            rows={1}
            value={formData.observation}
            onChange={(e) => handleChange('observation', e.target.value)}
            {...(formErrors.observation && { error: true, helperText: formErrors.observation })}
            sx={{
              mt: 1,
              '& .MuiInputBase-root': {
                overflow: 'auto',
                wordWrap: 'break-word',
                height: "100%"
              },
              '& .MuiOutlinedInput-root': {
                border: '1px solid #3E3C41',
                borderRadius: '9px',
              },
              input: {
                color: '#7E92A2',
                fontWeight: '400',
                fontSize: '12px',
                opacity: 1,
              },
              '& .MuiInputBase-input::placeholder': {
                color: "#B2AFB6",
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#000',
                p: 1,
                height: "56px",
                '&:hover': {
                  color: theme.palette.primary.light,
                }
              }}
              fullWidth
              onClick={handleSaveForm}
              disabled={formLoading}
              endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Agendar visita
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AddSchedulePage;
