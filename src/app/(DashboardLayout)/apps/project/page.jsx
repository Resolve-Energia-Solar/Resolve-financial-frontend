'use client';
import React, { useCallback, useState } from 'react';
import { CardContent } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ProjectList from '@/app/components/apps/project/Project-list';
import EditProject from '@/app/components/apps/project/Edit-project';
import SideDrawer from '@/app/components/shared/SideDrawer';
import useProject from '@/hooks/projects/useProject';
import { ProjectDataContextProvider } from '@/app/context/ProjectContext';

const ProjectListing = ({ fields = 'id,product.id,sale.id,sale.customer.id', expand = 'product,sale,sale.customer,' }) => {
  const { openDrawer, toggleDrawerClosed, handleRowClick, rowSelected } = useProject();

  const projectId = rowSelected?.id || null;

  const { projectData } = useProject(projectId, { fields, expand });

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Projetos' }];

  const onRowClick = useCallback((row) => handleRowClick(row), [handleRowClick]);

  return (
    <ProjectDataContextProvider value={{ projectData }}>
      <PageContainer title="Projetos" description="Lista de Projetos">
        <Breadcrumb items={BCrumb} />
        <BlankCard>
          <CardContent>
            <ProjectList onClick={onRowClick} />
            <SideDrawer open={openDrawer} onClose={toggleDrawerClosed} title="Detalhes do Projeto">
              <EditProject projectData={projectData} />
            </SideDrawer>
          </CardContent>
        </BlankCard>
      </PageContainer>
    </ProjectDataContextProvider>
  );
};

export default ProjectListing;
