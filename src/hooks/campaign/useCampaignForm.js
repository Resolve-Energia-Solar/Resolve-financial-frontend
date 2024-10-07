import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import campaignService from '@/services/campaignService';

const useCampaignForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    name: '',
    start_datetime: null,
    end_datetime: null,
    description: '',
    banner: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        start_datetime: initialData.start_datetime || null,
        end_datetime: initialData.end_datetime || null,
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
    const is_file = formData.banner instanceof File || (formData.banner instanceof FileList && formData.banner.length > 0);

    dataToSend.append('name', formData.name);
    dataToSend.append('start_datetime', formData.start_datetime ? formatDate(formData.start_datetime) : null);
    dataToSend.append('end_datetime', formData.end_datetime ? formatDate(formData.end_datetime) : null);
    dataToSend.append('description', formData.description);
    
    if (is_file) {
      dataToSend.append('banner', formData.banner);
    }

    try {
      if (id) {
        if (!is_file) {
          await campaignService.patchCampaign(id, dataToSend);
        } 
        else {
          await campaignService.updateCampaign(id, dataToSend);
        }
      } else {
        await campaignService.createCampaign(dataToSend);
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
