import { useState, useEffect } from 'react';
import formBuilderService from '@/services/formBuilderService';

const useFormBuilder = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formBuilderData, setFormBuilderData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchForm = async () => {
      try {
        const data = await formBuilderService.find(id);
        setFormBuilderData(data);
      } catch (err) {
        setError('Erro ao carregar o formulário');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  return { loading, error, formBuilderData };
};

export default useFormBuilder;
