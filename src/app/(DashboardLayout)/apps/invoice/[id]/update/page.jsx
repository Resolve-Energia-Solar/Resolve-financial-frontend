import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import EditInvoicePage from '@/app/components/apps/invoice/Edit-invoice/index';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Editar Pagamento',
  },
];

const InvoiceEdit = () => {
  return (
    <PageContainer title="Editar Pagamento" description="Editar Pagamento">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <EditInvoicePage />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default InvoiceEdit;
