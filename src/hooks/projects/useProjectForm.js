import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import projectService from '@/services/projectService';

const useProjectForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    sale_id: null,
    designer_id: null,
    homologator_id: null,
    project_number: '',
    start_date: null,
    end_date: null,
    is_completed: false,
    status: '',
    designer_status: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        sale_id: initialData.sale?.id || null,
        designer_id: initialData.designer?.id || null,
        homologator_id: initialData.homologator?.id || null,
        project_number: initialData.project_number || '',
        start_date: initialData.start_date ? initialData.start_date : null,
        end_date: initialData.end_date ? initialData.end_date : null,
        is_completed: initialData.is_completed || false,
        status: initialData.status || '',
        designer_status: initialData.designer_status || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      sale_id: formData.sale_id,
      designer_id: formData.designer_id,
      homologator_id: formData.homologator_id,
      project_number: formData.project_number,
      start_date: formData.start_date ? formatDate(formData.start_date) : null,
      end_date: formData.end_date ? formatDate(formData.end_date) : null,
      is_completed: formData.is_completed,
      status: formData.status,
      designer_status: formData.designer_status,
    };

    setLoading(true);

    try {
      if (id) {
        await projectService.updateProject(id, dataToSend);
      } else {
        await projectService.createProject(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading,
  };
};

export default useProjectForm;
