'use client';
import React from 'react';

// Components
import { CardContent } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';

// Services and utils
import { CategoryDataContextProvider } from '@/app/context/Inspection/CategoryContext';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CategoryList from '@/app/components/apps/inspections/category/CategoryList';

const CategoryListing = () => {
  // Breadcrumb
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Categorias',
    },
  ];

  return
    <CategoryDataContextProvider>
      <PageContainer title={'Categorias'} description={'Lista de Categorias'}>
        <Breadcrumb title={'Categorias'} items={BCrumb} />
        <BlankCard>
          <CardContent>
            <CategoryList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </CategoryDataContextProvider>
  );
};

export default CategoryListing;
