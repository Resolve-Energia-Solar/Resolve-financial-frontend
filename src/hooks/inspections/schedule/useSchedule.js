import { useState, useEffect } from 'react';
import scheduleService from '@/services/scheduleService';

const useSchedule = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchSchedule = async () => {
      try {
        const data = await scheduleService.getScheduleById(id);
        setScheduleData(data);
      } catch (err) {
        setError('Erro ao carregar o agendamento');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  return { loading, error, scheduleData };
};

export default useSchedule;
