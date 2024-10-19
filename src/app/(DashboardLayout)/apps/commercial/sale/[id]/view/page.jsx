import {
  CardContent
} from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import SaleDetailPage from '@/app/components/apps/comercial/sale/Sale-detail';


const SaleDetail = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Detalhe da Venda',
    },
  ];

  return (
    <PageContainer title="Visualização de venda" description="Visualização">
      <Breadcrumb title="Visualizar Venda" items={BCrumb} />

      <ParentCard title="Venda">
        <CardContent>
          <SaleDetailPage />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
}

export default SaleDetail;
