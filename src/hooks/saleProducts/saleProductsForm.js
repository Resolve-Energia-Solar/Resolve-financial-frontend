import { useState, useEffect } from 'react';
import formatDate from '@/utils/formatDate';
import saleService from '@/services/saleService';
import saleProductsService from '@/services/saleProductsService';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';

const useSaleProductsForm = (initialData, id) => {
    const user = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        id: null,
        value: null,
        cost_value: null,
        reference_value: null,
    });

    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id || null,
                value: initialData.value || null,
                cost_value: initialData.cost_value || null,
                reference_value: initialData.reference_value || null,
            });
        }
    }, [initialData]);


    const handleSaleProductsChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const handleSaveSaleProducts = async () => {
        console.log('Current formData:', formData);
        setLoading(true);

        try {
            const dataToSend = {
                id: formData.id,
                value: formData.value,
                cost_value: formData.cost_value,
                reference_value: formData.reference_value,
            };

            console.log('data being sent:', dataToSend);

            const response = await saleProductsService.update(id, dataToSend);
            console.log('response:', response);

            setFormErrors({});
            enqueueSnackbar('Informações atualizadas com sucesso!', { variant: 'success' });
            return response;
        } catch (err) {
            console.error('Erro ao salvar alterações:', err);
            setFormErrors(err.response?.data || {});
            enqueueSnackbar('Erro ao salvar alterações', { variant: 'error' });
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return {
        formData,
        handleSaleProductsChange,
        handleSaveSaleProducts,
        formErrors,
        success,
        loading,
        successData,
    };
};

export default useSaleProductsForm;
