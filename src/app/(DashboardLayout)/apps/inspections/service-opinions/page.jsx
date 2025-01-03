'use client';
import React from 'react';

// Components
import { CardContent } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';

// Services and utils
import { ServiceOpinionsContextProvider } from '@/app/context/Inspection/ServiceOpinionsContext';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ServiceOpinionsList from '@/app/components/apps/inspections/service-opinions/ServiceOpinionsList';
const ServiceOpinionsListing = () => {
  // Breadcrumb
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Parecer do Serviço',
    },
  ];

  return (
    <ServiceOpinionsContextProvider>
      <PageContainer title={'Parecer do Serviço'} description={'Lista de Pareceres do Serviço'}>
        <Breadcrumb title={'Parecer do Serviço'} items={BCrumb} />
        <BlankCard>
          <CardContent>
            <ServiceOpinionsList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ServiceOpinionsContextProvider>
  );
};

export default ServiceOpinionsListing;
