import { useState, useEffect } from 'react';
import categoryService from '@/services/categoryService';

const useCategory = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const data = await categoryService.getCategoryById(id);
        setCategoryData(data);
      } catch (err) {
        setError('Erro ao carregar a categoria');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { loading, error, categoryData };
};

export default useCategory;
