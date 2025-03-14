// useAddressForm.js
import { useState, useEffect } from 'react';
import addressService from '@/services/addressService';
import { useSnackbar } from 'notistack';

const useAddressForm = (initialData, id) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    zip_code: '',
    country: '',
    state: '',
    city: '',
    neighborhood: '',
    street: '',
    number: '',
    complement: '',
    latitude: '',
    longitude: '',
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
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        user_id: initialData.user_id || '',
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
      latitude: formData.latitude,
      longitude: formData.longitude,
      user_id: formData.user_id ? formData.user_id : undefined,
    };

    try {
      let request;
      if (id) {
        request = await addressService.updateAddress(id, dataToSend);
      } else {
        request = await addressService.createAddress(dataToSend);
      }
      // Se a API estiver usando Axios, os dados estarão em request.data
      const responseData = request.data ? request.data : request;
      setDataReceived(responseData);
      // Atualiza o formData com os dados reais retornados (incluindo o id)
      setFormData(responseData);
      setFormErrors({});
      setSuccess(true);
      enqueueSnackbar("Endereço salvo com sucesso!", { variant: "success" });
      return responseData;
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      const errorMessage = err.response?.data?.detail || "Erro ao salvar endereço";
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw err;
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
