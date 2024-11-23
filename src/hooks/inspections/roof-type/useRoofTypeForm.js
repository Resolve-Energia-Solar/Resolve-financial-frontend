import { useState, useEffect } from 'react';
import roofTypeService from '@/services/roofTypeService';

const useRoofTypeForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    name: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      name: formData.name,
    };

    try {
      if (id) {
        await roofTypeService.patchRoofType(id, dataToSend);
      } else {
        await roofTypeService.createRoofType(dataToSend);
      }

      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response.data || {});
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

export default useRoofTypeForm;
