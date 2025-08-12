import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import purchaseService from '@/services/purchaseService';

// Configurar dayjs para usar locale brasileiro
dayjs.locale('pt-br');

export const usePurchaseForm = (purchase = null) => {
  const { enqueueSnackbar } = useSnackbar();

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
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Carrega suppliers e projects
  useEffect(() => {
    const loadSuppliers = async () => {
      setLoadingSuppliers(true);
      try {
        // Aqui você pode fazer uma chamada para a API para buscar suppliers
        // Por enquanto, vou usar um array vazio
        setSuppliers([]);
      } catch (error) {
        console.error('Erro ao carregar suppliers:', error);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    const loadProjects = async () => {
      setLoadingProjects(true);
      try {
        // Aqui você pode fazer uma chamada para a API para buscar projects
        // Por enquanto, vou usar um array vazio
        setProjects([]);
      } catch (error) {
        console.error('Erro ao carregar projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadSuppliers();
    loadProjects();
  }, []);

  // Preenche form ao receber purchase
  useEffect(() => {
    if (purchase) {
      const newFormData = {
        purchase_date: purchase.purchase_date ? dayjs(purchase.purchase_date) : null,
        status: purchase.status || '',
        purchase_value: purchase.purchase_value || '',
        delivery_forecast: purchase.delivery_forecast ? dayjs(purchase.delivery_forecast) : null,
        delivery_number: purchase.delivery_number || '',
        // Garantir que sempre sejam IDs, não objetos
        project: purchase.project?.id || purchase.project || '',
        supplier: purchase.supplier?.id || purchase.supplier || '',
      };

      setFormData(newFormData);
    }
  }, [purchase]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      return newData;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.purchase_date) {
      newErrors.purchase_date = 'Data da compra é obrigatória';
    } else if (!dayjs.isDayjs(formData.purchase_date)) {
      newErrors.purchase_date = 'Data da compra deve ser uma data válida';
    }

    // Validar que project seja um ID válido
    if (!formData.project) {
      newErrors.project = 'Projeto é obrigatório';
    } else if (typeof formData.project === 'object') {
      newErrors.project = 'Projeto deve ser um ID válido';
    }

    // Validar que supplier seja um ID válido
    if (!formData.supplier) {
      newErrors.supplier = 'Fornecedor é obrigatório';
    } else if (typeof formData.supplier === 'object') {
      newErrors.supplier = 'Fornecedor deve ser um ID válido';
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
        // Garantir que apenas os IDs sejam enviados
        project: typeof formData.project === 'object' ? formData.project.id : formData.project,
        supplier: typeof formData.supplier === 'object' ? formData.supplier.id : formData.supplier,
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
    const initialData = {
      purchase_date: null,
      status: '',
      purchase_value: '',
      delivery_forecast: null,
      delivery_number: '',
      project: '',
      supplier: '',
    };

    setFormData(initialData);
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
