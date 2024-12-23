import { useState, useEffect } from 'react';
import paymentService from '@/services/paymentService';
import saleService from '@/services/saleService';

const usePayment = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);

  const handleRowClick = (item) => {
    setOpenDrawer(true);
    setRowSelected(item);
  }

  const toggleOpenDrawerClosed = () => {
    setOpenDrawer(!openDrawer);
  }

  const editPaymentStatus = async (event, id) => {
    const { name, value } = event.target
    const response = await saleService.updateSalePartial(id, { [name]: event.target.value })
    if (response) {
      setRowSelected({ ...rowSelected, sale: { ...rowSelected.sale, [name]: value } })
    }
  }

  useEffect(() => {
    if (!id) return;

    const fetchPayment = async () => {
      try {
        const data = await paymentService.getPaymentById(id);
        setPaymentData(data);
      } catch (err) {
        setError('Erro ao carregar o pagamento');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  return { editPaymentStatus, loading, error, paymentData, openDrawer, handleRowClick, toggleOpenDrawerClosed, rowSelected };
};

export default usePayment;
