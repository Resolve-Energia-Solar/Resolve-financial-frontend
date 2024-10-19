import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import saleService from '@/services/saleService';
import { useDispatch, useSelector } from 'react-redux';


const useSaleForm = (initialData, id) => {
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    customerId: null,
    sellerId: user?.user?.id,
    salesSupervisorId: user?.user?.user_manager?.user_manager,
    salesManagerId: user?.user?.user_manager.id,
    branchId: user?.user?.branch?.id,
    marketingCampaignId: null,
    leadId: null,
    isSale: false,
    totalValue: '',
    status: '',
    completedDocument: false,
    documentCompletionDate: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customer?.id || null,
        sellerId: initialData.seller?.id || null,
        salesSupervisorId: initialData.sales_supervisor?.id || null,
        salesManagerId: initialData.sales_manager?.id || null,
        branchId: initialData.branch?.id || '',
        marketingCampaignId: initialData.marketing_campaign?.id || null,
        leadId: initialData.lead?.id || null,
        isSale: initialData.is_sale || false,
        totalValue: initialData.total_value || '',
        status: initialData.status || '',
        completedDocument: initialData.completed_document || false,
        documentCompletionDate: initialData.document_completion_date
          ? new Date(initialData.document_completion_date)
          : null,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const dataToSend = {
      customer_id: formData.customerId,
      seller_id: formData.sellerId,
      sales_supervisor_id: formData.salesSupervisorId,
      sales_manager_id: formData.salesManagerId,
      branch_id: formData.branchId,
      marketing_campaign_id: formData.marketingCampaignId,
      lead_id: formData.leadId,
      is_sale: formData.isSale,
      total_value: formData.totalValue,
      status: formData.status,
      completed_document: formData.completedDocument,
      document_completion_date: formData.documentCompletionDate
        ? formatDate(formData.documentCompletionDate)
        : null,
    };

    try {
      if (id) {
        await saleService.updateSale(id, dataToSend);
      } else {
        await saleService.createSale(dataToSend);
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

export default useSaleForm;
