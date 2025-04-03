'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  Grid,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Chip,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import BlankCard from '@/app/components/shared/BlankCard';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import scheduleService from '@/services/scheduleService';
import { useSnackbar } from 'notistack';
import AutoCompleteUserSchedule from '@/app/components/apps/inspections/auto-complete/Auto-input-UserSchedule';
import { formatDate } from '@/utils/dateUtils';

const CreateSchedulePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    schedule_date: '',
    schedule_start_time: '',
    schedule_end_date: '',
    schedule_end_time: '',
    service: null,
    customer: null,
    project: null,
    schedule_agent: null,
    branch: null,
    address: null,
    observation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isEndModified, setIsEndModified] = useState(false);
  const [minEnd, setMinEnd] = useState({ date: '', time: '' });
  const [hasProject, setHasProject] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user?.user);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const submitData = {
      ...formData,
      service: formData.service?.value,
      customer: formData.customer?.value,
      project: formData.project?.value,
      schedule_agent: formData.schedule_agent?.value,
      branch: formData.branch?.value,
      address: formData.address?.value,
      schedule_creator: user.id,
      products: formData.product ? [formData.product.value] : [],
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

    try {
      await scheduleService.create(submitData);
      router.push('/apps/schedules');
    } catch (err) {
      Object.entries(err.response.data).forEach(([field, messages]) => {
        messages.forEach((message) => {
          const label = fieldLabels[field] || field;
          enqueueSnackbar(`${label}: ${message}`, { variant: 'error' });
        });
      });
      setErrors(err.response.data);
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { to: '/', title: 'Início' },
    { to: '/apps/schedules', title: 'Agendamentos' },
    { title: 'Criar Agendamento' },
  ];

  useEffect(() => {
    if (
      formData.service &&
      formData.schedule_date &&
      formData.schedule_start_time &&
      formData.service.deadline &&
      formData.service.deadline.hours
    ) {
      const [addHours, addMinutes, addSeconds] = formData.service.deadline.hours
        .split(':')
        .map(Number);
      const [year, month, day] = formData.schedule_date.split('-').map(Number);
      const [hour, minute] = formData.schedule_start_time.split(':').map(Number);
      const startDate = new Date(year, month - 1, day, hour, minute);
      startDate.setHours(
        startDate.getHours() + addHours,
        startDate.getMinutes() + addMinutes,
        startDate.getSeconds() + addSeconds,
      );
      const computedDate = startDate.toISOString().split('T')[0];
      const computedTime = startDate.toTimeString().slice(0, 5);
      setFormData((prev) => ({
        ...prev,
        schedule_end_date: computedDate,
        schedule_end_time: computedTime,
      }));
    }
  }, [formData.service, formData.schedule_date, formData.schedule_start_time]);

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
    <PageContainer
      title="Criar Agendamento"
      description="Formulário para criação de um novo agendamento"
    >
      <Breadcrumb items={breadcrumbItems} />
      <BlankCard>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom marginBottom={4}>
            Criar Agendamento
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <GenericAsyncAutocompleteInput
                label="Serviço"
                value={formData.service}
                onChange={(newValue) => {
                  setFormData({ ...formData, service: newValue });
                  console.log('newValue', newValue);
                }}
                endpoint="/api/services/"
                queryParam="name__icontains"
                extraParams={{
                  fields: ['id', 'name', 'deadline', 'category'], // ajustado: substitui "deadline.hours"
                  expand: [], // ajustado: nenhum expand para este endpoint
                }}
                mapResponse={(data) =>
                  data.results.map((s) => ({
                    label: s.name,
                    value: s.id,
                    deadline: s.deadline,
                    category: s.category,
                  }))
                }
                helperText={errors.service?.[0] || ''}
                error={!!errors.service}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6}>
              <Typography htmlFor="field_agent">
                Agentes Disponíveis{' '}
                <Tooltip
                  title="Os agentes de campo são alocados com base na disponibilidade de horário e proximidade geográfica. Ajuste os parâmetros para visualizar opções disponíveis."
                  placement="right-end"
                >
                  <HelpIcon fontSize="small" />
                </Tooltip>
              </Typography>
              <AutoCompleteUserSchedule
                onChange={(id) => {
                  if (id) {
                    setFormData({
                      ...formData,
                      schedule_agent: { value: id, name: 'nome do agente' },
                    });
                  }
                }}
                value={formData.schedule_agent}
                disabled={
                  !formData.service?.category ||
                  !formData.schedule_date ||
                  !formData.schedule_start_time
                }
                query={{
                  category: formData.service?.category,
                  scheduleDate: formData.schedule_date,
                  scheduleStartTime: formData.schedule_start_time,
                  scheduleEndTime: formData.schedule_end_time,
                  // scheduleLatitude: formData.address?.latitude,
                  // scheduleLongitude: formData.address?.longitude,
                }}
                {...(errors.schedule_agent_id && {
                  error: true,
                  helperText: formErrors.schedule_agent_id,
                })}
              />
            </Grid>
            {/* Datas e horários */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data do Agendamento"
                type="date"
                name="schedule_date"
                value={formData.schedule_date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                helperText={errors.schedule_date?.[0] || ''}
                error={!!errors.schedule_date}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Horário de Início"
                type="time"
                name="schedule_start_time"
                value={formData.schedule_start_time}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                helperText={errors.schedule_start_time?.[0] || ''}
                error={!!errors.schedule_start_time}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data Final"
                type="date"
                name="schedule_end_date"
                value={formData.schedule_end_date}
                onChange={(e) => {
                  setIsEndModified(true);
                  handleInputChange(e);
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: minEnd.date || undefined,
                }}
                helperText={errors.schedule_end_date?.[0] || ''}
                error={!!errors.schedule_end_date}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hora Final"
                type="time"
                name="schedule_end_time"
                value={formData.schedule_end_time}
                onChange={(e) => {
                  setIsEndModified(true);
                  handleInputChange(e);
                }}
                onBlur={() => {
                  // Se a data final for a mesma do mínimo, a hora não pode ser menor que o mínimo
                  if (
                    formData.schedule_end_date === minEnd.date &&
                    formData.schedule_end_time < minEnd.time
                  ) {
                    setFormData((prev) => ({
                      ...prev,
                      schedule_end_time: minEnd.time,
                    }));
                  }
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: formData.schedule_end_date === minEnd.date ? minEnd.time : undefined,
                }}
                helperText={errors.schedule_end_time?.[0] || ''}
                error={!!errors.schedule_end_time}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Este agendamento possui projeto?</FormLabel>
                <RadioGroup row value={hasProject} onChange={(e) => setHasProject(e.target.value)}>
                  <FormControlLabel value="true" control={<Radio />} label="Sim" />
                  <FormControlLabel value="false" control={<Radio />} label="Não" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {hasProject === 'true' && (
              <>
                <Grid item xs={12} sm={6}>
                  <GenericAsyncAutocompleteInput
                    label="Projeto"
                    value={formData.project}
                    onChange={(newValue) => {
                      setFormData({
                        ...formData,
                        project: newValue,
                        customer: newValue.customer,
                        branch: newValue.branch,
                        address: newValue.address,
                        product: newValue.product,
                      });
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
                    helperText={errors.project?.[0] || ''}
                    error={!!errors.project}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2">
                            <strong>Projeto:</strong> {option.project_number}
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
                              <Chip
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
                {formData.project && (
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
                        disabled
                        helperText={errors.customer?.[0] || ''}
                        error={!!errors.customer}
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
                        disabled
                        helperText={errors.branch?.[0] || ''}
                        error={!!errors.branch}
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
                        disabled
                        helperText={errors.product?.[0] || ''}
                        error={!!errors.product}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <GenericAsyncAutocompleteInput
                        label="Endereço"
                        value={formData.address}
                        onChange={(newValue) => setFormData({ ...formData, address: newValue })}
                        endpoint="/api/addresses/"
                        queryParam="street__icontains"
                        extraParams={{ fields: ['id', 'street'] }}
                        mapResponse={(data) =>
                          data.results.map((a) => ({ label: a.street, value: a.id }))
                        }
                        fullWidth
                        disabled={!!(formData.project && formData.project.address.value)}
                        helperText={errors.address?.[0] || ''}
                        error={!!errors.address}
                        required
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            {hasProject === 'false' && (
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
                    helperText={errors.customer?.[0] || ''}
                    error={!!errors.customer}
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
                    helperText={errors.branch?.[0] || ''}
                    error={!!errors.branch}
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
                    helperText={errors.product?.[0] || ''}
                    error={!!errors.product}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <GenericAsyncAutocompleteInput
                    label="Endereço"
                    value={formData.address}
                    onChange={(newValue) => setFormData({ ...formData, address: newValue })}
                    endpoint="/api/addresses/"
                    queryParam="street__icontains"
                    extraParams={{ fields: ['id', 'street'] }}
                    mapResponse={(data) =>
                      data.results.map((a) => ({ label: a.street, value: a.id }))
                    }
                    fullWidth
                    helperText={errors.address?.[0] || ''}
                    error={!!errors.address}
                    required
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                label="Observação"
                name="observation"
                value={formData.observation}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </BlankCard>
    </PageContainer>
  );
};

export default CreateSchedulePage;
