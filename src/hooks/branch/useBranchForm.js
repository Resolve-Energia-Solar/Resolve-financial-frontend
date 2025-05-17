import { useState, useEffect } from 'react';
import branchService from '@/services/branchService';

const useBranchForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    owners: [],
    address: null,
    name: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        owners: initialData.owners.map((item) => item.id) || [],
        address: initialData.address.id || null,
        name: initialData.name || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = new FormData();

    formData.owners.forEach((owner) => {
      const id = typeof owner === 'object' ? owner.value || owner.id : owner;
      dataToSend.append('owners', id);
    });
    
    const addressId = typeof formData.address === 'object' ? formData.address.value || formData.address.id : formData.address;
    dataToSend.append('address', addressId);

    dataToSend.append('name', formData.name);
    try {
      if (id) {
        await branchService.update(id, dataToSend);
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
