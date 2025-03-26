import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import ScheduleFormCreateExternal from '@/app/components/apps/inspections/schedule/Add-schedule-external';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Criar Agendamento',
  },
];

const CreateSchedule = () => {
  return (
    <PageContainer title="Criar Agendamento" description="Criar Agendamento">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <ScheduleFormCreateExternal />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};
export default CreateSchedule;
