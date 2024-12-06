import { useState, useEffect } from 'react';
import addressService from '@/services/addressService';

const useAddressForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    zip_code: '',
    country: '',
    state: '',
    city: '',
    neighborhood: '',
    street: '',
    number: '',
    complement: '',
    user_id: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataReceived, setDataReceived] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        zip_code: initialData.zip_code || '',
        country: initialData.country || '',
        state: initialData.state || '',
        city: initialData.city || '',
        neighborhood: initialData.neighborhood || '',
        street: initialData.street || '',
        number: initialData.number || '',
        complement: initialData.complement || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToSend = {
      zip_code: formData.zip_code,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      neighborhood: formData.neighborhood,
      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      user_id: formData.user_id ? formData.user_id : undefined,
    };

    try {
      if (id) {
        const request = await addressService.updateAddress(id, dataToSend);
        setDataReceived(request);
      } else {
        const request = await addressService.createAddress(dataToSend);
        setDataReceived(request);
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
    dataReceived,
    success,
    loading,
  };
};

export default useAddressForm;
