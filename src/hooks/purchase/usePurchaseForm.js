import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import purchaseService from '@/services/purchaseService';
import projectService from '@/services/projectService';

export const usePurchaseForm = (purchase = null) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false); // Mantido só para compatibilidade visual
  const [loadingProjects, setLoadingProjects] = useState(false);

  const [formData, setFormData] = useState({
    purchase_date: null,
    status: '',
    purchase_value: '',
    delivery_forecast: null,
    delivery_number: '',
    project: '',
    supplier: '',
  });

  const [errors, setErrors] = useState({});

  // Preenche form e fornecedores ao receber purchase
  useEffect(() => {
    if (purchase) {
      setFormData({
        purchase_date: purchase.purchase_date ? dayjs(purchase.purchase_date) : null,
        status: purchase.status || '',
        purchase_value: purchase.purchase_value || '',
        delivery_forecast: purchase.delivery_forecast ? dayjs(purchase.delivery_forecast) : null,
        delivery_number: purchase.delivery_number || '',
        project: purchase.project?.id || purchase.project || '',
        supplier: purchase.supplier?.id || purchase.supplier || '',
      });

      // 🔹 Define fornecedores apenas com base no purchase
      if (purchase.supplier) {
        setSuppliers([purchase.supplier]);
      } else {
        setSuppliers([]);
      }
    } else {
      resetForm();
      setSuppliers([]);
    }
  }, [purchase]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await projectService.index({
        fields: 'id,name,sale.customer.complete_name',
        expand: 'sale.customer',
        limit: 100,
      });

      let list = response.results || [];

      // 🔹 Garante que o projeto atual da compra apareça na lista
      if (purchase?.project && !list.some(p => p.id === purchase.project.id)) {
        list = [...list, purchase.project];
      }

      setProjects(list);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      enqueueSnackbar('Erro ao carregar projetos', { variant: 'error' });
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [purchase]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.purchase_date) {
      newErrors.purchase_date = 'Data da compra é obrigatória';
    } else if (!dayjs.isDayjs(formData.purchase_date)) {
      newErrors.purchase_date = 'Data da compra deve ser uma data válida';
    }

    if (
      formData.purchase_value &&
      (isNaN(formData.purchase_value) || parseFloat(formData.purchase_value) <= 0)
    ) {
      newErrors.purchase_value = 'Valor da compra deve ser um número positivo';
    }

    if (!formData.project) {
      newErrors.project = 'Projeto é obrigatório';
    }

    if (!formData.supplier) {
      newErrors.supplier = 'Fornecedor é obrigatório';
    }

    if (formData.delivery_forecast && formData.purchase_date) {
      if (dayjs.isDayjs(formData.delivery_forecast) && dayjs.isDayjs(formData.purchase_date)) {
        if (formData.delivery_forecast.isBefore(formData.purchase_date)) {
          newErrors.delivery_forecast = 'Data de entrega deve ser posterior à data de compra';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      enqueueSnackbar('Por favor, corrija os erros no formulário', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        purchase_date: formData.purchase_date ? formData.purchase_date.format('YYYY-MM-DD') : null,
        delivery_forecast: formData.delivery_forecast
          ? formData.delivery_forecast.format('YYYY-MM-DD')
          : null,
        purchase_value: parseFloat(formData.purchase_value),
      };

      if (purchase?.id) {
        await purchaseService.update(purchase.id, payload);
        enqueueSnackbar('Compra atualizada com sucesso', { variant: 'success' });
      } else {
        await purchaseService.create(payload);
        enqueueSnackbar('Compra criada com sucesso', { variant: 'success' });
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar compra:', error);
      let errorMessage = 'Erro ao salvar compra';

      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'object') {
          const fieldErrors = Object.values(data).flat();
          errorMessage = fieldErrors.join(', ');
        }
      }

      enqueueSnackbar(errorMessage, { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      purchase_date: null,
      status: '',
      purchase_value: '',
      delivery_forecast: null,
      delivery_number: '',
      project: '',
      supplier: '',
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    loading,
    suppliers,
    projects,
    loadingSuppliers,
    loadingProjects,
    handleChange,
    handleSubmit,
    resetForm,
    validateForm,
  };
};
