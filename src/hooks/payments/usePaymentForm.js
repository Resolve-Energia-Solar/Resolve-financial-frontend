import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import paymentService from '@/services/paymentService';
import paymentInstallmentService from '@/services/paymentInstallmentService';

const usePaymentForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    sale_id: null,
    borrower_id: null,
    financier_id: null,
    value: '',
    payment_type: '',
    installments_number: '',
    due_date: null,
    installments: [],
    create_installments: true,
    invoice_status: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        sale_id: initialData.sale?.id || null,
        borrower_id: initialData.borrower?.id || null,
        financier_id: initialData.financier?.id || null,
        value: initialData.value || '',
        payment_type: initialData.payment_type || '',
        installments_number: initialData.installments_number || '',
        due_date: initialData.due_date || null,
        installments: initialData.installments || [],
        invoice_status: initialData.invoice_status || '',
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

  // Ao adicionar uma nova parcela, definimos o id como null para que ela seja tratada como "nova"
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      installments: [
        ...prev.installments,
        {
          id: null,
          installment_value: '',
          installment_number: '',
          due_date: '',
          is_paid: false,
          payment: id,
        },
      ],
    }));
  };

  // Se a parcela tiver id, tenta excluir via API; caso contrário, remove somente do estado
  const handleDeleteItem = async (index) => {
    const installment = formData.installments[index];
    if (installment && installment.id) {
      try {
        await paymentInstallmentService.delete(installment.id);
      } catch (error) {
        console.error('Erro ao deletar parcela:', error);
      }
    }
    setFormData((prev) => {
      const newInstallments = prev.installments.filter((_, i) => i !== index);
      return { ...prev, installments: newInstallments };
    });
  };

  // A função handleSave envia os dados do pagamento sem as parcelas para o paymentService
  // e depois trata cada parcela usando o paymentInstallmentService (create ou update)
  const handleSave = async () => {
    setLoading(true);
    // Dados do pagamento, sem incluir parcelas
    const paymentDataToSend = {
      sale: formData.sale_id,
      borrower: formData.borrower_id,
      financier: formData.financier_id ? formData.financier_id : undefined,
      value: formData.value,
      payment_type: formData.payment_type,
      installments_number: formData.installments_number,
      due_date: formData.due_date ? formatDate(formData.due_date) : null,
      invoice_status: formData.invoice_status,
    };

    try {
      let paymentResponse;
      if (id) {
        paymentResponse = await paymentService.update(id, paymentDataToSend);
      } else {
        paymentResponse = await paymentService.create(paymentDataToSend);
      }
      setResponse(paymentResponse);

      const updatedInstallments = [];
      for (const installment of formData.installments) {
        let installmentResponse;
        if (installment.id) {
          installmentResponse = await paymentInstallmentService.update(
            installment.id,
            installment
          );
        } else {
          installmentResponse = await paymentInstallmentService.create(installment);
        }
        updatedInstallments.push(installmentResponse.data);
      }
      // Atualiza o estado com as parcelas atualizadas
      setFormData((prev) => ({ ...prev, installments: updatedInstallments }));
      setFormErrors({});
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      console.error('Erro ao salvar:', err);
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
    response,
    loading,
    handleInstallmentChange,
    handleAddItem,
    handleDeleteItem,
  };
};

export default usePaymentForm;
