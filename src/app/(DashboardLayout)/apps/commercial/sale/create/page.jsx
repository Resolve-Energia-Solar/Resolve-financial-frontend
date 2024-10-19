'use client';
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import { CardContent } from '@mui/material';
import CreateSaleApp from '@/app/components/apps/comercial/sale/Add-sale';

const CreateSale = () => {
  return (
    <PageContainer title="Criação de venda" description="Criador de Vendas">
      <Breadcrumb title="Criar venda" />
      <ParentCard title="Venda">
        <CardContent>
          <CreateSaleApp />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
}

export default CreateSale;