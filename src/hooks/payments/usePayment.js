import { useState, useEffect } from 'react';
import paymentService from '@/services/paymentService';
import saleService from '@/services/saleService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const usePayment = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [text, setText] = useState();
  const [IconComponents, setIconComponents] = useState(null);

  const handleRowClick = (item) => {
    setOpenDrawer(true);
    setRowSelected(item);
  };

  const toggleOpenDrawerClosed = () => {
    setOpenDrawer(!openDrawer);
  };

  const editPaymentStatus = async (event, id) => {
    const { name, value } = event.target;
    const response = await saleService.updateSalePartial(id, { [name]: event.target.value });
    if (response) {
      setOpenModal(true);
      setIconComponents(CheckCircleIcon);
      setText({ title: 'Sucesso', message: 'Status Modificado com sucesso!' });
      setRowSelected({ ...rowSelected, sale: { ...rowSelected.sale, [name]: value } });
    } else {
      setOpenModal(true);
      setIconComponents(ErrorIcon);
      setText({ title: 'Erro', message: 'Erro ao salvar status de pagamento!' });
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchPayment = async () => {
      try {
        const data = await paymentService.find(id, {
          expand: ['sale.customer', 'installments', 'financier', 'borrower'],
        });
        console.log('sjhdfgaskdjhfsdf', data);
        setPaymentData(data);
      } catch (err) {
        setError('Erro ao carregar o pagamento');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  return {
    editPaymentStatus,
    loading,
    error,
    paymentData,
    openDrawer,
    handleRowClick,
    toggleOpenDrawerClosed,
    rowSelected,
    openModal,
    setOpenModal,
    IconComponents,
    text,
  };
};

export default usePayment;
