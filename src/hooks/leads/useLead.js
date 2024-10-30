import { useState, useEffect } from 'react';
import leadService from '@/services/leadService';

const useLead = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leadData, setLeadData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchLead = async () => {
      try {
        const data = await leadService.getLeadById(id);
        setLeadData(data);
      } catch (err) {
        setError('Erro ao carregar o lead');
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  return { loading, error, leadData };
};

export default useLead;
