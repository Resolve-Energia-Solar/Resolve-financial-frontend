import { useState, useEffect } from 'react';
import deadlineService from '@/services/deadlineService';

const useDeadline = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deadlineData, setDeadlineData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDeadline = async () => {
      try {
        const data = await deadlineService.find(id);
        setDeadlineData(data);
      } catch (err) {
        setError('Erro ao carregar o prazo');
      } finally {
        setLoading(false);
      }
    };

    fetchDeadline();
  }, [id]);

  return { loading, error, deadlineData };
};

export default useDeadline;
