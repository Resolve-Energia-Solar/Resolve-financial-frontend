import { useState, useEffect } from 'react';

import serviceCatalogService from '@/services/serviceCatalogService';

const useServiceCatalog = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceCatalogData, setServiceCatalogData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchServiceCatalog = async () => {
      try {
        const data = await serviceCatalogService.find(id);
        setServiceCatalogData(data);
      } catch (err) {
        setError('Erro ao carregar o serviços');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCatalog();
  }, [id]);

  return { loading, error, serviceCatalogData };
};

export default useServiceCatalog;
