import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import SchedulingList from '@/app/components/apps/inspections/schedule/ScheduleList';
import { ScheduleDataContextProvider } from '@/app/context/Inspection/ScheduleContext';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Lista de agendamentos',
  },
];

const ScheduleListing = () => {
  return (
    <ScheduleDataContextProvider>
      <PageContainer title="Lista de Agendamentos" description="Essa é a Lista de Agendamentos" >
        <Breadcrumb title="Lista de Agendamentos" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <SchedulingList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ScheduleDataContextProvider>
  );
};
export default ScheduleListing;
