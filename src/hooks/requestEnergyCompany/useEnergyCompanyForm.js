import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import requestConcessionaireService from "@/services/requestConcessionaireService";

const useEnergyCompanyForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    company_id: null,
    project_id: null,
    type_id: '',
    unit_id: null,
    situation_ids: [],
    requested_by_id: null,
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
        company_id: initialData.company?.id || null,
        project_id: initialData.project?.id || null,
        type_id: initialData.type.id || '',
        unit_id: initialData.unit?.id || null,
        situation_ids: initialData.situation?.map((situation) => situation.id) || [],
        requested_by_id: initialData.requested_by?.id || null,
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
      company_id: formData.company_id,
      project_id: formData.project_id,
      type_id: formData.type_id,
      unit_id: formData.unit_id,
      situation_ids: formData.situation_ids,
      requested_by_id: formData.requested_by_id,
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
