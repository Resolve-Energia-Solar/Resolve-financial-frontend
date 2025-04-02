import { useState, useEffect } from 'react';
import KitSolarService from '@/services/kitSolarService';

const useKitForm = (initialData) => {
  const [formData, setFormData] = useState({
    inversors_model_id: null,
    modules_model_id: null,
    branch_id: null,
    roof_type_id: null,
    inversor_amount: 0,
    modules_amount: 0,
    price: '',
    is_default: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        inversors_model_id: initialData.inversors_model?.id || null,
        modules_model_id: initialData.modules_model?.id || null,
        branch_id: initialData.branch?.id || null,
        roof_type_id: initialData.roof_type?.id || null,
        inversor_amount: initialData.inversor_amount || 0,
        modules_amount: initialData.modules_amount || 0,
        price: initialData.price || '',
        is_default: initialData.is_default || false,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToSend = {
      inversors_model_id: formData.inversors_model_id,
      modules_model_id: formData.modules_model_id,
      branch_id: formData.branch_id,
      roof_type_id: formData.roof_type_id,
      inversor_amount: formData.inversor_amount,
      modules_amount: formData.modules_amount,
      price: formData.price,
      is_default: formData.is_default,
    };

    try {
      await KitSolarService.create(dataToSend);
      setSnackbar({ open: true, message: 'Kit criado com sucesso!', severity: 'success' });
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setFormErrors(err.response?.data || {});
      setSnackbar({ open: true, message: 'Erro ao salvar o kit.', severity: 'error' });
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading,
    snackbar,
    closeSnackbar,
  };
};

export default useKitForm;
