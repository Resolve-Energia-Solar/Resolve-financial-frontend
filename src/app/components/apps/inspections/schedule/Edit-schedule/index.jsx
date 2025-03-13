'use client';
import { Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import ScheduleFormEdit from './tabs/ScheduleFormEdit';
import AttachmentSchedule from './tabs/AttachmentSchedule';

export default function EditSchedule({ scheduleId = null }) {
  const params = useParams();
  let id = scheduleId;
  if (!scheduleId) id = params.id;

  const [value, setValue] = useState(0);
  const handleChangeTab = (event, newValue) => setValue(newValue);

  return (
    <>
      <Tabs value={value} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
        <Tab label="Agendamento" />
        <Tab label="Anexos" />
      </Tabs>

      {value === 0 && <ScheduleFormEdit scheduleId={id} />}
      {value === 1 && <AttachmentSchedule scheduleId={id} />}
    </>
  );
}
