'use client';
import React from 'react';

// Components
import { CardContent } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';

// Services and utils
import { ScheduleDataContextProvider } from '@/app/context/Inspection/ScheduleContext';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ScheduleList from '@/app/components/apps/inspections/schedule/ScheduleList';

const ScheduleListing = () => {
  // Breadcrumb
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Agendamentos',
    },
  ];

  return (
    <ScheduleDataContextProvider>
      <PageContainer title={'Agendamentos'} description={'Lista de Agendamentos'}>
        <Breadcrumb title={'Agendamentos'} items={BCrumb} />
        <BlankCard>
          <CardContent>
            <ScheduleList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ScheduleDataContextProvider>
  );
};

export default ScheduleListing;
