import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import React from 'react';
import CreateInvoiceApp from '@/app/components/apps/invoice/Add-invoice';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Criar Novo Pagamento',
  },
];

const CreateInvoice = () => {
  return (
    <PageContainer title="Criar um novo pagamento" description="Criar um novo pagamento">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <CreateInvoiceApp />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};
export default CreateInvoice;
