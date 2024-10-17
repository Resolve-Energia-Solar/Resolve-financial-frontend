import { useState, useEffect } from 'react';
import serviceCatalogService from '@/services/serviceCatalogService';

const useServiceCatalogForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: null,
    deadline_id: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category_id: initialData.category.id || null,
        deadline_id: initialData.deadline.id || null,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      name: formData.name,
      description: formData.description,
      category_id: formData.category_id,
      deadline_id: formData.deadline_id,
    };

    try {
      if (id) {
        await serviceCatalogService.updateServiceCatalog(id, dataToSend);
      } else {
        await serviceCatalogService.createServiceCatalog(dataToSend);
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
  };
};

export default useServiceCatalogForm;
