import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import campaignService from '@/services/campaignService';

const useCampaignForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    name: '',
    start_date: null,
    end_date: null,
    description: '',
    banner: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        start_date: initialData.start_date || null,
        end_date: initialData.end_date || null,
        description: initialData.description || '',
        banner: initialData.banner || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = new FormData();
    const is_file =
      formData.banner instanceof File ||
      (formData.banner instanceof FileList && formData.banner.length > 0);

    dataToSend.append('name', formData.name);
    dataToSend.append('start_date', formData.start_date ? formatDate(formData.start_date) : null);
    dataToSend.append('end_date', formData.end_date ? formatDate(formData.end_date) : null);
    dataToSend.append('description', formData.description);

    if (is_file) {
      dataToSend.append('banner', formData.banner);
    }

    try {
      if (id) {
        if (!is_file) {
          await campaignService.update(id, dataToSend);
        } else {
          await campaignService.update(id, dataToSend);
        }
      } else {
        await campaignService.create(dataToSend);
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

export default useCampaignForm;
