import { useState, useEffect } from 'react';
import attachmentService from '@/services/attachmentService';

const useAttachmentsBySale = (saleId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attachmentsData, setAttachmentsData] = useState([]);

  useEffect(() => {
    if (!saleId) return;

    const fetchAttachments = async () => {
      try {
        const data = await attachmentService.getAttachmentByIdSale(saleId);
        setAttachmentsData(data);
      } catch (err) {
        setError('Erro ao carregar anexos');
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();
  }, [saleId]);

  return { loading, error, attachmentsData };
};

export default useAttachmentsBySale;
