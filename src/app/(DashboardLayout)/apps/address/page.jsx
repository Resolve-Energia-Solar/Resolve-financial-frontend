"use client";

import { KanbanDataContextProvider } from '@/app/context/kanbanCRMcontext/index';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ChildCard from '@/app/components/shared/ChildCard';
import ListItem from '@/app/components/apps/logistic/ListItem';


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Tipo de Material",
  },
];

function page() {
  return (
    <KanbanDataContextProvider>
      <PageContainer title="Material" description="Material">
        <Breadcrumb title="Material" items={BCrumb} />
        <ChildCard>
          <ListItem />
        </ChildCard>
      </PageContainer>
    </KanbanDataContextProvider>
  );
}

export default page;
