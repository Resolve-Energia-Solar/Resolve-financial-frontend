'use client';
import { CardContent } from "@mui/material";

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

import CustomerTabs from "@/app/components/apps/users/Edit-user/customer/tabs";
import ViewLeadPage from "@/app/components/kanban/Leads/Leads-view";
import { useParams } from 'next/navigation';



const ViewLead = () => {
  const params = useParams();
  const id = parseInt(params.id, 10);

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Ver lead",
    },
  ];

  return (
    <PageContainer title="Visualização de lead" description="Visualização de leads">
      <CardContent>
        <ViewLeadPage leadId={id} />
      </CardContent>
    </PageContainer>
  );
}

export default ViewLead;