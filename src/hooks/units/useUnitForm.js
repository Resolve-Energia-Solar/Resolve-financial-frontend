import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import unitService from '@/services/unitService';

const useUnitForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    address_id: null,
    supply_adquance_ids: [],
    name: '',
    main_unit: false,
    unit_percentage: 0,
    type: '',
    unit_number: '',
    account_number: '',
    project: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        address_id: initialData.address?.id || null,
        supply_adquance_ids: initialData.supply_adquances?.map((item) => item.id) || [],
        name: initialData.name || '',
        main_unit: initialData.main_unit || false,
        unit_percentage: initialData.unit_percentage || 0,
        type: initialData.type || '',
        unit_number: initialData.unit_number || '',
        account_number: initialData.account_number || '',
        project: initialData.project || null,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      address_id: formData.address_id,
      supply_adquance_ids: formData.supply_adquance_ids,
      name: formData.name,
      main_unit: formData.main_unit,
      unit_percentage: formData.unit_percentage,
      type: formData.type,
      unit_number: formData.unit_number,
      account_number: formData.account_number,
      project: formData.project,
    };
    console.log('dataToSend', dataToSend);
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

export default useUnitForm;
