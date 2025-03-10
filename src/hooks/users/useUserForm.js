import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import userService from '@/services/userService';

const useUserForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    branch_id: null,
    department_id: null,
    role_id: null,
    user_manager_id: null,
    addresses_ids: [],
    user_types_ids: [],
    groups_ids: [],
    last_login: null,
    is_superuser: false,
    username: '',
    first_name: '',
    is_staff: false,
    is_active: false,
    date_joined: null,
    complete_name: '',
    birth_date: null,
    gender: '',
    first_document: '',
    email: '',
    contract_type: '',
    hire_date: null,
    resignation_date: null,
    person_type: '',
    second_document: '',
    phone_numbers_ids: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        branch_id: initialData.branch?.id || null,
        department_id: initialData.department?.id || null,
        role_id: initialData.role?.id || null,
        user_manager_id: initialData.user_manager?.id || null,
        addresses_ids: initialData.addresses?.map((item) => item.id) || [],
        user_types_ids: initialData.user_types?.map((item) => item.id) || [],
        groups_ids: initialData.groups?.map((item) => item.id) || [],
        last_login: initialData.last_login || null,
        is_superuser: initialData.is_superuser || false,
        username: initialData.username || '',
        first_name: initialData.first_name || '',
        is_staff: initialData.is_staff || false,
        is_active: initialData.is_active || false,
        date_joined: initialData.date_joined || null,
        complete_name: initialData.complete_name || '',
        birth_date: initialData.birth_date || null,
        gender: initialData.gender || '',
        first_document: initialData.first_document || '',
        email: initialData.email || '',
        contract_type: initialData.contract_type || '',
        hire_date: initialData.hire_date || null,
        resignation_date: initialData.resignation_date || null,
        person_type: initialData.person_type || '',
        second_document: initialData.second_document || '',
        phone_numbers_ids: Array.isArray(initialData.phone_numbers)
          ? initialData.phone_numbers.map((item) => item.id)
          : initialData.phone_numbers
          ? [initialData.phone_numbers]
          : [],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  console.log('formData', formData);

  const handleSave = async () => {
    setLoading(true);
    const dataToSend = {
      branch_id: formData.branch_id,
      department_id: formData.department_id,
      role_id: formData.role_id,
      user_manager_id: formData.user_manager_id,
      addresses_ids: formData.addresses_ids,
      user_types_ids: formData.user_types_ids,
      groups_ids: formData.groups_ids,
      last_login: formData.last_login ? formatDate(formData.last_login) : null,
      is_superuser: formData.is_superuser,
      username: formData.username,
      first_name: formData.first_name,
      is_staff: formData.is_staff,
      is_active: formData.is_active,
      date_joined: formData.date_joined ? formatDate(formData.date_joined) : formatDate(new Date()),
      complete_name: formData.complete_name,
      birth_date: formData.birth_date ? formatDate(formData.birth_date) : null,
      gender: formData.gender,
      first_document: formData.first_document,
      email: formData.email,
      contract_type: formData.contract_type,
      hire_date: formData.hire_date ? formatDate(formData.hire_date) : null,
      resignation_date: formData.resignation_date ? formatDate(formData.resignation_date) : null,
      person_type: formData.person_type,
      second_document: formData.second_document,
      // Aqui garantimos que phone_numbers_ids seja enviado como array
      phone_numbers_ids: Array.isArray(formData.phone_numbers_ids)
        ? formData.phone_numbers_ids
        : formData.phone_numbers_ids
        ? [formData.phone_numbers_ids]
        : [],
    };

    console.log('dataToSend', dataToSend);
    try {
      if (id) {
        const request = await userService.updateUser(id, dataToSend);
        setDataReceived(request);
      } else {
        const request = await userService.createUser(dataToSend);
        setDataReceived(request);
      }
      setFormErrors({});
      setSuccess(true);
      setLoading(false);
      return true;
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      setLoading(false);
      console.log(err.response?.data || err);
      return false;
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

export default useUserForm;
