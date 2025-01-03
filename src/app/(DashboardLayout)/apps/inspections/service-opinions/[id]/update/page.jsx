'use client';

// Components
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ServiceOpinionsFormEdit from '@/app/components/apps/inspections/service-opinions/Edit-ServiceOpinions';

const ServiceOpinionsEdit = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      to: '/apps/inspections/service-opinions',
      title: 'Parecer do Serviço',
    },
    {
      title: 'Editar Parecer do Serviço',
    },
  ];

  return (
    <PageContainer
      title={'Edição de Parecer do Serviço'}
      description={'Editor de Parecer do Serviço'}
    >
      <Breadcrumb title={'Editar Parecer do Serviço'} items={BCrumb} />
      <ServiceOpinionsFormEdit />
    </PageContainer>
  );
};

export default ServiceOpinionsEdit;
