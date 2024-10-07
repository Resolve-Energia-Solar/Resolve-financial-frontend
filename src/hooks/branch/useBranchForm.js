import { useState, useEffect } from 'react';
import branchService from '@/services/branchService';

const useBranchForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    owners_ids: [],
    address_id: null,
    name: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        owners_ids: initialData.owners.map((item) => item.id) || [],
        address_id: initialData.address.id || null,
        name: initialData.name || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = new FormData();

    formData.owners_ids.forEach((ownerId) => {
      dataToSend.append('owners_ids', ownerId);
    });

    dataToSend.append('address_id', formData.address_id);
    dataToSend.append('name', formData.name);
    console.log("dataToSend", dataToSend);
    try {
      if (id) {
        await branchService.updateBranch(id, dataToSend);
      } else {
        await branchService.createBranch(dataToSend);
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

export default useBranchForm;
