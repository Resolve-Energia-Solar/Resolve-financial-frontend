import { useState } from 'react';
import contractService from '@/services/contractService';

export default function useSendContract(saleId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [contract, setContract] = useState(null);

  const sendContract = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await contractService.sendContract({
        sale_id: saleId
      });

      setContract(response);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    contract,
    sendContract,
  };
}
