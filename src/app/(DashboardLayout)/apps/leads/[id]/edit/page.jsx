'use client';
import { CardContent } from "@mui/material";

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

import { useParams } from 'next/navigation';
import EditLeadTabs from "@/app/components/kanban/Leads/Leads-edit/TabsLead";



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
    <PageContainer title="Edição de lead" description="Editar de lead">
      <CardContent>
        <EditLeadTabs leadId={id} />
      </CardContent>
    </PageContainer>
  );
}

export default ViewLead;