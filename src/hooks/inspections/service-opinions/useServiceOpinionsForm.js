import { useState, useEffect } from 'react';
import serviceOpinionsService from '@/services/serviceOpinionsService';

const useServiceOpinionsForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    name: '',
    service_id: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        service_id: initialData.service.id || null,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      name: formData.name,
      service_id: formData.service_id,
    };

    try {
      if (id) {
        await serviceOpinionsService.update(id, dataToSend);
      } else {
        await serviceOpinionsService.create(dataToSend);
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

export default useServiceOpinionsForm;
