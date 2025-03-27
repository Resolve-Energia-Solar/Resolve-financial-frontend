import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import React, { createContext, useEffect, useState } from 'react';

export const LeadModalTabContext = createContext();

export function LeadModalTabProvider({ leadId, children }) {
  const [lead, setLead] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await leadService.find(leadId);
        setLead(data);
      } catch (err) {
        enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
      }
    };
    fetchLead();
  }, [leadId]);

  return <LeadModalTabContext.Provider value={{ lead }}>{children}</LeadModalTabContext.Provider>;
}
