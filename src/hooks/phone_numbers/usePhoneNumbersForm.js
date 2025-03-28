import { useState, useEffect } from 'react';
import phoneNumberService from '@/services/phoneNumberService';
import { enqueueSnackbar } from 'notistack';

const usePhoneNumberForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    country_code: '',
    area_code: '',
    phone_number: '',
    is_main: false,
    user_id: '',
  });

  const [dataReceived, setDataReceived] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      const receivedData = {
        country_code: initialData.country_code || '',
        area_code: initialData.area_code || '',
        phone_number: initialData.phone_number || '',
        is_main: initialData.is_main || false,
        user_id: initialData.user?.id || '',
      };

      setFormData(receivedData);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToSend = {
      country_code: formData.country_code,
      area_code: formData.area_code,
      phone_number: formData.phone_number,
      is_main: formData.is_main,
      user: formData.user_id ? formData.user_id : undefined,
    };

    console.log('dataToSend', dataToSend);
    try {
      let response;
      if (id) {
        response = await phoneNumberService.update(id, dataToSend);
      } else {
        response = await phoneNumberService.create(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
      setDataReceived(response);
      enqueueSnackbar('Salvo com sucesso!', { variant: 'success' });
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      console.log(err.response?.data || err);
      enqueueSnackbar(`Erro ao salvar, contate o suporte: ${err}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    dataReceived,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading,
  };
};

export default usePhoneNumberForm;
