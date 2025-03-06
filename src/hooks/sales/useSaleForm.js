import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import saleService from '@/services/saleService';
import { useDispatch, useSelector } from 'react-redux';

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
    cancellationReasonsIds: []
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null); 

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customer?.id || null,
        sellerId: initialData.seller?.id || null,
        salesSupervisorId: initialData.sales_supervisor?.id || null,
        salesManagerId: initialData.sales_manager?.id || null,
        branchId: initialData.branch?.id || '',
        marketingCampaignId: initialData.marketing_campaign?.id || null,
        productIds: initialData.products?.map((product) => product) || [],
        payment_status: initialData.payment_status || null,
        isSale: initialData.is_pre_sale || false,
        totalValue: initialData.total_value || '',
        status: initialData.status || null,
        completedDocument: initialData.completed_document || false,
        billing_date: initialData.billing_date || null,
        cancellationReasonsIds: initialData.cancellation_reasons || []
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    let errors = { ...formErrors };

    if ((formData.status === 'D' || formData.status === 'C') && !formData.cancellationReasonsIds.length) {
      errors.cancellationReasonsIds = ['O motivo é obrigatório.'];
    } else {
      delete errors.cancellationReasonsIds;
    }
  
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    const dataToSend = {
      customer_id: formData.customerId,
      seller_id: formData.sellerId,
      sales_supervisor_id: formData.salesSupervisorId,
      sales_manager_id: formData.salesManagerId,
      branch_id: formData.branchId,
      marketing_campaign_id: formData.marketingCampaignId ? formData.marketingCampaignId : undefined,
      payment_status: formData.payment_status,
      products_ids: formData.productIds,
      is_pre_sale: formData.isSale,
      total_value: formData.totalValue,
      status: formData.status,
      completed_document: formData.completedDocument,
      billing_date: formData.billing_date || null,
      cancellation_reasons_ids: formData.cancellationReasonsIds
    };

    try {
      let response;
      if (id) {
        response = await saleService.updateSale(id, dataToSend);
      } else {
        response = await saleService.createSale(dataToSend);
      }
      setFormErrors({});
      setSuccess(true);
      setSuccessData(response);
    } catch (err) {
      setSuccess(false);
      setSuccessData(null);
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
    successData,
  };
};

export default useSaleForm;
