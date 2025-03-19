'use client';
import React from 'react';
import { CardContent } from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CommercialSchedulesList from '@/app/components/apps/comercial/schedule/CommercialSchedulesList';
import { CommercialScheduleDataContextProvider } from '@/app/context/Inspection/CommercialScheduleContext';

const CommercialSchedulesListing = () => {
    const BCrumb = [
        {
          to: '/',
          title: 'Home',
        },
        {
          title: 'Vistorias',
        },
      ];
    
      return (
        <CommercialScheduleDataContextProvider>
          <PageContainer title="Vistorias" description="Lista de Vistorias">
            <Breadcrumb items={BCrumb} />
            <BlankCard>
              <CardContent>
                <CommercialSchedulesList />
              </CardContent>
            </BlankCard>
          </PageContainer>
        </CommercialScheduleDataContextProvider>
  );
};

export default CommercialSchedulesListing;
