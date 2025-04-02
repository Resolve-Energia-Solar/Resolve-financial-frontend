import { useState, useEffect } from 'react';
import paymentService from '@/services/paymentService';
import saleService from '@/services/saleService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const usePayment = (id, params = {}) => {
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

  // Se houver um rowSelected, prioriza o id dele
  id = rowSelected?.id || id;
  console.log('id', id);

  const toggleOpenDrawerClosed = () => {
    setOpenDrawer(!openDrawer);
  };

  const editPaymentStatus = async (event, id) => {
    const { name, value } = event.target;
    const response = await saleService.update(id, { [name]: value });
    if (response) {
      setOpenModal(true);
      setIconComponents(CheckCircleIcon);
      setText({ title: 'Sucesso', message: 'Status modificado com sucesso!' });
      setRowSelected({ ...rowSelected, sale: { ...rowSelected.sale, [name]: value } });
    } else {
      setOpenModal(true);
      setIconComponents(ErrorIcon);
      setText({ title: 'Erro', message: 'Erro ao salvar status de pagamento!' });
    }
  };

  // Função que busca os dados do pagamento
  const fetchPayment = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await paymentService.find(id, params);
      console.log('data (usePayment)', data);
      setPaymentData(data);
    } catch (err) {
      setError('Erro ao carregar o pagamento');
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados inicialmente e sempre que o id mudar
  useEffect(() => {
    fetchPayment();
  }, [id]);

  // Função de refresh para recarregar os dados do pagamento
  const refreshPayment = async () => {
    await fetchPayment();
  };

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
    refreshPayment,
  };
};

export default usePayment;
