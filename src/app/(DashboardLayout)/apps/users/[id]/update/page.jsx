import { CardContent } from "@mui/material";

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

import EditUserPage from "@/app/components/apps/users/Edit-user";
import CustomerTabs from "@/app/components/apps/users/Edit-user/customer/tabs";


const EditUser = () => {
  const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Editar usuário",
    },
];

  return (
    <PageContainer title="Edição de usuário" description="Editor de Usuários">
      <Breadcrumb title="Editar Usuário" items={BCrumb} />

      <ParentCard title="Usuário">
        <CardContent>
          <CustomerTabs />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
}

export default EditUser;