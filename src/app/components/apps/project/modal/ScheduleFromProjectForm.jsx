'use client';

import { useState, useEffect } from 'react';
import { Grid, Stack, Button, CircularProgress } from '@mui/material';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import CreateAddressPage from '../../address/Add-address';
import projectService from '@/services/projectService';
import serviceCatalogService from '@/services/serviceCatalogService';
import { useSnackbar } from 'notistack';
import scheduleService from '@/services/scheduleService';
import { useSelector } from 'react-redux';

const ScheduleFromProjectForm = ({ projectId, categoryId, scheduleId, onSave = () => {}, loading, errors = {} }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [project, setProject] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const userId = useSelector(state => state.user?.user?.id);
  const [formData, setFormData] = useState({
    schedule_date: null,
    schedule_start_time: null,
    schedule_end_date: null,
    schedule_end_time: null,
    observation: null,
    service: null,
    address: null,
    customer: null,
    products: [],
    branch: null,
  });
  const [formErrors, setFormErrors] = useState({});

  // estados para deadline mínimo e flag de alteração
  const [deadlineDuration, setDeadlineDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [minEndDate, setMinEndDate] = useState(null);
  const [minEndTime, setMinEndTime] = useState(null);
  const [startChanged, setStartChanged] = useState(false);

  useEffect(() => {
    // fetch project defaults
    const fetchProject = async () => {
      if (!projectId) return;
      const data = await projectService.find(projectId, {
        fields: 'id,project_number,sale.customer.complete_name,sale.customer.id,address.id,product,sale.branch',
        expand: 'sale,sale.customer',
      });
      setProject(data);
      setFormData(prev => ({
        ...prev,
        address: data?.address?.id || null,
        customer: data?.sale?.customer?.id || null,
        products: [data?.product] || [],
        branch: data?.sale?.branch || null,
      }));
    };
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    // fetch existing schedule
    const fetchSchedule = async () => {
      if (!scheduleId) return;
      try {
        const data = await scheduleService.find(scheduleId, {
          fields: 'id,protocol,schedule_date,schedule_start_time,schedule_end_date,schedule_end_time,observation,address.id,service.id,service.name',
          expand: 'address,service',
        });
        setSchedule(data);
        setFormData(prev => ({
          ...prev,
          schedule_date: data?.schedule_date,
          schedule_start_time: data?.schedule_start_time
            ? new Date(`${data?.schedule_date}T${data?.schedule_start_time}`)
            : null,
          schedule_end_date: data?.schedule_end_date,
          schedule_end_time: data?.schedule_end_time
            ? new Date(`${data?.schedule_end_date}T${data?.schedule_end_time}`)
            : null,
          observation: data?.observation,
          address: data?.address?.id || prev.address,
          service: data?.service?.id || prev.service,
        }));
      } catch (err) {
        console.error('Erro ao carregar agendamento:', err);
        enqueueSnackbar('Erro ao carregar agendamento.', { variant: 'error' });
      }
    };
    fetchSchedule();
  }, [scheduleId]);

  useEffect(() => {
    // fetch deadline duration
    const fetchDeadline = async () => {
      if (!formData.service) return;
      try {
        const svc = formData.service.value || formData.service.id || formData.service;
        const data = await serviceCatalogService.find(svc, {
          expand: ['deadline'],
          fields: ['deadline.hours'],
        });
        const [h, m, s] = data.deadline.hours.split(':').map(Number);
        setDeadlineDuration({ hours: h, minutes: m, seconds: s });
      } catch (err) {
        console.error('Erro ao obter deadline:', err);
        enqueueSnackbar('Erro ao obter prazo mínimo.', { variant: 'error' });
      }
    };
    fetchDeadline();
  }, [formData.service]);

  useEffect(() => {
    // calcula valor mínimo para data e hora fim
    const { schedule_date, schedule_start_time } = formData;
    const { hours, minutes, seconds } = deadlineDuration;
    if (!schedule_date || !schedule_start_time || hours == null) return;
    let raw = schedule_start_time;
    let ts = raw instanceof Date ? raw.toTimeString().split(' ')[0] : String(raw);
    if (/^\d{2}:\d{2}$/.test(ts)) ts += ':00';
    const [hr, mn, sc] = ts.split(':').map(Number);
    const [YYYY, MM, DD] = schedule_date.split('-').map(Number);
    const startDT = new Date(YYYY, MM - 1, DD, hr, mn, sc);
    const minEndDT = new Date(startDT.getTime() + ((hours * 3600 + minutes * 60 + seconds) * 1000));
    if (!isNaN(minEndDT.getTime())) {
      setMinEndDate(minEndDT.toISOString().split('T')[0]);
      setMinEndTime(minEndDT);
    }
  }, [formData.schedule_date, formData.schedule_start_time, deadlineDuration]);

  useEffect(() => {
    // atualiza data/hora fim em novo ou após mudança de início
    if (scheduleId && !startChanged) return;
    if (!minEndDate || !minEndTime) return;
    setFormData(prev => ({
      ...prev,
      schedule_end_date: minEndDate,
      schedule_end_time: minEndTime,
    }));
  }, [minEndDate, minEndTime, startChanged]);

  const handleChange = (field, value) => {
    if (field === 'schedule_date' || field === 'schedule_start_time') setStartChanged(true);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { schedule_date, schedule_start_time, schedule_end_date, schedule_end_time, observation, service, address, customer, products, branch } = formData;
    if (!schedule_date || !schedule_start_time || !schedule_end_date || !schedule_end_time || !service || !address) {
      enqueueSnackbar('Preencha todos os campos obrigatórios.', { variant: 'warning' });
      return;
    }
    try {
      const fmt = t => (t instanceof Date ? t.toTimeString().split(' ')[0] : String(t));
      const payload = {
        project: projectId,
        schedule_creator: userId,
        schedule_date,
        schedule_start_time: fmt(schedule_start_time),
        schedule_end_date,
        schedule_end_time: fmt(schedule_end_time),
        observation,
        service: service.value || service.id || service,
        address: address.value || address.id || address,
        customer,
        products,
        branch,
      };
      const resp = scheduleId
        ? await scheduleService.update(scheduleId, payload)
        : await scheduleService.create(payload);
      onSave(resp);
      enqueueSnackbar('Agendamento salvo com sucesso!', { variant: 'success' });
    } catch (err) {
      setFormErrors(err.response?.data || {});
      console.error('Erro ao salvar agendamento:', err);
      enqueueSnackbar(err.response?.data?.message || 'Erro ao salvar agendamento.', { variant: 'error' });
    }
  };

  return (
    <form noValidate>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            label="Projeto"
            value={`${project?.project_number} - ${project?.sale?.customer?.complete_name}`}
            disabled
          />
        </Grid>
        {scheduleId && (
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="Agendamento"
              value={`${schedule?.protocol} - ${schedule?.service?.name}`}
              disabled
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <GenericAsyncAutocompleteInput
            label="Serviço"
            value={formData.service}
            onChange={val => handleChange('service', val)}
            endpoint="api/services"
            extraParams={{ fields: ['id', 'name'], ordering: ['name'], limit: 50, category__in: categoryId }}
            mapResponse={data => data?.results.map(it => ({ label: it.name, value: it.id }))}
            error={!!errors.service}
            helperText={errors.service?.[0]}
          />
        </Grid>
        <Grid item xs={6}>
          <GenericAsyncAutocompleteInput
            label="Endereço"
            value={formData.address}
            onChange={val => handleChange('address', val)}
            endpoint="api/addresses"
            queryParam="q"
            extraParams={{ fields: ['id', 'complete_address'], customer_id: formData.customer }}
            mapResponse={data => data?.results.map(it => ({ label: it.complete_address || it.name, value: it.id }))}
            renderCreateModal={({ onClose, onCreate, newObjectData, setNewObjectData }) => (
              <CreateAddressPage onClose={onClose} onCreate={onCreate} newObjectData={newObjectData} setNewObjectData={setNewObjectData} />
            )}
            error={!!errors.address}
            helperText={errors.address?.[0]}
          />
        </Grid>
        <Grid item xs={6}>
          <FormDate
            label="Data Início"
            name="schedule_date"
            value={formData.schedule_date}
            onChange={val => handleChange('schedule_date', val)}
            error={!!errors.schedule_date}
            helperText={errors.schedule_date?.[0]}
          />
        </Grid>
        <Grid item xs={6}>
          <FormTimePicker
            fullWidth
            label="Hora Início"
            name="schedule_start_time"
            value={formData.schedule_start_time}
            onChange={val => handleChange('schedule_start_time', val)}
            error={!!errors.schedule_start_time}
            helperText={errors.schedule_start_time?.[0]}
          />
        </Grid>
        {formData.schedule_date && formData.schedule_start_time && (
          <> 
            <Grid item xs={6}>
              <FormDate
                label="Data Fim"
                name="schedule_end_date"
                value={formData.schedule_end_date}
                onChange={val => handleChange('schedule_end_date', val)}
                error={!!errors.schedule_end_date}
                helperText={errors.schedule_end_date?.[0]}
                minDate={minEndDate}
              />
            </Grid>
            <Grid item xs={6}>
              <FormTimePicker
                fullWidth
                label="Hora Fim"
                name="schedule_end_time"
                value={formData.schedule_end_time}
                onChange={val => handleChange('schedule_end_time', val)}
                error={!!errors.schedule_end_time}
                helperText={errors.schedule_end_time?.[0]}
                minTime={minEndTime}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <CustomTextField
            multiline
            rows={4}
            fullWidth
            label="Observação"
            name="observation"
            value={formData.observation || ''}
            onChange={e => handleChange('observation', e.target.value)}
            error={!!errors.observation}
            helperText={errors.observation?.[0]}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              endIcon={loading && <CircularProgress size={20} />}
            >
              Salvar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export default ScheduleFromProjectForm;
