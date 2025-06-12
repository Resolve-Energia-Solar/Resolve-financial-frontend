'use client';
import React, { useCallback } from 'react';
import { CardContent, useTheme } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ProjectList from '@/app/components/apps/project/Project-list';
import useProject from '@/hooks/projects/useProject';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { useSnackbar } from 'notistack';

const ProjectListing = () => {
  const { openDrawer, toggleDrawerClosed, handleRowClick, rowSelected } = useProject();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const projectId = rowSelected?.id || null;
  const saleId = rowSelected?.sale?.id || null;

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Projetos em distratos' }];

  const onRowClick = useCallback((row) => handleRowClick(row), [handleRowClick]);

  return (
    <PageContainer title="Projetos" description="Lista de Projetos em distratos">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <ProjectList onClick={onRowClick} defaultfilters={{ sale_status: 'D' }} />
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
