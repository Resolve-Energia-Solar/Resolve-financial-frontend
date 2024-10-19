import { CardContent } from "@mui/material";

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

import EditSalePage from "@/app/components/apps/comercial/sale/Edit-sale";


const EditSale = () => {
  const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Editar Venda",
    },
];

  return (
    <PageContainer title="Edição de venda" description="Editor de Vendas">
      <Breadcrumb title="Editar Venda" items={BCrumb} />

      <ParentCard title="Venda">
        <CardContent>
          <EditSalePage />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
}

export default EditSale;