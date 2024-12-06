'use client';
import React from 'react';
import { CardContent } from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { SaleDataContextProvider } from '@/app/context/SaleContext';
import ProjectList from '@/app/components/apps/project/Project-list';

const ProjectListing = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Projetos',
    },
  ];

  return (
    <SaleDataContextProvider>
      <PageContainer title="Projetos" description="Lista de Projetos">
        <Breadcrumb title="Projetos" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <ProjectList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </SaleDataContextProvider>
  );
};

export default ProjectListing;
