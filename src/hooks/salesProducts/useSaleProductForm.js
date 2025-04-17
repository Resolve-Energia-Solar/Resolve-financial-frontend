import { useState, useEffect } from 'react';
import saleProductsService from '@/services/saleProductsService';

const useSaleProductForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    amount: '',
    value: '',
    cost_value: '',
    reference_value: '',
    average_consumption: '',
    estimated_consumption: '',
    product: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        value: initialData.value || '',
        cost_value: initialData.cost_value || '',
        reference_value: initialData.reference_value || '',
        average_consumption: initialData.average_consumption || '',
        estimated_consumption: initialData.estimated_consumption || '',
        product: initialData.product || null,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    let errors = { ...formErrors };
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    const dataToSend = {
      amount: formData.amount,
      value: formData.value,
      cost_value: formData.cost_value,
      reference_value: formData.reference_value,
      average_consumption: formData.average_consumption,
      estimated_consumption: formData.estimated_consumption,
      product: formData.product?.id || null,
    };

    try {
      let response;
      if (id) {
        response = await saleProductsService.update(id, dataToSend);
      } else {
        response = await saleProductsService.create(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
      setSuccessData(response);
    } catch (err) {
      setSuccess(false);
      setSuccessData(null);
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
    successData,
  };
};

export default useSaleProductForm;