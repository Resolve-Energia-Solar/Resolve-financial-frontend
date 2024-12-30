import { useState, useEffect } from 'react';
import unitService from '@/services/unitService';

const useUnitForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    address_id: null,
    supply_adquance_ids: [],
    name: '',
    main_unit: false,
    unit_percentage: 0,
    type: '',
    new_contract_number: '',
    unit_number: '',
    account_number: '',
    project_id: null,
    project: null,
    bill_file: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        address_id: initialData.address?.id || null,
        supply_adquance_ids: initialData.supply_adquance?.map((item) => item.id) || [],
        name: initialData.name || '',
        main_unit: initialData.main_unit || false,
        unit_percentage: initialData.unit_percentage || 0,
        type: initialData.type || '',
        new_contract_number: initialData.new_contract_number || '',
        unit_number: initialData.unit_number || '',
        account_number: initialData.account_number || '',
        project_id: initialData.project || null,
        project: initialData.project || null,
        bill_file: initialData.bill_file || null,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true); // Define o estado de loading como true
    const is_file = formData.bill_file instanceof File || (formData.bill_file instanceof FileList && formData.bill_file.length > 0);
    const dataToSend = new FormData();
    
    dataToSend.append('address_id', formData.address_id);
    dataToSend.append('name', formData.name);
    dataToSend.append('main_unit', formData.main_unit);
    dataToSend.append('unit_percentage', formData.unit_percentage);
    dataToSend.append('type', formData.type);
    dataToSend.append('new_contract_number', formData.new_contract_number);
    dataToSend.append('unit_number', formData.unit_number);
    dataToSend.append('account_number', formData.account_number);
    dataToSend.append('project_id', formData.project_id);
    dataToSend.append('project', formData.project);

    formData.supply_adquance_ids.forEach((supplyAdquanceId) => {
      dataToSend.append('supply_adquance_ids', supplyAdquanceId);
    });

    if (is_file) {
      dataToSend.append('bill_file', formData.bill_file);
    }

    try {
      if (id) {
        await unitService.updateUnit(id, dataToSend);
      } else {
        await unitService.createUnit(dataToSend);
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

export default useUnitForm;
