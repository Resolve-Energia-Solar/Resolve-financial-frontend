import { CardContent } from '@mui/material';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

import EditSaleTabs from '@/app/components/apps/comercial/sale/Edit-sale';

const EditSale = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Editar Venda',
    },
  ];

  return (
    <PageContainer title="Edição de venda" description="Editor de Vendas">
      <Breadcrumb items={BCrumb} />

      <ParentCard title="Venda">
        <CardContent>
          <EditSaleTabs />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
};

export default EditSale;
