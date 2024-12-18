import { useState, useEffect } from 'react';
import financialRecordService from '@/services/financialRecordService';

const useFinancialRecord = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialRecordData, setFinancialRecordData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchFinancialRecord = async () => {
      try {
        const data = await financialRecordService.getFinancialRecordList();
        setFinancialRecordData(data);
      } catch (err) {
        setError('Erro ao carregar a função');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialRecord();
  }, [id]);

  return { loading, error, financialRecordData };
};

export default useFinancialRecord;
