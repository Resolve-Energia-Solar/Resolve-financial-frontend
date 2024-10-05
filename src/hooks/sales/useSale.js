import { useState, useEffect } from 'react';
import saleService from '@/services/saleService';

const useSale = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saleData, setSaleData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchSale = async () => {
      try {
        const data = await saleService.getSaleById(id);
        setSaleData(data);
      } catch (err) {
        setError('Erro ao carregar a venda');
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  return { loading, error, saleData };
};

export default useSale;
