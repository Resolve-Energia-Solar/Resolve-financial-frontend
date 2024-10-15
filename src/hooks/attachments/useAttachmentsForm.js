import { useState, useEffect } from 'react';
import attachmentService from '@/services/attachmentService';

const useAttachmentForm = (initialData, id, object_id, content_type_id) => {
  const [formData, setFormData] = useState({
    object_id: object_id,
    content_type_id: content_type_id,
    file: [],
    status: '',
    document_type: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de loading

  useEffect(() => {
    if (initialData) {
      setFormData({
        object_id: initialData.object_id || null,
        content_type_id: initialData.content_type_id || null,
        file: initialData.file || [], // ensure this is an array
        status: initialData.status || null,
        document_type: initialData.document_type || null,
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    if (field === 'file') {
      // Ensure value is always treated as an array
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
    dataToSend.append('content_type_id', formData.content_type_id);
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
        await attachmentService.updateAttachment(id, dataToSend);
      } else {
        await attachmentService.createAttachment(dataToSend);
      }

      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      console.log(err.response?.data || err);
    } finally {
      setLoading(false); // Finaliza o loading
    }
  };

  return {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    loading, // Retorna o estado de loading
  };
};

export default useAttachmentForm;
