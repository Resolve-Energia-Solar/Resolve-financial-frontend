import { useState, useEffect } from 'react';
import attachmentService from '@/services/attachmentService';

const useAttachmentForm = (initialData, id, object_id, content_type) => {
  const [formData, setFormData] = useState({
    object_id: object_id,
    content_type: content_type,
    file: [],
    status: '',
    document_type: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  const refreshSuccessState = () => {
    setRefreshSuccess((prev) => !prev);
  };

  const clearForm = () => {
    setFormData({
      object_id: object_id,
      content_type: content_type,
      file: [],
      status: '',
      document_type: '',
      description: '',
    });
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        object_id: initialData.object_id,
        content_type: initialData.content_type,
        file: initialData.file,
        status: initialData.status,
        document_type: initialData.document_type,
        description: initialData.description,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    if (field === 'file') {
      const filesArray = value instanceof FileList ? Array.from(value) : [value];
      setFormData((prev) => ({ ...prev, [field]: filesArray }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true); // Inicia o loading
    const dataToSend = new FormData();
    const isFileArray = Array.isArray(formData.file) && formData.file.length > 0;

    dataToSend.append('object_id', formData.object_id);
    dataToSend.append('content_type', formData.content_type);
    dataToSend.append('status', formData.status);
    dataToSend.append('document_type', formData.document_type);
    dataToSend.append('description', formData.description);

    if (isFileArray) {
      formData.file.forEach((file) => {
        dataToSend.append('file', file);
      });
    }

    try {
      if (id) {
        await attachmentService.update(id, dataToSend);
      } else {
        await attachmentService.create(dataToSend);
      }

      setFormErrors({});
      setSuccess(true);
      refreshSuccessState();
      return true;
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      console.log(err.response?.data || err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    clearForm,
    handleChange,
    handleSave,
    formErrors,
    setFormErrors,
    success,
    refreshSuccess,
    loading,
  };
};

export default useAttachmentForm;
