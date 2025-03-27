// hooks/inspections/schedule/UseSaleScheduleForm.js
import { useState } from 'react';
import scheduleService from '@/services/scheduleService';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

const UseSaleScheduleForm = (initialData = {}) => {
  const user = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    schedule_creator: user?.user?.id || user?.user || null,
    service: null,
    customer: null,
    project: null,
    products: [],
    schedule_date: '',
    schedule_start_time: '',
    schedule_end_date: '',
    schedule_end_time: '',
    address: null,
    status: 'Pendente',
    observation: '',
    ...initialData,
  });
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToSend = {
      ...formData,
    };

    try {
      if (formData.id) {
        await scheduleService.update(formData.id, dataToSend);
      } else {
        await scheduleService.create(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
      enqueueSnackbar("Agendamento salvo com sucesso!", { variant: "success" });
      return true;
    } catch (error) {
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

export default UseSaleScheduleForm;
