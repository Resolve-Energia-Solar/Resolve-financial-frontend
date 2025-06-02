import { useState, useEffect } from 'react';
import ticketService from '@/services/ticketService';

const useTicket = (params, id) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ticketData, setTicketData] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const data = id
                    ? await ticketService.find(id)
                    : await ticketService.index(params);
                setTicketData(data);
            } catch (err) {
                setError('Erro ao carregar o ticket');
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id, params]);

    return { loading, error, ticketData };
};

export default useTicket;
