import { KanbanDataContextProvider } from '@/app/context/kanbancontext/index';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ChildCard from '@/app/components/shared/ChildCard';
import UserApp from '@/app/components/apps/users';
import AppCard from '@/app/components/shared/AppCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Usuários',
  },
];

function page() {
  return (
    <PageContainer title="Usuários" description="Material">
      <Breadcrumb title="Usuários" items={BCrumb} />
      <ChildCard>
        <AppCard>
          <UserApp />
        </AppCard>
      </ChildCard>
    </PageContainer>
  );
}

export default page;
