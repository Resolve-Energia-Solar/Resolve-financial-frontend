import { useState, useEffect } from 'react';
import unitService from '@/services/unitService';

const useUnitForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    address: null,
    supply_adquance: [],
    name: '',
    main_unit: false,
    unit_percentage: 0,
    type: '',
    new_contract_number: '',
    unit_number: '',
    account_number: '',
    project: null,
    bill_file: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        address: initialData.address?.id,
        supply_adquance: initialData.supply_adquance?.map((item) => item.id),
        name: initialData.name,
        main_unit: initialData.main_unit,
        unit_percentage: initialData.unit_percentage,
        type: initialData.type,
        new_contract_number: initialData.new_contract_number,
        unit_number: initialData.unit_number,
        account_number: initialData.account_number,
        project: initialData.project,
        bill_file: initialData.bill_file,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateFileNameWithHash = (file) => {
    if (!file) return null;

    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    return `${file.name.split('.')[0]}_${timestamp}.${fileExtension}`;
  };

  const handleSave = async () => {
    setLoading(true);
    const isFile =
      formData.bill_file instanceof File ||
      (formData.bill_file instanceof FileList && formData.bill_file.length > 0);
    const dataToSend = new FormData();

    dataToSend.append('address', formData.address);
    dataToSend.append('name', formData.name);
    dataToSend.append('main_unit', formData.main_unit);
    dataToSend.append('unit_percentage', formData.unit_percentage);
    dataToSend.append('type', formData.type);
    dataToSend.append('new_contract_number', formData.new_contract_number);
    dataToSend.append('unit_number', formData.unit_number);
    dataToSend.append('account_number', formData.account_number);
    dataToSend.append('project', formData.project);

    formData.supply_adquance.forEach((supplyAdquanceId) => {
      dataToSend.append('supply_adquance', supplyAdquanceId);
    });

    if (isFile) {
      const renamedFile = new File(
        [formData.bill_file],
        generateFileNameWithHash(formData.bill_file),
        { type: formData.bill_file.type },
      );
      dataToSend.append('bill_file', renamedFile);
    }

    try {
      if (id) {
        await unitService.update(id, dataToSend);
      } else {
        await unitService.create(dataToSend);
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
