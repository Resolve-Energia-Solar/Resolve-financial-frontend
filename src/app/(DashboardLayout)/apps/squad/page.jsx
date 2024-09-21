"use client";

import { KanbanDataContextProvider } from '@/app/context/kanbancontext/index';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ChildCard from '@/app/components/shared/ChildCard';
import ListItem from '@/app/components/apps/squads/ListItem';


const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Times",
  },
];

function page() {
  return (
    <KanbanDataContextProvider>
      <PageContainer title="Times" description="Times">
        <Breadcrumb title="Times" items={BCrumb} />
        <ChildCard>
          <ListItem />
        </ChildCard>
      </PageContainer>
    </KanbanDataContextProvider>
  );
}

export default page;
