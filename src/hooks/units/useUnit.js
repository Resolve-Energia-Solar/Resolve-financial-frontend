import { useState, useEffect } from 'react';
import unitService from '@/services/unitService';

const useUnit = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unitData, setUnitData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchUnit = async () => {
      try {
        const data = await unitService.getUnitById(id);
        setUnitData(data);
      } catch (err) {
        setError('Erro ao carregar a unidade');
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id]);

  return { loading, error, unitData };
};

export default useUnit;

