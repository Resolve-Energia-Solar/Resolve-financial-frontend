import { useState, useEffect } from 'react';
import roofTypeService from '@/services/roofTypeService';

const useRoofType = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roofTypeData, setRoofTypeData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchRoofType = async () => {
      try {
        const data = await roofTypeService.getRoofTypeById(id);
        setRoofTypeData(data);
      } catch (err) {
        setError('Erro ao carregar tipo de telhado');
      } finally {
        setLoading(false);
      }
    };

    fetchRoofType();
  }, [id]);

  return { loading, error, roofTypeData };
};

export default useRoofType;
