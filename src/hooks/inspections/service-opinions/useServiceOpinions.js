import { useState, useEffect } from 'react';

import serviceOpinionsService from '@/services/serviceOpinionsService';

const useServiceOpinions = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceOpinionData, setServiceOpinionData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchServiceOpinion = async () => {
      try {
        const data = await serviceOpinionsService.getServiceOpinionsById(id);
        setServiceOpinionData(data);
      } catch (err) {
        setError('Erro ao carregar o parecer do serviço');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceOpinion();
  }, [id]);

  return { loading, error, serviceOpinionData };
};

export default useServiceOpinions;
