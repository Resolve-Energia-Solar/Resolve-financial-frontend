'use client';
import React from 'react';
import { CardContent } from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import SaleList from '@/app/components/apps/comercial/sale/Sale-list';
import { SaleDataContextProvider } from '@/app/context/SaleContext';

const SaleListing = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Vendas',
    },
  ];

  return (
    <SaleDataContextProvider>
      <PageContainer title="Vendas" description="Lista de Vendas">
        <Breadcrumb title="Vendas" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <SaleList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </SaleDataContextProvider>
  );
};

export default SaleListing;
