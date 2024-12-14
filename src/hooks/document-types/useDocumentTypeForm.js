import { useState, useEffect } from 'react';
import documentTypeService from '@/services/documentTypeService';

const useDocumentTypeForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    name: '',
    app_label: '',
    reusable: false,
    required: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        app_label: initialData.app_label || '',
        reusable: initialData.reusable || false,
        required: initialData.required || false,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(prev[field]) ? [...value] : value,
    }));
  };

  const handleSave = async () => {
    const dataToSend = {
      name: formData.name,
      app_label: formData.app_label,
      reusable: formData.reusable,
      required: formData.required,
    };

    try {
      if (id) {
        await documentTypeService.updateDocumentType(id, dataToSend);
      } else {
        await documentTypeService.createDocumentType(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
    }
  };

  return {
    formData,
    setFormData, // Expondo setFormData
    handleChange,
    handleSave,
    formErrors,
    success,
  };
};

export default useDocumentTypeForm;
