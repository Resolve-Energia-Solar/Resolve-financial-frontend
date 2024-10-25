import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import paymentService from '@/services/paymentService';

const usePaymentForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    sale_id: null,
    financier_id: null,
    value: '',
    payment_type: '',
    installments_number: '',
    due_date: null,
    is_paid: false,
    installments: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Adiciona o estado de loading

  useEffect(() => {
    if (initialData) {
      setFormData({
        sale_id: initialData.sale?.id || null,
        financier_id: initialData.financier?.id || null,
        value: initialData.value || '',
        payment_type: initialData.payment_type || '',
        installments_number: initialData.installments_number || '',
        due_date: initialData.due_date || null,
        is_paid: initialData.is_paid || false,
        installments: initialData.installments || [],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInstallmentChange = (index, field, value) => {
    setFormData((prev) => {
      const newInstallments = [...prev.installments];
      newInstallments[index] = { ...newInstallments[index], [field]: value };
      return { ...prev, installments: newInstallments };
    });
  };

  const handleAddItem = () => {
    setFormData((prev) => {
      const newId = prev.installments.length > 0 
        ? Math.max(...prev.installments.map(installment => installment.id)) + 1 
        : 1;

      return {
        ...prev,
        installments: [
          ...prev.installments,
          { id: newId, installment_value: '', installment_number: '', due_date: '', is_paid: false, payment: id },
        ],
      };
    });
  };

  const handleDeleteItem = (index) => {
    setFormData((prev) => {
      const newInstallments = prev.installments.filter((_, i) => i !== index);
      return { ...prev, installments: newInstallments };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const dataToSend = {
      sale_id: formData.sale_id,
      financier_id: formData.financier_id,
      value: formData.value,
      payment_type: formData.payment_type,
      installments_number: formData.installments_number,
      due_date: formData.due_date ? formatDate(formData.due_date) : null,
      is_paid: formData.is_paid,
      installments: formData.installments,
    };

    try {
      if (id) {
        await paymentService.updatePayment(id, dataToSend);
      } else {
        await paymentService.createPayment(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      console.error("Erro ao salvar:", err);
      setFormErrors(err.response?.data || {});
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
    handleInstallmentChange,
    handleAddItem,
    handleDeleteItem,
  };
};

export default usePaymentForm;
