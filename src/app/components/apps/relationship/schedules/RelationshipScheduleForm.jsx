'use client';
import { useEffect, useReducer, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Box, Button, Typography, Grid, Tooltip,
  Radio, RadioGroup, FormControlLabel,
  FormControl, FormLabel, TextField
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useSnackbar } from 'notistack';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import BlankCard from '@/app/components/shared/BlankCard';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import AutoCompleteUserSchedule from '@/app/components/apps/inspections/auto-complete/Auto-input-UserSchedule';
import scheduleService from '@/services/scheduleService';
import { formatDate } from '@/utils/dateUtils';
import AddUser from '@/app/components/apps/users/Add-user/addUser';
import StatusChip from '@/utils/status/DocumentStatusIcon';

const fieldLabels = {
  schedule_date: 'Data do Agendamento', start_time: 'Horário de Início',
  end_time: 'Horário Final', service: 'Serviço', customer: 'Cliente',
  project: 'Projeto', schedule_agent: 'Agente', branch: 'Unidade',
  address: 'Endereço', observation: 'Observação', schedule_creator: 'Solicitante',
  severity: 'Prioridade', parent_schedules: 'Serviços Relacionados'
};

const initialState = {
  schedule_date: '', schedule_start_time: '08:00:00', schedule_end_time: '12:00:00',
  service: null, customer: null, project: null, schedule_agent: null,
  branch: null, address: null, observation: '', parent_schedules: [],
  severity: null, schedule_creator: null
};

function formReducer(state, { field, value }) {
  return { ...state, [field]: value };
}

export default function RelationshipScheduleForm({ scheduleId = null, breadcrumbItems = [] }) {
  const router = useRouter();
  const user = useSelector(s => s.user.user);
  const { enqueueSnackbar } = useSnackbar();
  const [formData, dispatch] = useReducer(formReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const loadSchedule = useCallback(async () => {
    if (!scheduleId) return;
    setLoading(true);
    try {
      const data = await scheduleService.find(scheduleId, { fields: Object.keys(initialState) });
      const payload = {
        ...data,
        schedule_date: data.schedule_date,
        schedule_end_time: data.schedule_end_time || '12:00'
      };
      Object.entries(payload).forEach(([k, v]) => dispatch({ field: k, value: v }));
    } catch (e) {
      enqueueSnackbar('Falha ao carregar agendamento', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [scheduleId, enqueueSnackbar]);

  useEffect(() => { loadSchedule(); }, [loadSchedule]);

  const handleChange = useCallback((field) => (e) => {
    const value = e?.target?.value ?? e;
    dispatch({ field, value });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault(); setLoading(true); setErrors({});
    const required = ['schedule_date', 'schedule_start_time', 'service', 'customer', 'branch', 'address', 'severity'];
    for (let f of required) {
      if (!formData[f]) {
        enqueueSnackbar(`${fieldLabels[f]} é obrigatório.`, { variant: 'error' });
        setLoading(false);
        return;
      }
    }
    const payload = {
      ...formData,
      schedule_end_date: formData.schedule_date,
      service: formData.service.value,
      customer: formData.customer.value,
      project: formData.project?.value,
      schedule_agent: formData.schedule_agent?.value,
      branch: formData.branch.value,
      address: formData.address.value,
      products: formData.product ? [formData.product.value] : [],
      schedule_creator: formData.schedule_creator?.value || user.id,
      parent_schedules: formData.parent_schedules.map(ps => ps.value)
    };

    try {
      if (scheduleId) {
        await scheduleService.update(scheduleId, payload);
        enqueueSnackbar('Agendamento atualizado com sucesso', { variant: 'success' });
      } else {
        await scheduleService.create(payload);
        enqueueSnackbar('Agendamento criado com sucesso', { variant: 'success' });
      }
      router.push('/apps/relationship/schedules');
    } catch (err) {
      const resp = err.response?.data;
      if (resp && typeof resp === 'object') {
        setErrors(resp);
        Object.entries(resp).forEach(([f, msgs]) =>
          msgs.forEach(m => enqueueSnackbar(`${fieldLabels[f] || f}: ${m}`, { variant: 'error' }))
        );
      } else {
        enqueueSnackbar('Erro ao salvar agendamento', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, [formData, enqueueSnackbar, router, user]);

  return (
    <PageContainer title={`${!!scheduleId ? 'Editar' : 'Criar'} Agendamento`} description="Formulário de Agendamento">
      <Breadcrumb items={breadcrumbItems} />
      <BlankCard>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>Agendamento</Typography>
          <Grid container spacing={2}>
            {/* Serviço */}
            <Grid item xs={12} sm={6}>
              <GenericAsyncAutocompleteInput
                label="Serviço" value={formData.service}
                onChange={handleChange('service')}
                endpoint="/api/services" queryParam="name__icontains"
                extraParams={{ fields: ['id', 'name'], limit: 25, category__name: 'Relacionamento com Cliente' }}
                mapResponse={(data) =>
                  data.results.map((s) => ({
                    label: s.name,
                  }))
                }
                fullWidth required error={!!errors.service}
                helperText={errors.service?.[0]}
              />
            </Grid>
            {/* Agente */}
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <Typography>Agente</Typography>
                <Tooltip title="Selecione o agente disponível" placement="right">
                  <HelpIcon fontSize="small" />
                </Tooltip>
              </Box>
              <AutoCompleteUserSchedule
                value={formData.schedule_agent}
                onChange={id => dispatch({ field: 'schedule_agent', value: id ? { value: id } : null })}
                query={{ service: formData.service?.value, scheduleDate: formData.schedule_date }}
                disabled={!formData.service || !formData.schedule_date}
              />
            </Grid>
            {/* Data e Horário */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data" type="date" fullWidth
                name="schedule_date" value={formData.schedule_date}
                onChange={handleChange('schedule_date')} InputLabelProps={{ shrink: true }}
                error={!!errors.schedule_date} helperText={errors.schedule_date?.[0]}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel>Horário</FormLabel>
                <RadioGroup row value={formData.schedule_start_time} onChange={handleChange('schedule_start_time')}>
                  <FormControlLabel value="08:00:00" control={<Radio />} label="8h-12h" />
                  <FormControlLabel value="14:00:00" control={<Radio />} label="14h-18h" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <GenericAsyncAutocompleteInput
                label="Projeto"
                value={formData.project}
                onChange={(newValue) => {
                  dispatch({ field: 'project', value: newValue });
                  dispatch({ field: 'customer', value: newValue?.customer || null });
                  dispatch({ field: 'branch', value: newValue?.branch || null });
                  dispatch({ field: 'address', value: newValue?.address || null });
                  dispatch({ field: 'product', value: newValue?.product || null });
                }}
                endpoint="/api/projects/"
                queryParam="q"
                extraParams={{
                  expand: [
                    'sale.customer',
                    'sale',
                    'sale.branch',
                    'product',
                    'sale.homologator'
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
                    'address.complete_address'
                  ],
                  filter: 'status__in=C,P,EA'
                }}
                mapResponse={(data) =>
                  data.results.map((p) => ({
                    label: `${p.project_number} - ${p.sale.customer.complete_name}`,
                    value: p.id,
                    project_number: p.project_number,
                    total_value: p.sale.total_value,
                    customer: { label: p.sale.customer.complete_name, value: p.sale.customer.id },
                    branch: { label: p.sale.branch.name, value: p.sale.branch.id },
                    address: { label: p.address?.complete_address || '', value: p.address?.id || null },
                    product: { label: p.product.name, value: p.product.id },
                    contract_number: p.sale.contract_number,
                    homologator: { label: p.sale.homologator?.complete_name || 'Homologador não disponível', value: p.sale.homologator?.id || null },
                    signature_date: p.sale.signature_date,
                    status: p.sale.status
                  }))
                }
                fullWidth
                error={!!errors.project}
                helperText={errors.project?.[0]}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">
                        <strong>Projeto:</strong> {option.project_number}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Cliente:</strong> {option.customer.label}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Valor total:</strong> {option.total_value ? option.total_value : 'Sem valor Total'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Contrato:</strong> {option.contract_number}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Homologador:</strong> {option.homologator.label}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Data de Contrato:</strong> {formatDate(option.signature_date)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Endereço:</strong> {option.address.label}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status da Venda:</strong> <StatusChip status={option.status} size='small' />
                      </Typography>
                      <Typography variant="body2">
                        <strong>Produto:</strong> {option.product.label}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>
            <>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Cliente"
                  value={formData.customer}
                  onChange={(newValue) => dispatch({ field: 'customer', value: newValue })}
                  endpoint="/api/users"
                  queryParam="complete_name__icontains"
                  extraParams={{ fields: ['id', 'complete_name'], limit: 10 }}
                  mapResponse={(data) => data.results.map((u) => ({ label: u.complete_name, value: u.id }))}
                  fullWidth
                  disabled
                  helperText={errors.customer?.[0]}
                  error={!!errors.customer}
                  renderCreateModal={({ onClose }) => (
                    <AddUser
                      hideSaveButton={false}
                      onClose={onClose}
                      onUserSaved={(user) => {
                        dispatch({ field: 'customer', value: { label: user.complete_name, value: user.id } });
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
                  onChange={(newValue) => dispatch({ field: 'branch', value: newValue })}
                  endpoint="/api/branches"
                  queryParam="name__icontains"
                  extraParams={{ fields: ['id', 'name'] }}
                  mapResponse={(data) => data.results.map((b) => ({ label: b.name, value: b.id }))}
                  fullWidth
                  disabled
                  helperText={errors.branch?.[0]}
                  error={!!errors.branch}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Produto"
                  value={formData.product}
                  onChange={(newValue) => dispatch({ field: 'product', value: newValue })}
                  endpoint="/api/products"
                  queryParam="name__icontains"
                  extraParams={{ fields: ['id', 'description', 'name'], default__in: 'S' }}
                  mapResponse={(data) => data.results.map((p) => ({ label: p.description || p.name, value: p.id }))}
                  fullWidth
                  disabled
                  helperText={errors.product?.[0]}
                  error={!!errors.product}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Endereço"
                  value={formData.address}
                  onChange={(newValue) => dispatch({ field: 'address', value: newValue })}
                  endpoint="/api/addresses"
                  queryParam="q"
                  extraParams={{
                    fields: ['id', 'complete_address'],
                    customer_id: formData.customer?.value || ''
                  }}
                  mapResponse={(data) => data.results.map((a) => ({ label: a.complete_address, value: a.id }))}
                  fullWidth
                  disabled={!!formData.project?.address?.value}
                  helperText={errors.address?.[0]}
                  error={!!errors.address}
                  required
                />
              </Grid>
            </>

            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Prioridade</FormLabel>
                <RadioGroup
                  row
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange('severity')}
                >
                  <FormControlLabel
                    value="A"
                    control={<Radio color="success" />}
                    label="Baixa (A)"
                  />
                  <FormControlLabel
                    value="B"
                    control={<Radio color="warning" />}
                    label="Média (B)"
                  />
                  <FormControlLabel
                    value="C"
                    control={<Radio color="error" />}
                    label="Alta (C)"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <GenericAsyncAutocompleteInput
                label="Solicitante"
                value={formData.schedule_creator}
                onChange={(newValue) => dispatch({ field: 'schedule_creator', value: newValue })}
                endpoint="/api/users"
                queryParam="complete_name__icontains"
                extraParams={{ fields: ['id', 'complete_name'], limit: 10 }}
                mapResponse={(data) =>
                  data.results.map((u) => ({ label: u.complete_name, value: u.id }))
                }
                fullWidth
                helperText={errors.schedule_creator?.[0]}
                error={!!errors.schedule_creator}
              />
            </Grid>

            {(formData.customer || formData.project) && (
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Serviços Relacionados"
                  value={formData.parent_schedules}
                  onChange={(newValue) =>
                    dispatch({ field: 'parent_schedules', value: newValue })
                  }
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
                  mapResponse={(data) =>
                    data.results.map((s) => ({
                      label: `${s.service?.name || ''} nº ${s.protocol} - ${s.customer?.complete_name || ''
                        } - ${s.schedule_date} ${s.schedule_start_time}`,
                      value: s.id,
                      ...s,
                    }))
                  }
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
                  helperText={errors.parent_schedules?.[0]}
                  error={!!errors.parent_schedules}
                  fullWidth
                  multiselect
                  required
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Observação"
                name="observation"
                value={formData.observation}
                onChange={handleChange('observation')}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

          </Grid>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => router.back()} disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
          </Box>
        </Box>
      </BlankCard>
    </PageContainer >
  );
}
