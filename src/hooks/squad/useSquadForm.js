import { useState, useEffect } from 'react';
import squadService from '@/services/squadService';

const useSquadForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    branch_id: null,
    manager_id: null,
    members_ids: [],
    name: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        branch_id: initialData.branch?.id || null,
        manager_id: initialData.manager?.id || null,
        members_ids: initialData.members?.map((item) => item.id) || [],
        name: initialData.name || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      branch_id: formData.branch_id,
      manager_id: formData.manager_id,
      members_ids: formData.members_ids,
      name: formData.name,
    };

    console.log('dataToSend', dataToSend);
    try {
      if (id) {
        await squadService.updateSquad(id, dataToSend);
      } else {
        await squadService.createSquad(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      console.log(err.response?.data || err);
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

export default useSquadForm;
