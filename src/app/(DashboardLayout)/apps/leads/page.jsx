'use client';
import React from 'react';
import { CardContent } from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import { ProjectDataContextProvider } from '@/app/context/ProjectContext';
import LeadList from '@/app/components/kanban/Leads/Leads/List-Lead';

const LeadListing = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Leads',
    },
  ];

  return (
    <ProjectDataContextProvider>
      <PageContainer title="Leads" description="Lista de Leads">
        {/* <Breadcrumb  items={BCrumb} /> */}
        <BlankCard sx={{ borderRadius: '20px', boxShadow: 3 }}>
          <CardContent>
            <LeadList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ProjectDataContextProvider>
  );
};

export default LeadListing;
