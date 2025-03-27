import { useState, useEffect } from 'react';
import requestConcessionaireService from "@/services/requestConcessionaireService";

const useEnergyCompany = (id, params = {}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCompany = async () => {
      try {
        const data = await requestConcessionaireService.find(id, params);
        setCompanyData(data);
      } catch (err) {
        setError('Erro ao carregar a empresa de energia');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  return { loading, error, companyData };
};

export default useEnergyCompany;
