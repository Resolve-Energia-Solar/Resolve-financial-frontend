'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ChildCard from '@/app/components/shared/ChildCard';
import campaignService from '@/services/campaignService';
import ListItem from '@/app/components/apps/campaign/ListItem';

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Filiais",
  },
];

function Page() {
  const [campaign, setCampaign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await campaignService.getCampaign();
        setLoading(false);
        console.log(data)
        setCampaign(data.results);
      } catch (err) {
        setError('Erro ao carregar campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <PageContainer title="Filiais" description="Lista de filiais">
      <Breadcrumb title="Filiais" items={BCrumb} />
      <ChildCard>
        {campaign.length > 0 ? (
          <ListItem campaigns={campaign} onDelete={(id) => console.log(`Deletar filial ${id}`)} />
        ) : (
          <div>Nenhuma filial encontrada</div>
        )}
      </ChildCard>
    </PageContainer>
  );
}

export default Page;
