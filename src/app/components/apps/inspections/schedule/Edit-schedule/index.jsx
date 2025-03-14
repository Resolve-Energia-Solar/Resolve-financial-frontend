'use client';
import { Tabs, Tab } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ScheduleFormEdit from './tabs/ScheduleFormEdit';
import AttachmentSchedule from './tabs/AttachmentSchedule';
import scheduleService from '@/services/scheduleService';

export default function EditSchedule({ scheduleId = null }) {
  const params = useParams();
  const id = scheduleId || params.id;
  const [value, setValue] = useState(0);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const data = await scheduleService.getScheduleById(id, { fields: 'id,project' });
        setSchedule(data);
      } catch (error) {
        console.error('Erro ao buscar agendamento:', error);
      }
    }
    fetchSchedule();
  }, [id]);

  const handleChangeTab = (event, newValue) => setValue(newValue);

  if (!schedule) {
    return <div>Carregando agendamento...</div>;
  }

  return (
    <>
      <Tabs value={value} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
        <Tab label="Agendamento" />
        {schedule.project && <Tab label="Anexos" />}
      </Tabs>

      {value === 0 && <ScheduleFormEdit scheduleId={id} />}
      {value === 1 && schedule.project && <AttachmentSchedule scheduleId={id} />}
    </>
  );
}
