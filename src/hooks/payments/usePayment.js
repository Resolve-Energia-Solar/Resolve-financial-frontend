import { useState, useEffect } from 'react';
import paymentService from '@/services/paymentService';

const usePayment = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

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

  return { loading, error, paymentData };
};

export default usePayment;
