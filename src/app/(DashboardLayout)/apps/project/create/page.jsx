'use client';
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { CardContent } from '@mui/material';
import CreateProjectPage from '@/app/components/apps/project/Add-project';
const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Criar Projeto',
  },
];
const CreateProject = () => {
  return (
    <PageContainer title="Criação de projeto" description="Criador de Projeto">
      <Breadcrumb items={BCrumb} />
      <ParentCard title="Projeto">
        <CardContent>
          <CreateProjectPage />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateProject;
