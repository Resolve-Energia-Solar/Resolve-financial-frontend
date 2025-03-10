import { useState, useEffect, useCallback } from 'react';
import saleService from '@/services/saleService';
import { useRouter } from "next/navigation";

const useSale = (id) => {

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saleData, setSaleData] = useState(null);
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
    router.replace("/apps/commercial/sale?", { scroll: false });
  };

  const fetchSale = useCallback(async () => {
    if (!id) return;

    try {
      const data = await saleService.find(id,
        {
          expand: [
            "attachments",
            "payments",
            "contract-submissions",
            "customer.addresses",
            "projects.units",
            "comments"
          ],
          fields: [
            "customer.id",
            "customer.complete_name",
            "customer.email",
            "customer.first_document",
            "customer.birth_date",
            "id",
            "total_value",
            "branch.id",
            "branch.name",
            "marketing_campaign",
            "seller",
            "sales_supervisor.id",
            "sales_supervisor.complete_name",
            "sales_manager.id",
            "sales_manager.complete_name",
            "payment_status",
            "status",
            "billing_date",
            "cancellation_reasons",
            "is_pre_sale"
          ],
          format: "json",
          limit: 1
        }
      );
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