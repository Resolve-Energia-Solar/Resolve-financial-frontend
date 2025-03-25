import { useState, useEffect } from 'react';
import scheduleService from '@/services/scheduleService';
import serviceCatalogService from '@/services/serviceCatalogService';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID;

// Função auxiliar para extrair o id, se o valor for um objeto com a propriedade "value"
const extractId = (fieldValue) => {
  return (typeof fieldValue === 'object' && fieldValue !== null && 'value' in fieldValue)
    ? fieldValue.value
    : fieldValue;
};

const useScheduleForm = (initialData, id, service_id) => {
  const user = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  // Estado inicial simples do formulário (armazenando apenas IDs nos campos de relacionamento)
  const [formData, setFormData] = useState({
    schedule_creator: user?.user?.id || user?.user || null,
    category: null,
    service: service_id || SERVICE_INSPECTION_ID,
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

  // Inicializa o formData com os dados iniciais, extraindo somente os IDs quando possível
  useEffect(() => {
    if (initialData) {
      console.log("Inicializando formData com initialData:", initialData);
      setFormData({
        schedule_creator: initialData.schedule_creator || null,
        service: initialData.service?.id || service_id || SERVICE_INSPECTION_ID,
        parent_schedules_id: initialData.parent_schedules?.map(s => s.id) || [],
        customer: initialData?.customer?.id || null,
        leads: initialData.leads?.map(l => l.id) || [],
        project: initialData.project?.id || null,
        schedule_agent: initialData.schedule_agent?.id || null,
        products: initialData.products || [],
        schedule_date: initialData.schedule_date || '',
        schedule_start_time: initialData.schedule_start_time || '',
        schedule_end_date: initialData.schedule_end_date || '',
        schedule_end_time: initialData.schedule_end_time || '',
        address: initialData?.address?.id || null,
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null,
        status: initialData.status || 'Pendente',
        observation: initialData.observation || '',
        going_to_location_at: initialData.going_to_location_at || null,
        execution_started_at: initialData.execution_started_at || null,
        execution_finished_at: initialData.execution_finished_at || null,
        service_opinion: initialData.service_opinion || null,
        final_service_opinion_id:
          initialData.final_service_opinion?.id || initialData.service_opinion?.id || null,
      });
    }
  }, [initialData, service_id]);

  // Handler para atualizar o formData (mantém a chamada como você deseja)
  const handleChange = (field, value) => {
    console.log(`handleChange: ${field} =`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  console.log("!formData.schedule_date || !formData.schedule_start_time || !formData.service", !formData.schedule_date, !formData.schedule_start_time, !formData.service);

  useEffect(() => {
    const calculateEndDateTime = async () => {
      if (!formData.schedule_date || !formData.schedule_start_time || !formData.service) return;
      try {
        console.log("Calculando data/hora final para:", formData.schedule_date, formData.schedule_start_time);
        
        const serviceId = extractId(formData.service);
        const serviceInfo = await serviceCatalogService.getServiceCatalogById(serviceId, {
          expand: 'deadline',
          fields: 'deadline',
        });
        console.log("Serviço retornado:", serviceInfo);
        
        const deadline = serviceInfo.deadline.hours;
        if (!deadline) {
          console.warn("Deadline não definido no serviço");
          return;
        }
        
        let normalizedStartTime = formData.schedule_start_time;
        if (!normalizedStartTime.includes(':')) {
          normalizedStartTime += ':00';
        }
        console.log("Horário de início normalizado:", normalizedStartTime);
        
        const [startHour, startMinute, startSecond] = normalizedStartTime.split(':').map(Number);
        const [year, month, day] = formData.schedule_date.split('-').map(Number);
        const startDate = new Date(year, month - 1, day, startHour, startMinute, startSecond || 0);
        console.log("Data de início:", startDate);
        
        const [dHour, dMinute, dSecond] = deadline.split(':').map(Number);
        const durationMs = ((dHour * 3600) + (dMinute * 60) + (dSecond || 0)) * 1000;
        const endDate = new Date(startDate.getTime() + durationMs);
        
        const endDateStr = endDate.toISOString().split('T')[0];
        const endTimeStr = endDate.toTimeString().split(' ')[0];
        console.log("Data final calculada:", endDateStr, endTimeStr);
        
        handleChange('schedule_end_date', endDateStr);
        handleChange('schedule_end_time', endTimeStr);
      } catch (error) {
        console.error("Erro ao calcular data/hora final:", error.message);
        enqueueSnackbar(`Erro ao calcular a data de agendamento: ${error.message}`, { variant: 'error' });
      }
    };
  
    calculateEndDateTime();
  }, [formData.schedule_date, formData.schedule_start_time, formData.service, enqueueSnackbar]);
  

  // Função para salvar os dados – aqui transformamos os campos para enviar somente os IDs
  const handleSave = async () => {
    console.log("Iniciando handleSave com formData:", formData);
    setLoading(true);

    const normalizedProducts = Array.isArray(formData.products)
      ? formData.products
      : [formData.products];

    // Constrói o payload extraindo somente os IDs dos campos que podem vir como objeto
    const dataToSend = {
      schedule_creator: formData.schedule_creator,
      service: extractId(formData.service),
      parent_schedules: formData.parent_schedules_id || undefined,
      customer: extractId(formData.customer),
      leads: formData.leads,
      project: extractId(formData.project),
      products: normalizedProducts.map(item => extractId(item)),
      schedule_agent: extractId(formData.schedule_agent) || null,
      schedule_date: formData.schedule_date,
      schedule_start_time: formData.schedule_start_time,
      schedule_end_date: formData.schedule_end_date,
      schedule_end_time: formData.schedule_end_time,
      address: extractId(formData.address),
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,
      observation: formData.observation,
      final_service_opinion: extractId(formData.final_service_opinion_id),
      going_to_location_at: formData.going_to_location_at,
      execution_started_at: formData.execution_started_at,
      execution_finished_at: formData.execution_finished_at,
    };

    try {
      if (id) {
        console.log("Atualizando agendamento com id:", id);
        await scheduleService.updateSchedule(id, dataToSend);
      } else {
        console.log("Criando novo agendamento");
        await scheduleService.createSchedule(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
      console.log("Agendamento salvo com sucesso!");
      enqueueSnackbar("Agendamento salvo com sucesso!", { variant: "success" });
      return true;
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error.response?.data || error);
      setSuccess(false);
      setFormErrors(error.response?.data || {});
      const errorMessage = error.response?.data?.detail || "Erro ao salvar agendamento";
      enqueueSnackbar(errorMessage, { variant: "error" });
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
