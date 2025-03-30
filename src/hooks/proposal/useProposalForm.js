import { useState, useEffect } from 'react';
import proposalService from '@/services/proposalService';
import { useSelector } from 'react-redux';

const useProposalForm = (initialData, id) => {
  const user = useSelector((state) => state.user?.user);

  const [formData, setFormData] = useState({
    lead_id: null,
    created_by_id: user?.id || null,
    commercial_products_ids: [],
    due_date: null,
    value: null,
    status: 'P',
    observation: '',
    medium_consumption: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        lead_id: initialData.lead?.id || null,
        created_by_id: initialData.created_by_id || user?.id || null,
        commercial_products_ids:
          initialData.commercial_products?.map((item) => item.product.id) || [],
        due_date: initialData.due_date || null,
        value: initialData.value || null,
        status: initialData.status || 'P',
        observation: initialData.observation || '',
      });
    }
  }, [initialData, user?.id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToSend = {
      lead_id: formData.lead_id,
      created_by_id: formData.created_by_id,
      commercial_products_ids: formData.commercial_products_ids,
      due_date: formData.due_date,
      value: formData.value,
      status: formData.status,
      observation: formData.observation,
    };

    try {
      if (id) {
        await proposalService.update(id, dataToSend);
      } else {
        await proposalService.create(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
      return true;
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      console.error(err.response?.data || err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading,
  };
};

export default useProposalForm;
