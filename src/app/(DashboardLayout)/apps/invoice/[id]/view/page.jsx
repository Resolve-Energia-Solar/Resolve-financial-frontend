import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import InvoiceDetail from '@/app/components/apps/invoice/Invoice-detail/index';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Detalhes do Pagamento',
  },
];

const InvoiceDetailPage = () => {
  return (
    <PageContainer title="Detalhes do pagamento" description="Detalhes do pagamento">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <InvoiceDetail />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};
export default InvoiceDetailPage;
