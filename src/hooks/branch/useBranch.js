import { useState, useEffect } from 'react';
import branchService from '@/services/branchService';

const useBranch = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branchData, setBranchData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBranch = async () => {
      try {
        const data = await branchService.getBranchById(id);
        setBranchData(data);
      } catch (err) {
        setError('Erro ao carregar a filial');
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [id]);

  return { loading, error, branchData };
};

export default useBranch;
