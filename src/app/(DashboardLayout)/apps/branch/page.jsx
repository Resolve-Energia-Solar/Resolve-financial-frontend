'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ChildCard from '@/app/components/shared/ChildCard';
import branchService from '@/services/branchService';
import ListItem from '@/app/components/apps/branch/ListItem';

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
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await branchService.getBranch();
        setBranches(data.results);
      } catch (err) {
        setError('Erro ao carregar branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches(); 
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
          {branches.length > 0 ? (
            <ListItem branches={branches} onDelete={(id) => console.log(`Deletar filial ${id}`)} />
          ) : (
            <div>Nenhuma filial encontrada</div>
          )}
        </ChildCard>
      </PageContainer>
  );
}

export default Page;
