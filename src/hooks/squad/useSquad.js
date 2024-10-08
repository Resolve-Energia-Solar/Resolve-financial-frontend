import { useState, useEffect } from 'react';
import squadService from '@/services/squadService';

const useSquad = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [squadData, setSquadData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchSquad = async () => {
      try {
        const data = await squadService.getSquadById(id);
        setSquadData(data);
      } catch (err) {
        setError('Erro ao carregar o squad');
      } finally {
        setLoading(false);
      }
    };

    fetchSquad();
  }, [id]);

  return { loading, error, squadData };
};

export default useSquad;
