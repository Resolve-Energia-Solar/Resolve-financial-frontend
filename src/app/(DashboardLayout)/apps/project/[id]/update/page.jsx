import { CardContent } from '@mui/material';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import EditProjectPage from '@/app/components/apps/project/Edit-project';

const EditProject = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Editar Projeto',
    },
  ];

  return (
    <PageContainer title="Edição de projeto" description="Editor de Projetos">
      <Breadcrumb items={BCrumb} />

      <ParentCard title="Projeto">
        <CardContent>
          <EditProjectPage />
        </CardContent>
      </ParentCard>
    </PageContainer>
  );
};

export default EditProject;
