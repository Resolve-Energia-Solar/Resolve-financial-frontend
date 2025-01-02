import { useState, useEffect } from 'react';

/* Services */
import formBuilderService from '@/services/formBuilderService';

const useFormBuilderForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    service_id: null,
    service: '',
    form_name: '',
    form_fields: [],
    service: null,
    created_at: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        service_id: initialData.service?.id || null,
        service: initialData.service || null,
        form_name: initialData.name || '',
        form_fields: JSON.parse(initialData.fields) || [],
        created_at: initialData.created_at || '',
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
    setLoading(true);

    const fieldsJSON = JSON.stringify(formData.form_fields);

    const dataToSend = {
      name: formData.form_name,
      fields: fieldsJSON,
    };

    console.log('dataToSend', dataToSend);
    try {
      let response;
      if (id) {
        response = await formBuilderService.updateForm(id, dataToSend);
      } else {
        response = await formBuilderService.createForm(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
      setLoading(false);
      setDataReceived(response);
    } catch (err) {
      setSuccess(false);
      setLoading(false);
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
    loading,
    dataReceived,
  };
};

export default useFormBuilderForm;
