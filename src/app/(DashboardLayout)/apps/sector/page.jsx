'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ChildCard from '@/app/components/shared/ChildCard';
import sectorService from '@/services/sectoreService';
import ListItem from '@/app/components/apps/sector/ListItem';

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Setores",
  },
];

function Page() {
  const [sector, setSector] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSector = async () => {
      try {
        const data = await sectorService.getSector();
        setSector(data.results);
      } catch (err) {
        setError('Erro ao carregar Setores');
      } finally {
        setLoading(false);
      }
    };

    fetchSector();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <PageContainer title="Setores" description="Lista de filiais">
      <Breadcrumb title="Setores" items={BCrumb} />
      <ChildCard>
        {console.log(sector)}
        {sector.length > 0 ? (
          <ListItem sectors={sector} onDelete={(id) => console.log(`Deletar filial ${id}`)} />
        ) : (
          <div>Nenhuma filial encontrada</div>
        )}
      </ChildCard>
    </PageContainer>
  );
}

export default Page;
