'use client';
import { Tabs, Tab, Box, Button, Drawer, Typography } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import ScheduleFormEdit from './tabs/ScheduleFormEdit';
import AttachmentSchedule from './tabs/AttachmentSchedule';
import AttachmentDetails from '@/app/components/shared/AttachmentDetails';


const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;
const CONTENT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

export default function EditSchedule({ scheduleId = null }) {
  const params = useParams();
  let id = scheduleId;
  if (!scheduleId) id = params.id;

  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
        <Tab label="Agendamento" />
        <Tab label="Anexos" />
      </Tabs>

      {value === 0 && <ScheduleFormEdit scheduleId={id} />}

      {value === 1 && (
        <AttachmentSchedule scheduleId={id} />
      )}

    </>
  );
}
