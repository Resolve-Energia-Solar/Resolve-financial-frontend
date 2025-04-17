import { useState, useEffect } from 'react';
import ProductService from '@/services/productsService';

const useProduct = (id, params) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await ProductService.find(id, params);
        setProductData(data);
      } catch (err) {
        setError('Erro ao carregar o produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { loading, error, productData };
};

export default useProduct;
