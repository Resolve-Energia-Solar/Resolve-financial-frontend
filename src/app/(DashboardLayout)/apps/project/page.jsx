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
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';

const ProjectListing = () => {
  const { openDrawer, toggleDrawerClosed, handleRowClick, rowSelected } = useProject();

  const projectId = rowSelected?.id || null;
  const saleId = rowSelected?.sale?.id || null;

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Projetos' }];

  const onRowClick = useCallback((row) => handleRowClick(row), [handleRowClick]);

  return (
    <PageContainer title="Projetos" description="Lista de Projetos">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <ProjectList onClick={onRowClick} />
          <ProjectDetailDrawer
            projectId={projectId}
            saleId={saleId}
            open={openDrawer}
            onClose={toggleDrawerClosed}
          />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default ProjectListing;
