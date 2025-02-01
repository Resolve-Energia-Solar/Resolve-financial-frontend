import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import productService from '@/services/productsService';

const useProductForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    branches_ids: null,
    roof_type_id: null,
    materials_ids: [],
    sale_id: null,
    name: '',
    description: '',
    product_value: '',
    reference_value: '',
    cost_value: '',
    default: '',
    params: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        sale_id: initialData.sale?.id || null,
        branches_ids: initialData.branch ? [initialData?.branch?.id] : [],
        roof_type_id: initialData.roof_type.id || null,
        name: initialData.name || '',
        description: initialData.description || '',
        product_value: initialData.product_value || '',
        reference_value: initialData.reference_value || '',
        cost_value: initialData.cost_value || '',
        params: initialData.params || '',
        materials_ids: initialData.materials.map(({ material, ...rest }) => ({
          ...rest,
          material_id: material.id,
        })) || [],
        default: initialData.default || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMaterialChange = (index, field, value) => {
    setFormData((prev) => {
      const newMaterials = [...prev.materials_ids];
      newMaterials[index] = { ...newMaterials[index], [field]: value };
      return { ...prev, materials_ids: newMaterials };
    });
  };

  const handleAddMaterial = () => {
    setFormData((prev) => {
      const newId = prev.materials_ids.length > 0 
        ? Math.max(...prev.materials_ids.map(material => material.id)) + 1 
        : 1;

      return {
        ...prev,
        materials_ids: [
          ...prev.materials_ids,
          { amount: '', material_id: '' },
        ],
      };
    });
  };

  const handleDeleteMaterial = (index) => {
    setFormData((prev) => {
      const newMaterials = prev.materials_ids.filter((_, i) => i !== index);
      return { ...prev, materials_ids: newMaterials };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    let dataToSend = {
      sale_id: formData.sale_id,
      branches_ids: formData.branches_ids ? [formData.branches_ids] : undefined,
      roof_type_id: formData.roof_type_id,
      name: formData.name,
      description: formData.description,
      product_value: formData.product_value,
      reference_value: formData.reference_value,
      cost_value: formData.cost_value,
      materials_ids: formData.materials_ids,
      default: formData.default,
      params: formData.params,
    };

    try {
      if (id) {
        const response = await productService.updateProduct(id, dataToSend);
        setResponse(response);
      } else {
        const response = await productService.createProduct(dataToSend);
        setResponse(response);
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
    response,
    loading, 
    handleMaterialChange,
    handleAddMaterial,
    handleDeleteMaterial,
  };
};

export default useProductForm;