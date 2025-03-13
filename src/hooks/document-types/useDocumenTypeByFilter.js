import { useState, useEffect } from 'react';
import documentTypeService from '@/services/documentTypeService';

const useDocumentTypesByFilter = (params = {}) => {
  const [loading, setLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    if (!fetch) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await documentTypeService.getDocumentTypes(params);
        setDocumentTypes(response.results);
      } catch (error) {
        console.error('Erro ao buscar tipos de documentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetch]);

  return { documentTypes, loading };
};

export default useDocumentTypesByFilter;
