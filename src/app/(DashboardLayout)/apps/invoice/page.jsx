'use client';
import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import InvoiceList from '@/app/components/apps/invoice/Invoice-list/index';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import Details from '@/app/components/apps/invoice/Details';
import SideDrawer from '@/app/components/shared/SideDrawer';
import BasicModal from '@/app/components/apps/modal/modal';
import { useState } from 'react';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Lista de Pagamentos',
  },
];

const InvoiceListing = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [text, setText] = useState();
  const [IconComponents, setIconComponents] = useState(null);

  const handleRowClick = (item) => {
    setOpenDrawer(true);
    setRowSelected(item);
  };

  const toggleOpenDrawerClosed = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <PageContainer title="Lista de Vendas" description="Essa é a Lista de Pagamentos">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <InvoiceList onClick={handleRowClick} />
          <SideDrawer
            title="Detalhes da Venda"
            open={openDrawer}
            onClose={toggleOpenDrawerClosed}
          >
            <Details id={rowSelected?.id} />
          </SideDrawer>
          <BasicModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            title={text?.title}
            message={text?.message}
            IconComponent={IconComponents}
          />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};
export default InvoiceListing;
