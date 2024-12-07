import { useState, useEffect } from 'react';

/* Services */
import formBuilderService from '@/services/formBuilderService';

const useFormBuilderForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    service_id: null,
    form_name: '',
    form_fields: [],
    created_at: null,
    service: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        service_id: initialData.service?.id || null,
        service: initialData.service || null,
        form_name: initialData.name || '',
        form_fields: JSON.parse(initialData.campos) || [],
        created_at: initialData.created_at,
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
    const fieldsJSON = JSON.stringify(formData.form_fields);

    const dataToSend = {
      service_id: formData.service_id,
      name: formData.form_name,
      campos: fieldsJSON,
    };

    console.log(dataToSend);
    try {
      if (id) {
        await formBuilderService.updateForm(id, dataToSend);
      } else {
        await formBuilderService.createForm(dataToSend);
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

export default useFormBuilderForm;
