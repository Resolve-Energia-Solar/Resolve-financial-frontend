import financialRecordService from '@/services/financialRecordService';
import { useState } from 'react';

export default function useFinancialRecordForm() {
  const [formData, setFormData] = useState({
    client_supplier_code: '',
    client_supplier_name: '',
    requesting_department_id: '',
    department_code: '',
    department_name: '',
    category_code: '',
    category_name: '',
    value: '',
    notes: '',
    payment_method: '',
    is_receivable: false,
    service_date: '',
    due_date: '',
    invoice_number: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    let errors = {};
    if (!formData.client_supplier_code) errors.client_supplier_code = 'Beneficiário obrigatório';
    if (!formData.value) errors.value = 'Valor obrigatório';
    if (!formData.payment_method) errors.payment_method = 'Forma de pagamento obrigatória';
    if (!formData.service_date) errors.service_date = 'Data de serviço obrigatória';
    if (!formData.due_date) errors.due_date = 'Data de vencimento obrigatória';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    try {
      console.log('Enviando dados:', formData);
      const response = await financialRecordService.createFinancialRecord(formData);
      console.log('Resposta da API:', response);
      if (response) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return { formData, handleChange, handleSave, formErrors, success };
}
