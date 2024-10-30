import { useState, useEffect } from 'react';
import proposalService from '@/services/proposalService';
import formatDate from '@/utils/formatDate';

const useProposalForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    lead_id: null,
    created_by_id: null,
    due_date: null,
    value: null,
    status: null,
    observation: null,
    kits: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        lead_id: initialData.lead?.id || null,
        created_by_id: initialData.created_by?.id || null,
        due_date: initialData.due_date ? initialData.due_date : null,
        value: initialData.value || null,
        status: initialData.status || null,
        observation: initialData.observation || null,
        kits: initialData.kits || [],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      lead_id: formData.lead_id,
      created_by_id: formData.created_by_id,
      due_date: formData.due_date ? formatDate(formData.due_date) : null,
      value: formData.value,
      status: formData.status,
      observation: formData.observation,
      kits: formData.kits,
    };
    
    console.log('dataToSend', dataToSend);

    try {
      if (id) {
        await proposalService.updateProposal(id, dataToSend);
      } else {
        await proposalService.createProposal(dataToSend);
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
    setFormData
  };
};

export default useProposalForm;
