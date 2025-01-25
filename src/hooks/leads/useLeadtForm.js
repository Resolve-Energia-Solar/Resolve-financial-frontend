import { useState, useEffect } from 'react';
import leadService from '@/services/leadService';

const useLeadForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    seller_id: null,
    sdr_id: null,
    addresses_ids: [],
    column_id: null,
    origin_id: null,
    name: '',
    type: '',
    byname: '',
    first_document: '',
    second_document: '',
    birth_date: null,
    gender: '',
    contact_email: '',
    phone: '',
    origin: '',
    funnel: '',
    qualification: '',
    kwp: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        seller_id: initialData.seller?.id || null,
        sdr_id: initialData.sdr?.id || null,
        addresses_ids: initialData.addresses?.map((item) => item.id) || [],
        column_id: initialData.column?.id || null,
        origin_id: initialData.origin?.id || null,
        name: initialData.name || '',
        type: initialData.type || '',
        byname: initialData.byname || '',
        first_document: initialData.first_document || '',
        second_document: initialData.second_document || '',
        birth_date: initialData.birth_date || null,
        gender: initialData.gender || '',
        contact_email: initialData.contact_email || '',
        phone: initialData.phone || '',
        origin: initialData.origin || '',
        funnel: initialData.funnel || '',
        qualification: initialData.qualification || '',
        kwp: initialData.kwp || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToSend = {
      seller_id: formData.seller_id,
      sdr_id: formData.sdr_id,
      addresses_ids: formData.addresses_ids,
      column_id: formData.column_id,
      origin_id: formData.origin_id,
      name: formData.name,
      type: formData.type,
      byname: formData.byname,
      first_document: formData.first_document,
      second_document: formData.second_document,
      birth_date: formData.birth_date,
      gender: formData.gender,
      contact_email: formData.contact_email,
      phone: formData.phone,
      origin: formData.origin ? formData.origin : undefined,
      funnel: formData.funnel,
      qualification: formData.qualification !== '' ? Number(formData.qualification) : null,
      kwp: formData.kwp !== '' ? parseFloat(formData.kwp) : null,
    };

    try {
      let response;
      if (id) {
        response = await leadService.updateLead(id, dataToSend);
      } else {
        response = await leadService.createLead(dataToSend);
      }
      setDataReceived(response);
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
    dataReceived,
    formErrors,
    success,
    loading,
  };
};

export default useLeadForm;
