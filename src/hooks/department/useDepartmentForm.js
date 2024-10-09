import { useState, useEffect } from 'react';
import departmentService from '@/services/departmentService';

const useDepartmentForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (id) {
        await departmentService.updateDepartment(id, formData);
      } else {
        await departmentService.createDepartment(formData);
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

export default useDepartmentForm;