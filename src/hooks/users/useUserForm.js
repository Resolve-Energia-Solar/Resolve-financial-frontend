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
    user_types_ids: [2],
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
        addresses: initialData.addresses?.map((item) => item.id) || [],
        user_types: initialData.user_types?.map((item) => item.id) || [2],
        user_types_ids: initialData.user_types?.map((item) => item.id) || [2],
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

  const handleSave = async () => {
    setLoading(true);
    let patchData;
  
    if (initialData && initialData.id) {
      // Estamos atualizando: cria um objeto apenas com os campos alterados.
      patchData = {};
      const keysToCheck = [
        'branch_id',
        'department_id',
        'role_id',
        'user_manager_id',
        'addresses',
        'user_types',
        'groups_ids',
        'last_login',
        'is_superuser',
        'username',
        'first_name',
        'is_staff',
        'is_active',
        'date_joined',
        'complete_name',
        'birth_date',
        'gender',
        'first_document',
        'email',
        'contract_type',
        'hire_date',
        'resignation_date',
        'person_type',
        'second_document',
        'phone_numbers_ids',
      ];
  
      keysToCheck.forEach((key) => {
        let newValue;
        if (['last_login', 'date_joined', 'birth_date', 'hire_date', 'resignation_date'].includes(key)) {
          newValue = formData[key] ? formatDate(formData[key]) : null;
        } else {
          newValue = formData[key];
        }
        
        if (Array.isArray(newValue)) {
          const initialArray = initialData[key] || [];
          const arraysEqual =
            newValue.length === initialArray.length &&
            newValue.every((item, index) => item === initialArray[index]);
          if (!arraysEqual) {
            patchData[key] = newValue;
          }
        } else {
          // Se o valor novo for diferente do valor inicial, adiciona ao patch
          if (newValue !== initialData[key]) {
            patchData[key] = newValue;
          }
        }
      });
    } else {
      // Se não estiver em modo de edição, envia todos os dados
      patchData = {
        branch_id: formData.branch_id,
        department_id: formData.department_id,
        role_id: formData.role_id,
        user_manager_id: formData.user_manager_id,
        addresses: formData.addresses_ids,
        user_types: formData.user_types_ids,
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
        phone_numbers_ids: Array.isArray(formData.phone_numbers_ids)
          ? formData.phone_numbers_ids
          : formData.phone_numbers_ids
          ? [formData.phone_numbers_ids]
          : [],
      };
    }
  
    try {
      let request;
      if (id || (initialData && initialData.id)) {
        const userId = id || initialData.id;
        request = await userService.updateUser(userId, patchData);
        setDataReceived(request);
      } else {
        request = await userService.createUser(patchData);
        setDataReceived(request);
      }
      setFormErrors({});
      setSuccess(true);
      setLoading(false);
      return request;
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
