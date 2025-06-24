'use client';
import React, { useCallback, useState } from 'react';
import { Button, CardContent } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ProjectList from '@/app/components/apps/project/Project-list';
import EditProject from '@/app/components/apps/project/Edit-project';
import SideDrawer from '@/app/components/shared/SideDrawer';
import useProject from '@/hooks/projects/useProject';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { useRouter } from 'next/navigation';

const ProjectListing = () => {
  const router = useRouter();
  const { openDrawer, toggleDrawerClosed, handleRowClick, rowSelected } = useProject();

  const projectId = rowSelected?.id || null;
  const saleId = rowSelected?.sale?.id || null;

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Projetos' }];

  const onRowClick = useCallback((row) => handleRowClick(row), [handleRowClick]);

  return (
    <PageContainer title="Projetos" description="Lista de Projetos">
      <Breadcrumb items={BCrumb} />
      {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => router.push('/apps/project/kanban')}
        >
          Ver Kanban
        </Button>
      </div> */}
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
