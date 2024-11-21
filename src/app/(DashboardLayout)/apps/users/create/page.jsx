'use client';
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { CardContent } from '@mui/material';
import CreateUserPage from '@/app/components/apps/users/Add-user';

const CreateUser = () => {
  return (
    <PageContainer title="Criação de usuário" description="Criador de Usuários">
      <Breadcrumb title="Criar usuário" />
      <ParentCard title="Usuário">
        <CardContent>
          <CreateUserPage />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
}

export default CreateUser;