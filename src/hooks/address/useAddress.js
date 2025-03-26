import { useState, useEffect } from 'react';
import addressService from '@/services/addressService';

const useAddress = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addressData, setAddressData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAddress = async () => {
      try {
        const data = await addressService.find(id);
        setAddressData(data);
      } catch (err) {
        setError('Erro ao carregar o endereço');
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [id]);

  return { loading, error, addressData };
};

export default useAddress;
