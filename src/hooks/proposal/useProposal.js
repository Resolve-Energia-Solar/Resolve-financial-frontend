import { useState, useEffect } from 'react';
import ProposalService from '@/services/proposalService';

const useProposal = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposalData, setProposalData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProposal = async () => {
      try {
        const data = await ProposalService.getProposalById(id);
        setProposalData(data);
      } catch (err) {
        setError('Erro ao carregar a proposta');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  return { loading, error, proposalData };
};

export default useProposal;
