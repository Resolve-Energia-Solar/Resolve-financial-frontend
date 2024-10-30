import { useState, useEffect } from 'react';
import proposalService from '@/services/proposalService';

const useProposal = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposalData, setProposalData] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProposal = async () => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const data = await proposalService.getProposalById(id);
        setProposalData(data);
        setSuccess(true);
      } catch (err) {
        setError('Erro ao carregar a proposta.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  const updateProposal = async (updatedData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await proposalService.updateProposal(id, updatedData);
      setProposalData(data);
      setSuccess(true);
    } catch (err) {
      setError('Erro ao atualizar a proposta.');
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return { proposalData, loading, error, success, updateProposal };
};

export default useProposal;
