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
    // sale_products: [],
    // product: null,
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

  // const handleSaleProductsChange = (index, field, value) => {
  //   const updatedSaleProducts = [...formData.sale_products];
  //   const fieldPath = field.replace('sale_products.', '');
    
  //   if (fieldPath.includes('.')) {
  //     // Handle nested fields if needed
  //     const [parent, child] = fieldPath.split('.');
  //     updatedSaleProducts[index][parent][child] = value;
  //   } else {
  //     updatedSaleProducts[index][fieldPath] = value;
  //   }
  
  //   setFormData(prev => ({
  //     ...prev,
  //     sale_products: updatedSaleProducts
  //   }));
  // };
  

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
      setLoading(false);
      return;
    }

    const dataToSend = {
      customer: formData.customerId,
      seller: formData.sellerId,
      sales_supervisor: formData.salesSupervisorId,
      sales_manager: formData.salesManagerId,
      branch: formData.branchId,
      marketing_campaign: formData.marketingCampaignId
        ? formData.marketingCampaignId
        : undefined,
      payment_status: formData.payment_status,
      products_ids: formData.productIds,
      is_pre_sale: formData.isSale,
      total_value: formData.totalValue,
      status: formData.status,
      completed_document: formData.completedDocument,
      billing_date: formData.billing_date || null,
      cancellation_reasons: formData.cancellationReasonsIds,
      reference_table: formData.reference_table,
      // sale_products: formData.sale_products.map((sale_product) => ({
      //   id: sale_product.id,
      //   value: sale_product.value,
      //   cost_value: sale_product.cost_value,
      //   reference_value: sale_product.reference_value,
      // })),
    };

    try {
      let response;
      if (id) {
        response = await saleService.update(id, dataToSend);
      } else {
        response = await saleService.create(dataToSend);
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

  // const handleSaveSaleProducts = async () => {
  //   console.log('Current formData:', formData);
  //   setLoading(true);
  
  //   try {
  //     const dataToSend = {
  //       sale_products: formData.sale_products.map(product => ({
  //         value: product.value,
  //         cost_value: product.cost_value,
  //         reference_value: product.reference_value
  //       }))
  //     };
  
  //     console.log('data being sent:', dataToSend); 
      
  //     const response = await saleProductsService.update(id, dataToSend);
  //     console.log('response:', response);
      
  //     setFormErrors({});
  //     enqueueSnackbar('Informações atualizadas com sucesso!', { variant: 'success' });
  //     return response;
  //   } catch (err) {
  //     console.error('Erro ao salvar alterações:', err);
  //     setFormErrors(err.response?.data || {});
  //     enqueueSnackbar('Erro ao salvar alterações', { variant: 'error' });
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return {
    formData,
    handleChange,
    // handleSaleProductsChange,
    handleSave,
    // handleSaveSaleProducts,
    formErrors,
    success,
    loading,
    successData,
  };
};

export default useSaleForm;
