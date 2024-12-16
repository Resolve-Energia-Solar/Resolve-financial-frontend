'use client';
import React from 'react';
import { CardContent } from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { SaleDataContextProvider } from '@/app/context/SaleContext';
import ProjectList from '@/app/components/apps/project/Project-list';
import UserList from '@/app/components/apps/users/User-list';

const ProjectListing = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Usuários',
    },
  ];

  return (
    <SaleDataContextProvider>
      <PageContainer title="Usuários" description="Lista de Usuários">
        <Breadcrumb title="Usuários" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <UserList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </SaleDataContextProvider>
  );
};

export default ProjectListing;
