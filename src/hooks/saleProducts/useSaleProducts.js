import { useState, useEffect, useCallback } from 'react';
import saleProductsService from '@/services/saleProductsService';
import { useRouter } from "next/navigation";

const useSaleProducts = (id) => {

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saleProductsData, setSaleProductsData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);

  const handleRowClick = (item) => {
    setOpenDrawer(true);
    setRowSelected(item);
    router.push(`?id=${item.id}`);

  };

  const toggleDrawerClosed = () => {
    setOpenDrawer(false);
    setRowSelected(null);
    router.replace("/apps/commercial/sale-products?", { scroll: false });
  };

  const fetchSaleProducts = useCallback(async () => {
    if (!id) return;

    try {
      const data = await saleProductsService.find(id,
        {
          expand: [  
            "sale_products",
         
          ],
          fields: [
            "id",
            "value",
            "cost_value",
            "reference_value",
            "product",
          ],
          format: "json"
        }
      );
      setSaleProductsData(data);
    } catch (err) {
      setError('Erro ao carregar a venda');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSaleProducts();
  }, [fetchSaleProducts]);

  const reload = () => {
    setLoading(true);
    fetchSaleProducts();
  };

  return { 
    loading, 
    fetchSaleProducts, 
    error, 
    saleProductsData, 
    handleRowClick, 
    openDrawer, 
    setOpenDrawer, 
    rowSelected, 
    toggleDrawerClosed, 
    reload 
  };
};

export default useSaleProducts;