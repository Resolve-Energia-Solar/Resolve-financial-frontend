import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import AppCard from '@/app/components/shared/AppCard';
import Image from 'next/image';
import NotificationApp from '@/app/components/apps/notification/index';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Notificações',
  },
];

const Notification = () => {
  return (
    <PageContainer title="Notificações" description="Ver todas as suas notificações">
      <Breadcrumb items={BCrumb}>
        <Image src="/images/breadcrumb/emailSv.png" alt={'emailIcon'} width={195} height={195} />
      </Breadcrumb>

      <AppCard>
        <NotificationApp />
      </AppCard>
    </PageContainer>
  );
};

export default Notification;
