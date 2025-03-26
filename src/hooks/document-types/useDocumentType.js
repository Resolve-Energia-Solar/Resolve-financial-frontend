import { useState, useEffect } from 'react';
import documentTypeService from '@/services/documentTypeService';

const useDocumentType = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentTypeData, setDocumentType] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDocumentType = async () => {
      try {
        const data = await documentTypeService.find(id);
        setDocumentType(data);
      } catch (err) {
        setError('Erro ao carregar a função');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentType();
  }, [id]);

  return { loading, error, documentTypeData };
};

export default useDocumentType;
