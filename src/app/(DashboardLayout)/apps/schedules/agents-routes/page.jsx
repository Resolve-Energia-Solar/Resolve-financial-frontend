'use client';
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { CardContent } from '@mui/material';
import AgentRoutes from '@/app/components/apps/inspections/schedule/AgentRoutes';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Rotas de Agentes',
  },
];

const AgentsRoutes = () => {
  return (
    <PageContainer title="Rotas de Agentes" description="Criador de Rotas de Agentes">
      <Breadcrumb items={BCrumb} />
      <ParentCard title="Rotas de Agentes">
        <CardContent>
          <AgentRoutes />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
};

export default AgentsRoutes;
