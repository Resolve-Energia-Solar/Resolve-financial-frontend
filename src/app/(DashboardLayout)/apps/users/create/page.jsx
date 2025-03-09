'use client';
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { CardContent } from '@mui/material';
import CreateCustomer from '@/app/components/apps/users/Add-user/customer';
const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Criar usuário',
  },
];
const CreateUser = () => {
  return (
    <PageContainer title="Criação de usuário" description="Criador de Usuários">
      <Breadcrumb items={BCrumb} />
      <ParentCard title="Usuário">
        <CardContent>
          <CreateCustomer />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateUser;
