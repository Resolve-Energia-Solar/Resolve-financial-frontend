'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ChildCard from '@/app/components/shared/ChildCard';
import roleService from '@/services/roleService';
import ListItem from '@/app/components/apps/role/ListItem';

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
  const [role, setRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await roleService.getRole();
        setLoading(false);
        console.log(data)
        setRole(data.results);
      } catch (err) {
        setError('Erro ao carregar Role');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
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
        {role.length > 0 ? (
          <ListItem roles={role} onDelete={(id) => console.log(`Deletar filial ${id}`)} />
        ) : (
          <div>Nenhuma filial encontrada</div>
        )}
      </ChildCard>
    </PageContainer>
  );
}

export default Page;
