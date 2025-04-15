'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Button,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Typography,
  Grid,
  Link,
} from '@mui/material'; import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import BlankCard from '@/app/components/shared/BlankCard';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import scheduleService from '@/services/scheduleService';
import { useSnackbar } from 'notistack';
import AutoCompleteUserSchedule from '@/app/components/apps/inspections/auto-complete/Auto-input-UserSchedule';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { formatDate } from '@/utils/dateUtils';
import attachmentService from '@/services/attachmentService';
import getContentType from '@/utils/getContentType';

const UpdateSchedulePage = () => {
  const router = useRouter();
  const { id } = useParams();
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
    products: null,
    parent_schedules: null,
    attachments: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isEndModified, setIsEndModified] = useState(false);
  const [minEnd, setMinEnd] = useState({ date: '', time: '' });
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user?.user);
  const [tabValue, setTabValue] = useState('form');
  const [projectAttachments, setProjectAttachments] = useState([]);
  const [saleAttachments, setSaleAttachments] = useState([]);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleToggleAttachment = (attachmentId) => {
    const current = formData.attachments || [];
    if (current.includes(attachmentId)) {
      setFormData({ ...formData, attachments: current.filter((id) => id !== attachmentId) });
    } else {
      setFormData({ ...formData, attachments: [...current, attachmentId] });
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (id) {
      setLoading(true);
      scheduleService
        .find(id, {
          fields: [
            'schedule_date',
            'schedule_start_time',
            'schedule_end_date',
            'schedule_end_time',
            'service.id',
            'service.category',
            'customer',
            'project',
            'schedule_agent',
            'branch',
            'address',
            'observation',
            'products',
            'parent_schedules',
            'status',
            'attachments',
          ],
          expand: ['service'],
        })
        .then((data) => {
          setFormData({
            schedule_date: data.schedule_date ? data.schedule_date.split('T')[0] : '',
            schedule_start_time: data.schedule_start_time || '',
            schedule_end_date: data.schedule_end_date ? data.schedule_end_date.split('T')[0] : '',
            schedule_end_time: data.schedule_end_time || '',
            service: data.service,
            customer: data.customer,
            project: data.project,
            schedule_agent: data.schedule_agent,
            branch: data.branch,
            address: data.address,
            observation: data.observation || '',
            product: data.products && data.products.length > 0 ? data.products[0] : [],
            parent_schedules: data.parent_schedules && data.parent_schedules.length > 0 ? data.parent_schedules[0] : [],
            status: data.status,
            attachments: data.attachments || [],
          });
        })
        .catch((err) => {
          console.error('Erro ao carregar agendamento:', err);
          enqueueSnackbar('Erro ao carregar agendamento', { variant: 'error' });
          setError(`Erro ao carregar agendamento: ${err.message}`);
        })
        .finally(() => setLoading(false));
    }
  }, [id, enqueueSnackbar]);

  useEffect(() => {
    if (formData.project) {
      const projectContentType = getContentType('resolve_crm', 'project');
      const saleContentType = getContentType('resolve_crm', 'sale');
      const saleId = formData.sale;

      Promise.all([
        attachmentService.index({
          content_type_id: projectContentType,
          object_id: formData.project,
          expand: 'document_type',
          fields: 'id,document_type.name,description,created_at,file'
        }),
        attachmentService.index({
          content_type_id: saleContentType,
          object_id: saleId,
          expand: 'document_type',
          fields: 'id,document_type.name,description,created_at,file'
        })
      ])
        .then(([projectData, saleData]) => {
          const projectDataAttachments = Array.isArray(projectData)
            ? projectData
            : (projectData.results || []);
          const saleDataAttachments = Array.isArray(saleData)
            ? saleData
            : (saleData.results || []);
          setProjectAttachments(projectDataAttachments);
          setSaleAttachments(saleDataAttachments);
        })
        .catch((err) => console.error('Erro ao carregar anexos:', err));
    }
  }, [formData.project, formData.sale]);

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
      if (year && month && day && hour && minute) {
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
    }
  }, [formData.service, formData.schedule_date, formData.schedule_start_time]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const submitData = {
      ...formData,
      service: formData.service?.id,
      customer: formData.customer?.value || null,
      project: formData.project?.value,
      schedule_agent: formData.schedule_agent?.value,
      branch: formData.branch?.value || null,
      address: formData.address || null,
      schedule_creator: user.id,
      status: formData.status,
      service_opinion: formData.service_opinion?.value,
      final_service_opinion: formData.final_service_opinion?.value,
      products: formData.products ? [formData.products] : [],
      parent_schedules: Array.isArray(formData.parent_schedules)
      ? formData.parent_schedules.filter((ps) => ps && ps.value).map((ps) => ps.value)
      : [],

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
      await scheduleService.updateSchedule(id, submitData);
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
    { title: 'Atualizar Agendamento' },
  ];

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  const saleStatusMap = {
    P: ['Pendente', 'warning'],
    F: ['Finalizado', 'success'],
    EA: ['Em Andamento', 'info'],
    C: ['Cancelado', 'error'],
    D: ['Distrato', 'default'],
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getFileName = (file) => {
    if (typeof file === 'string') {
      return file.split('?')[0].split('/').pop();
    } else if (file instanceof File) {
      return file.name;
    }
    return '';
  };

  return (
    <PageContainer
      title="Atualizar Agendamento"
      description="Formulário para atualização do agendamento"
    >
      <Breadcrumb items={breadcrumbItems} />
      <BlankCard>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom marginBottom={4}>
            Atualizar Agendamento
          </Typography>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 3 }}>
            <Tab label="Formulário" tabIndex={1} />
            {formData.project && (
              <Tab label="Anexos" value="attachments" />
            )}
          </Tabs>

          {tabValue === 'form' && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Serviço"
                  value={formData.service?.id}
                  onChange={(newValue) => setFormData({ ...formData, service: newValue })}
                  endpoint="/api/services"
                  queryParam="name__icontains"
                  extraParams={{
                    fields: ['id', 'name', 'deadline.hours', 'category'],
                    expand: ['deadline'],
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
                  }}
                  {...(errors.schedule_agent_id && {
                    error: true,
                    helperText: formErrors.schedule_agent_id,
                  })}
                />
              </Grid>
              {/* Datas e horários */}
              <Grid item xs={12} sm={6}>
                <CustomTextField
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
                <CustomTextField
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
                <CustomTextField
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
                <CustomTextField
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
              {(formData.customer || formData.project) && <Grid item xs={12} sm={6}>
              <GenericAsyncAutocompleteInput
                label="Serviço Relacionado"
                value={formData.parent_schedules}
                onChange={(newValue) => setFormData({ ...formData, parent_schedules: newValue })}
                endpoint="/api/schedule"
                queryParam="protocol__icontains"
                extraParams={{
                  fields:
                    'id,protocol,schedule_date,schedule_start_time,schedule_end_date,schedule_end_time,status,service,customer.complete_name,address.complete_address,schedule_agent.complete_name,branch.name,service_opinion,final_service_opinion',
                  expand: 'customer,schedule_agent,service,address,final_service_opinion,service_opinion,branch',
                  customer: formData.customer?.value || '',
                  project: formData.project?.value || '',
                  customer_project_or: true
                }}
                mapResponse={(data) =>
                  data.results.map((s) => ({
                    label: s.protocol,
                    value: s.id,
                    ...s,
                  }))
                }
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box
                      sx={{ p: 1, display: 'flex', flexDirection: 'column' }}
                    >
                      <Typography variant="subtitle2">
                        <strong>Protocolo:</strong> {option.protocol}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Início:</strong> {formatDate(option.schedule_date)} {option.schedule_start_time.toLocaleString()} | <strong>Término:</strong> {formatDate(option.schedule_end_date)} {option.schedule_end_time.toLocaleString()}
                      </Typography>
                      <Typography variant="body1"><strong>Status:</strong> {option.status}</Typography>
                      {option.service && (
                        <Typography variant="body1">
                          <strong>Serviço:</strong> {option.service.name}
                        </Typography>
                      )}
                      {option.customer && <Typography variant="body1">
                        <strong>Cliente:</strong> {option.customer?.complete_name}
                      </Typography>}
                      {option.schedule_agent && <Typography variant="body1">
                        <strong>Agente:</strong> {option.schedule_agent.complete_name}
                      </Typography>
                      }
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
                          <strong>Opinião de Serviço:</strong> {option.service_opinion.name}
                        </Typography>
                      )}
                      {option.final_service_opinion && option.final_service_opinion.name && (
                        <Typography variant="body1">
                          <strong>Opinião Final:</strong> {option.final_service_opinion.name}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
                helperText={errors.parent_schedules?.[0] || ''}
                error={!!errors.parent_schedules}
                fullWidth
                required
              />
            </Grid>}
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  label="Status"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  fullWidth
                  helperText={errors.status?.[0] || ''}
                  error={!!errors.status}
                  required
                >
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Em Andamento">Em Andamento</MenuItem>
                  <MenuItem value="Confirmado">Confirmado</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Parecer do Agente"
                  value={formData.service_opinion}
                  onChange={(newValue) => setFormData({ ...formData, service_opinion: newValue })}
                  endpoint="/api/service-opinions"
                  queryParam="name__icontains"
                  extraParams={{
                    fields: ['id', 'name'],
                    service: `${formData.service?.id}`,
                  }}
                  mapResponse={(data) =>
                    data.results.map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))
                  }
                  helperText={errors.service_opinion?.[0] || ''}
                  error={!!errors.service_opinion}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Parecer Final"
                  value={formData.final_service_opinion}
                  onChange={(newValue) =>
                    setFormData({ ...formData, final_service_opinion: newValue })
                  }
                  endpoint="/api/service-opinions"
                  queryParam="name__icontains"
                  extraParams={{
                    fields: ['id', 'name'],
                    service: `${formData.service?.id}`,
                  }}
                  mapResponse={(data) =>
                    data.results.map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))
                  }
                  helperText={errors.final_service_opinion?.[0] || ''}
                  error={!!errors.final_service_opinion}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Projeto"
                  value={formData.project}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFormData({
                        ...formData,
                        project: newValue.value,
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
                  endpoint="/api/projects"
                  queryParam="q"
                  extraParams={{
                    expand: ['sale.customer', 'sale', 'sale.branch', 'product', 'sale.homologator'],
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
                    status__in: 'C,P,EA',
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
                          <strong>Produto:</strong> {option.product.label || 'Produto não Disponível'}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <GenericAsyncAutocompleteInput
                  label="Cliente"
                  value={formData.customer}
                  onChange={(newValue) => setFormData({ ...formData, customer: newValue })}
                  endpoint="/api/users"
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
                  endpoint="/api/branches"
                  queryParam="name__icontains"
                  extraParams={{ fields: ['id', 'name'] }}
                  mapResponse={(data) => data.results.map((b) => ({ label: b.name, value: b.id }))}
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
                  endpoint="/api/products"
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
                  endpoint="/api/addresses"
                  queryParam="street__icontains"
                  extraParams={{ fields: ['id', 'street'] }}
                  mapResponse={(data) => data.results.map((a) => ({ label: a.street, value: a.id }))}
                  fullWidth
                  helperText={errors.address?.[0] || ''}
                  error={!!errors.address}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  label="Observação"
                  name="observation"
                  value={formData.observation}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Grid>
          )}
          {formData.project && tabValue === 'attachments' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Anexos do Projeto</Typography>
              {projectAttachments.length ? (
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table aria-label="Tabela de Anexos do Projeto">
                    <TableHead>
                      <TableRow>
                        <TableCell>Selecionar</TableCell>
                        <TableCell>Nome do Arquivo</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Data de Upload</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectAttachments.map((attachment) => (
                        <TableRow key={attachment.id}>
                          <TableCell>
                            <Checkbox
                              checked={(formData.attachments || []).includes(attachment.id)}
                              onChange={() => handleToggleAttachment(attachment.id)}
                            />
                          </TableCell>
                          <TableCell>
                            {typeof attachment.file === 'string' ? (
                              <Link href={attachment.file} target="_blank" rel="noopener noreferrer">
                                {getFileName(attachment.file)}
                              </Link>
                            ) : (
                              getFileName(attachment.file)
                            )}
                          </TableCell>
                          <TableCell>{attachment.document_type.name || '-'}</TableCell>
                          <TableCell>{attachment.description || '-'}</TableCell>
                          <TableCell>
                            {attachment.created_at
                              ? new Date(attachment.created_at).toLocaleString('pt-BR')
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2">Nenhum anexo do projeto disponível.</Typography>
              )}

              <Typography variant="h6" sx={{ mb: 1 }}>Anexos da Venda</Typography>
              {saleAttachments.length ? (
                <TableContainer component={Paper}>
                  <Table aria-label="Tabela de Anexos da Venda">
                    <TableHead>
                      <TableRow>
                        <TableCell>Selecionar</TableCell>
                        <TableCell>Nome do Arquivo</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Data de Upload</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {saleAttachments.map((attachment) => (
                        <TableRow key={attachment.id}>
                          <TableCell>
                            <Checkbox
                              checked={(formData.attachments || []).includes(attachment.id)}
                              onChange={() => handleToggleAttachment(attachment.id)}
                            />
                          </TableCell>
                          <TableCell>
                            {typeof attachment.file === 'string' ? (
                              <Link href={attachment.file} target="_blank" rel="noopener noreferrer">
                                {getFileName(attachment.file)}
                              </Link>
                            ) : (
                              getFileName(attachment.file)
                            )}
                          </TableCell>
                          <TableCell>{attachment.document_type?.name || '-'}</TableCell>
                          <TableCell>{attachment.description || '-'}</TableCell>
                          <TableCell>
                            {attachment.created_at
                              ? new Date(attachment.created_at).toLocaleString('pt-BR')
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2">Nenhum anexo da venda disponível.</Typography>
              )}
            </Box>
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
    </PageContainer >
  );
};

export default UpdateSchedulePage;
