import { useState, useEffect, useCallback } from 'react';
import ProductService from '@/services/productsService';

const useProducts = (ordering = '', initialPage = 1) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      const data = await ProductService.getProducts(ordering);
      setProducts(data.results);
    } catch (err) {
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [ordering, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const reloadProducts = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    currentPage,
    setCurrentPage,
    reloadProducts,
  };
};

export default useProducts;
