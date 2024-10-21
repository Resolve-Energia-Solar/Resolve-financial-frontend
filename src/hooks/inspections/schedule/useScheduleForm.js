import { useState, useEffect } from 'react';
import scheduleService from '@/services/scheduleService';

const useScheduleForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: '',
    category: null,
    inspector: null,
    status: 'PENDING',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || '',
        time: initialData.time || '',
        address: initialData.address || '',
        category: initialData.category || null,
        inspector: initialData.inspector || null,
        status: initialData.status || 'PENDING',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      date: formData.date,
      time: formData.time,
      address: formData.address,
      category_id: formData.category,
      inspector_id: formData.inspector,
      status: formData.status,
    };

    try {
      if (id) {
        await scheduleService.updateSchedule(id, dataToSend);
      } else {
        await scheduleService.createSchedule(dataToSend);
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

export default useScheduleForm;
