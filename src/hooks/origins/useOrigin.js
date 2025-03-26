import OriginsService from '@/services/originService';
import { useState, useEffect } from 'react';

const useOrigins = (id = null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originData, setOriginData] = useState(null);
  const [originsList, setOriginsList] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchOrigin = async () => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const data = await OriginsService.find(id);
        setOriginData(data);
        setSuccess(true);
      } catch (err) {
        setError('Erro ao carregar a origem.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrigin();
  }, [id]);

  const getAllOrigins = async () => {
    if (originsList.length > 0) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await OriginsService.index();
      const data = response.data || response.results || response;

      if (Array.isArray(data)) {
        setOriginsList(data);
        setSuccess(true);
      } else {
        throw new Error('Formato inesperado de dados');
      }
    } catch (err) {
      setError('Erro ao carregar as origens.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrigin = async (updatedData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await OriginsService.update(id, updatedData);
      setOriginData(data);
      setSuccess(true);
    } catch (err) {
      setError('Erro ao atualizar a origem.');
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrigin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await OriginsService.deleteOrigin(id);
      setOriginData(null);
      setSuccess(true);
    } catch (err) {
      setError('Erro ao deletar a origem.');
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrigins();
  }, []);

  return {
    originData,
    originsList,
    loading,
    error,
    success,
    updateOrigin,
    deleteOrigin,
  };
};

export default useOrigins;
