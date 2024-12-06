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
      const deadlineHours = formatGetTime(initialData.hours);

      setFormData({
        deadline_name: initialData.name || '',
        deadline_hours: deadlineHours || '',
        deadline_observation: initialData.observation || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    console.log('formData', formData);

    const dataToSend = {
      name: formData.deadline_name,
      hours: formatTimeToSend(formData.deadline_hours),
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
