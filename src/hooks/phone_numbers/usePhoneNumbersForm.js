import { useState, useEffect } from 'react';
import phoneNumberService from '@/services/phoneNumberService';

const usePhoneNumberForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    country_code: '',
    area_code: '',
    phone_number: '',
    is_main: false,
    user_id: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        country_code: initialData.country_code || '',
        area_code: initialData.area_code || '',
        phone_number: initialData.phone_number || '',
        is_main: initialData.is_main || false,
        user_id: initialData.user.id || '',
      });
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
      user_id: formData.user_id,
    };

    console.log('dataToSend', dataToSend);
    try {
      if (id) {
        await phoneNumberService.updatePhoneNumber(id, dataToSend);
      } else {
        await phoneNumberService.createPhoneNumber(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading,
  };
};

export default usePhoneNumberForm;

