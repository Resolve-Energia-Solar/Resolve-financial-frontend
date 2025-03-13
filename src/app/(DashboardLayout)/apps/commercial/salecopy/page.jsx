'use client';
import React from 'react';
import { CardContent } from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { SaleDataContextProvider } from '@/app/context/SaleContext';
import SaleListCopy from '@/app/components/apps/comercial/sale/Sale-listcopy';

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
        <Breadcrumb items={BCrumb} />
        <BlankCard>
          <CardContent>
            <SaleListCopy />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </SaleDataContextProvider>
  );
};

export default SaleListing;
