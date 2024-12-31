import { useState, useEffect } from 'react';
import deadlineService from '@/services/deadlineService';
import { formatGetTime, formatTimeToSend } from '@/utils/inspectionFormatDate';

const useDeadlineForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    deadline_name: '',
    deadline_hours: '',
    deadline_observation: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        deadline_name: initialData.name || '',
        deadline_hours: initialData.hours || '',
        deadline_observation: initialData.observation || '',
      });
    }
  }, [initialData]);

  // Valida o formato HH:MM
  const validateHoursFormat = (value) => {
    const regex = /^(\d{1,2}):([0-5]?[0-9])$/; // Aceita formato HH:MM
    if (!regex.test(value)) {
      return 'O formato deve ser HH:MM.';
    }

    const [hours, minutes] = value.split(':').map(Number);
    if (hours > 99 || minutes > 59) {
      return 'Horas ou minutos inválidos. Máximo: 99:59.';
    }

    return null;
  };

  // Formata o valor para HH:mm:ss antes de salvar
  const formatTimeToSend = (timeString) => {
    if (!timeString || typeof timeString !== 'string') {
      return '00:00:00';
    }

    const [hours, minutes] = timeString.split(':').map((val) => parseInt(val, 10));

    if (isNaN(hours) || isNaN(minutes)) {
      return '00:00:00';
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };

  const handleChange = (field, value) => {
    if (field === 'deadline_hours') {
      const error = validateHoursFormat(value);
      setFormErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    console.log('formData', formData);

    const hoursError = validateHoursFormat(formData.deadline_hours);
    if (hoursError) {
      setFormErrors((prev) => ({
        ...prev,
        deadline_hours: hoursError,
      }));
      return;
    }

    const formattedHours = formatTimeToSend(formData.deadline_hours);

    const dataToSend = {
      name: formData.deadline_name,
      hours: formattedHours,
      observation: formData.deadline_observation,
    };

    try {
      if (id) {
        await deadlineService.updateDeadline(id, dataToSend);
      } else {
        await deadlineService.createDeadline(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      console.error(err.response?.data || err);
    }
  };

  return {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
  };
};

export default useDeadlineForm;
