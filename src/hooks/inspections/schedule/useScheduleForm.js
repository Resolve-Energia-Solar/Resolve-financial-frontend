import { useState, useEffect } from 'react';
import scheduleService from '@/services/scheduleService';
import serviceCatalogService from '@/services/serviceCatalogService';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

const extractId = (fieldValue) => {
  if (Array.isArray(fieldValue)) {
    return fieldValue.map((item) =>
      typeof item === 'object' && item !== null && 'value' in item
        ? item.value
        : item
    );
  }
  return typeof fieldValue === 'object' && fieldValue !== null && 'value' in fieldValue
    ? fieldValue.value
    : fieldValue;
};

const useScheduleForm = (initialData, id, service_id) => {
  const user = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    schedule_creator: user?.user?.id || user?.user || null,
    branch: null,
    category: null,
    service: null,
    parent_schedules_id: [],
    customer: null,
    leads: [],
    project: null,
    schedule_agent: null,
    products: [],
    schedule_date: '',
    schedule_start_time: '',
    schedule_end_date: '',
    schedule_end_time: '',
    address: null,
    latitude: null,
    longitude: null,
    status: 'Pendente',
    observation: '',
    going_to_location_at: null,
    execution_started_at: null,
    execution_finished_at: null,
    service_opinion: null,
    final_service_opinion_id: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carrega initialData, incluindo branch
  useEffect(() => {
    if (initialData) {
      setFormData({
        schedule_creator: initialData.schedule_creator || null,
        branch: initialData.branch
          ? {
              label: initialData.branch.label,
              value: initialData.branch.value,
            }
          : null,
        service: initialData.service?.id || service_id,
        parent_schedules_id:
          initialData.parent_schedules?.map((s) => s.id) || [],
        customer: extractId(initialData.customer),
        leads: extractId(initialData.leads),
        project: extractId(initialData.project),
        schedule_agent: initialData.schedule_agent?.id || null,
        products: initialData.products || [],
        schedule_date: initialData.schedule_date || '',
        schedule_start_time: initialData.schedule_start_time || '',
        schedule_end_date: initialData.schedule_end_date || '',
        schedule_end_time: initialData.schedule_end_time || '',
        address: extractId(initialData.address),
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null,
        status: initialData.status || 'Pendente',
        observation: initialData.observation || '',
        going_to_location_at: initialData.going_to_location_at || null,
        execution_started_at: initialData.execution_started_at || null,
        execution_finished_at: initialData.execution_finished_at || null,
        service_opinion: initialData.service_opinion || null,
        final_service_opinion_id:
          initialData.final_service_opinion?.id ||
          initialData.service_opinion?.id ||
          null,
      });
    }
  }, [initialData, service_id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const calculateEndDateTime = async () => {
      if (
        !formData.schedule_date ||
        !formData.schedule_start_time ||
        !formData.service
      )
        return;
      try {
        const serviceId = extractId(formData.service);
        const serviceInfo = await serviceCatalogService.find(serviceId, {
          expand: ['deadline'],
          fields: ['deadline'],
        });
        const deadline = serviceInfo.deadline.hours;
        if (!deadline) return;

        let start = formData.schedule_start_time;
        if (!start.includes(':')) start += ':00';
        const [h, m, s] = start.split(':').map(Number);
        const [Y, Mo, D] = formData.schedule_date.split('-').map(Number);
        const startDate = new Date(Y, Mo - 1, D, h, m, s || 0);

        const [dh, dm, ds] = deadline.split(':').map(Number);
        const durationMs =
          (dh * 3600 + dm * 60 + (ds || 0)) * 1000;
        const end = new Date(startDate.getTime() + durationMs);

        const endDateStr = end.toISOString().split('T')[0];
        const endTimeStr = end.toTimeString().split(' ')[0];

        handleChange('schedule_end_date', endDateStr);
        handleChange('schedule_end_time', endTimeStr);
      } catch (error) {
        enqueueSnackbar(
          `Erro ao calcular a data de agendamento: ${error.message}`,
          { variant: 'error' }
        );
      }
    };
    calculateEndDateTime();
  }, [
    formData.schedule_date,
    formData.schedule_start_time,
    formData.service,
    enqueueSnackbar,
  ]);

  const handleSave = async () => {
    setLoading(true);
    const normalizedProducts = Array.isArray(formData.products)
      ? formData.products
      : [formData.products];

    const dataToSend = {
      schedule_creator: formData.schedule_creator,
      branch: extractId(formData.branch),             // envia branch
      service: extractId(formData.service),
      parent_schedules: formData.parent_schedules_id,
      customer: extractId(formData.customer),
      leads: formData.leads,
      project: extractId(formData.project),
      products: normalizedProducts.map((item) => extractId(item)),
      schedule_agent: extractId(formData.schedule_agent),
      schedule_date: formData.schedule_date,
      schedule_start_time: formData.schedule_start_time,
      schedule_end_date: formData.schedule_end_date,
      schedule_end_time: formData.schedule_end_time,
      address: extractId(formData.address),
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,
      observation: formData.observation,
      final_service_opinion: extractId(
        formData.final_service_opinion_id
      ),
      going_to_location_at: formData.going_to_location_at,
      execution_started_at: formData.execution_started_at,
      execution_finished_at: formData.execution_finished_at,
    };

    try {
      if (id) {
        await scheduleService.update(id, dataToSend);
      } else {
        await scheduleService.create(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
      enqueueSnackbar('Agendamento salvo com sucesso!', {
        variant: 'success',
      });
      return true;
    } catch (error) {
      setSuccess(false);
      setFormErrors(error.response?.data || {});
      const msg =
        error.response?.data?.detail || 'Erro ao salvar agendamento';
      enqueueSnackbar(msg, { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSave,
    loading,
    formErrors,
    success,
  };
};

export default useScheduleForm;
