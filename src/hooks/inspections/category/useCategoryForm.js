import { useState, useEffect } from 'react';
import categoryService from '@/services/categoryService';

const useCategoryForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    name: '',
    members: [],
    main_category: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        members: initialData.members?.map((item) => item.id) || [],
        main_category: initialData.main_category || null,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      name: formData.name,
      members_id: formData.members,
      main_category: formData.main_category,
    };
    console.log('dataToSend: ', dataToSend);

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
