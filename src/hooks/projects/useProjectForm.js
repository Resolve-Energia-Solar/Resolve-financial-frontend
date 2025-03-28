import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import projectService from '@/services/projectService';

const useProjectForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    sale: null,
    designer: null,
    homologator: null,
    project_number: '',
    start_date: null,
    end_date: null,
    is_completed: false,
    is_documentation_completed: false,
    status: '',
    designer_status: '',
    material_list_is_completed: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        sale: initialData.sale?.id,
        designer: initialData.designer?.id,
        homologator: initialData.homologator?.id,
        project_number: initialData.project_number,
        start_date: initialData.start_date ,
        end_date: initialData.end_date ,
        is_completed: initialData.is_completed,
        is_documentation_completed: initialData.is_documentation_completed,
        status: initialData.status ,
        designer_status: initialData.designer_status,
        material_list_is_completed: initialData.material_list_is_completed,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      sale: formData.sale,
      designer: formData.designer,
      homologator: formData.homologator,
      project_number: formData.project_number,
      start_date: formData.start_date ? formatDate(formData.start_date) : null,
      end_date: formData.end_date ? formatDate(formData.end_date) : null,
      is_completed: formData.is_completed,
      is_documentation_completed: formData.is_documentation_completed,
      status: formData.status,
      designer_status: formData.designer_status,
      material_list_is_completed: formData.material_list_is_completed,
    };

    setLoading(true);

    try {
      if (id) {
        await projectService.update(id, dataToSend);
      } else {
        await projectService.create(dataToSend);
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
