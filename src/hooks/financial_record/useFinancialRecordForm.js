import { useState, useEffect } from 'react';
import financialRecordService from '@/services/financialRecordService';

const useFinancialRecordForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      name: formData.name,
    };

    try {
      if (id) {
        await financialRecordService.updateFinancialRecord(id, dataToSend);
      } else {
        await financialRecordService.createFinancialRecord(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
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

export default useFinancialRecordForm;