import { useState, useEffect } from 'react';
import campaignService from '@/services/campaignService';

const useCampaign = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCampaign = async () => {
      try {
        const data = await campaignService.find(id);
        setCampaignData(data);
      } catch (err) {
        setError('Erro ao carregar a campanha');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  return { loading, error, campaignData };
};

export default useCampaign;
