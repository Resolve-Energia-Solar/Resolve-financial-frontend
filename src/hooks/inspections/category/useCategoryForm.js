import { useState, useEffect } from 'react';
import categoryService from '@/services/categoryService';

const useCategoryForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    main_category: null,
    name: '',
    squads: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        main_category: initialData.main_category || null,
        name: initialData.name || '',
        squads: initialData.squads?.map((item) => item.id) || [],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      main_category: formData.main_category,
      name: formData.name,
      squads_id: formData.squads,
    };

    console.log('dataToSend', dataToSend);
    try {
      if (id) {
        await categoryService.updateCategory(id, dataToSend);
      } else {
        await categoryService.createCategory(dataToSend);
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

export default useCategoryForm;
