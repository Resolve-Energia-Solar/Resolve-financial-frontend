'use client';
import React from 'react';
import { CardContent } from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import MyScheduleList from '@/app/components/apps/inspections/schedule/MySchedule-list';
import { MyScheduleDataContextProvider } from '@/app/context/InspectionContext/MyScheduleContext';

const MyScheduleListing = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Agendamento',
    },
  ];

  return (
    <MyScheduleDataContextProvider>
      <PageContainer title="Agendamentos" description="Lista de Agendamentos">
        <Breadcrumb title="Agendamentos" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <MyScheduleList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </MyScheduleDataContextProvider>
  );
};

export default MyScheduleListing;
