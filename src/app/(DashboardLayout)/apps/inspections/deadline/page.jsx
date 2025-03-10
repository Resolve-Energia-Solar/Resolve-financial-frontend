'use client';
import React from 'react';

// Components
import { CardContent } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';

// Services and utils
import { DeadlineDataContextProvider } from '@/app/context/Inspection/DeadlineContext';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import DeadlineList from '@/app/components/apps/inspections/deadline/DeadlineList';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Prazos',
  },
];
const DeadlineListing = () => {
  // Breadcrumb

  return (
    <DeadlineDataContextProvider>
      <PageContainer title={'Prazos'} description={'Lista de Prazos'}>
        <Breadcrumb items={BCrumb} />
        <BlankCard>
          <CardContent>
            <DeadlineList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </DeadlineDataContextProvider>
  );
};

export default DeadlineListing;
