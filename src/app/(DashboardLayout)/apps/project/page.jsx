'use client';
import React from 'react';
import { CardContent } from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { SaleDataContextProvider } from '@/app/context/SaleContext';
import ProjectList from '@/app/components/apps/project/Project-list';
import Details from '@/app/components/apps/project/Details';
import useProject from '@/hooks/projects/useProject';
import SideDrawer from '@/app/components/shared/SideDrawer';

const ProjectListing = () => {

  const { openDrawer, toggleDrawerClosed, handleRowClick, rowSelected } = useProject()
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
  
    <SaleDataContextProvider >
      <PageContainer title="Projetos" description="Lista de Projetos"  >
        <Breadcrumb title="Projetos" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <ProjectList onClick={handleRowClick} />
            <SideDrawer open={openDrawer} onClose={toggleDrawerClosed} title="Detalhes do Projeto" details={''}>
              <Details id={rowSelected?.id} data={rowSelected} />
            </SideDrawer>
          </CardContent>
        </BlankCard>
      </PageContainer>
    </SaleDataContextProvider>
  );
};

export default ProjectListing;
