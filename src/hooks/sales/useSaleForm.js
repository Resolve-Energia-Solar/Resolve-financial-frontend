import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import saleService from '@/services/saleService';
import saleProductsService from '@/services/saleProductsService';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';

const useSaleForm = (initialData, id) => {
  const user = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    customerId: null,
    sellerId: null,
    salesSupervisorId: null,
    salesManagerId: null,
    branchId: null,
    marketingCampaignId: null,
    productIds: [],
    payment_status: null,
    isSale: true,
    totalValue: '',
    status: null,
    completedDocument: false,
    billing_date: null,
    cancellationReasonsIds: [],
    reference_table: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customer?.id || null,
        sellerId: initialData.seller || null,
        salesSupervisorId: initialData.sales_supervisor || null,
        salesManagerId: initialData.sales_manager || null,
        branchId: initialData.branch || '',
        marketingCampaignId: initialData.marketing_campaign || null,
        productIds: initialData.products?.map((product) => product.id) || [],
        payment_status: initialData.payment_status || null,
        isSale: initialData.is_pre_sale || false,
        totalValue: initialData.total_value || '',
        status: initialData.status || null,
        completedDocument: initialData.completed_document || false,
        billing_date: initialData.billing_date || null,
        cancellationReasonsIds: Array.isArray(initialData.cancellation_reasons)
          ? initialData.cancellation_reasons
          : [],
        reference_table: initialData.reference_table || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    let errors = { ...formErrors };

    if (
      (formData.status === 'D' || formData.status === 'C') &&
      !formData.cancellationReasonsIds.length
    ) {
      errors.cancellationReasonsIds = ['O motivo é obrigatório.'];
    } else {
      delete errors.cancellationReasonsIds;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      enqueueSnackbar('Erro ao salvar venda. Verifique os campos.', { variant: 'error' });
      setLoading(false);
      return;
    }

    const dataToSend = {
      customer: formData.customerId,
      seller: formData.sellerId,
      sales_supervisor: formData.salesSupervisorId,
      sales_manager: formData.salesManagerId,
      branch: formData.branchId,
      marketing_campaign: formData.marketingCampaignId || undefined,
      payment_status: formData.payment_status,
      products_ids: formData.productIds,
      is_pre_sale: formData.isSale,
      total_value: formData.totalValue,
      status: formData.status,
      completed_document: formData.completedDocument,
      billing_date: formData.billing_date || null,
      cancellation_reasons: formData.cancellationReasonsIds,
      reference_table: formData.reference_table,
    };

    try {
      const response = id
        ? await saleService.update(id, dataToSend)
        : await saleService.create(dataToSend);

      setFormErrors({});
      setSuccess(true);
      setSuccessData(response);
      enqueueSnackbar(`Venda ${id ? 'atualizada' : 'criada'} com sucesso!`, { variant: 'success' });
    } catch (err) {
      const apiErrors = err.response?.data || {};
      setFormErrors(apiErrors);
      enqueueSnackbar('Erro ao salvar venda. Verifique os campos.', { variant: 'error' });
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
    successData,
  };
};

export default useSaleForm;
