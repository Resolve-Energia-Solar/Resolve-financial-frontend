import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import requestConcessionaireService from "@/services/requestConcessionaireService";
import { useSelector } from 'react-redux';

const useEnergyCompanyForm = (initialData, id) => {
  
  const [formData, setFormData] = useState({
    company: null,
    project: null,
    type: '',
    unit: null,
    situation: [],
    requested_by: null,
    request_date: null,
    status: '',
    conclusion_date: null,
    interim_protocol: '',
    final_protocol: '',
    request: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company?.id || null,
        project: initialData.project?.id || null,
        type: initialData.type.id || '',
        unit: initialData.unit?.id || null,
        situation: initialData.situation?.map((situation) => situation.id) || [],
        requested_by: initialData.requested_by?.id || null,
        request_date: initialData.request_date ? initialData.request_date : null,
        status: initialData.status || '',
        conclusion_date: initialData.conclusion_date ? initialData.conclusion_date : null,
        interim_protocol: initialData.interim_protocol || '',
        final_protocol: initialData.final_protocol || '',
        request: initialData.request || null,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      company: formData.company,
      project: formData.project,
      type: formData.type,
      unit: formData.unit,
      situation: formData.situation,
      requested_by: formData.requested_by,
      request_date: formData.request_date ? formData.request_date : null,
      status: formData.status,
      conclusion_date: formData.conclusion_date ? formatDate(formData.conclusion_date) : null,
      interim_protocol: formData.interim_protocol,
      final_protocol: formData.final_protocol,
      request: formData.request,
    };

    console.log('dataToSend', dataToSend);

    setLoading(true);

    try {
      if (id) {
        await requestConcessionaireService.update(id, dataToSend);
      } else {
        await requestConcessionaireService.create(dataToSend);
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

export default useEnergyCompanyForm;
