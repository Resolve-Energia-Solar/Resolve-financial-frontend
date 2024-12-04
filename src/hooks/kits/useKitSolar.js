import { useState, useEffect } from 'react';
import KitSolarService from '@/services/kitSolarService';

const useKitSolar = (ordering = '') => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKits = async () => {
      setLoading(true);
      try {
        const data = await KitSolarService.getKitSolar(ordering);
        setKits(data.results);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKits();
  }, [ordering]);

  return { kits, loading, error };
};

export default useKitSolar;
