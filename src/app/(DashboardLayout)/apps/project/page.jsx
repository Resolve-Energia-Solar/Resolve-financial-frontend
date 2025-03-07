'use client';
import React, { useCallback } from 'react';
import { CardContent } from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ProjectList from '@/app/components/apps/project/Project-list';
import EditProject from '@/app/components/apps/project/Edit-project';
import SideDrawer from '@/app/components/shared/SideDrawer';
import useProject from '@/hooks/projects/useProject';
import { ProjectDataContextProvider } from '@/app/context/ProjectContext';

const ProjectListing = () => {
  const { openDrawer, toggleDrawerClosed, handleRowClick, rowSelected } = useProject();

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Projetos' },
  ];

  // Encapsula a função para evitar recriações desnecessárias
  const onRowClick = useCallback((row) => {
    handleRowClick(row);
  }, [handleRowClick]);

  return (
    <ProjectDataContextProvider>
      <PageContainer title="Projetos" description="Lista de Projetos">
        <Breadcrumb title="Projetos" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <ProjectList onClick={onRowClick} />
            <SideDrawer open={openDrawer} onClose={toggleDrawerClosed} title="Detalhes do Projeto">
              <EditProject projectId={rowSelected?.id} data={rowSelected} />
            </SideDrawer>
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ProjectDataContextProvider>
  );
};

export default ProjectListing;
