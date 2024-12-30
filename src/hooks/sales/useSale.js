import { useState, useEffect, useCallback } from 'react';
import saleService from '@/services/saleService';

const useSale = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saleData, setSaleData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);

  const handleRowClick = (item) => {
    setOpenDrawer(true);
    setRowSelected(item);
    console.log(item);
  };

  const toggleDrawerClosed = () => {
    setOpenDrawer(false);
    setRowSelected(null);
  };

  const fetchSale = useCallback(async () => {
    if (!id) return;

    try {
      const data = await saleService.getSaleById(id);
      setSaleData(data);
    } catch (err) {
      setError('Erro ao carregar a venda');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSale();
  }, [fetchSale]);

  const reload = () => {
    setLoading(true);
    fetchSale();
  };

  return { loading, error, saleData, handleRowClick, openDrawer, setOpenDrawer, rowSelected, toggleDrawerClosed, reload };
};

export default useSale;