import { useState, useEffect } from 'react';
import phoneNumberService from '@/services/phoneNumberService';


const usePhoneNumbers = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneNumberData, setPhoneNumberData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPhoneNumber = async () => {
      try {
        const data = await phoneNumberService.getPhoneNumberById(id);
        setPhoneNumberData(data);
      } catch (err) {
        setError('Erro ao carregar o número de telefone');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumber();
  }, [id]);

  return { loading, error, phoneNumberData };
};

export default usePhoneNumbers;
