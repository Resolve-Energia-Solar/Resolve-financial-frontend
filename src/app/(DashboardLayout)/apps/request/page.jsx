"use client";

import {
  Drawer
} from "@mui/material";

import Loading from "@/app/loading";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import { CardContent } from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import DashboardCards from "@/app/components/apps/invoice/components/kpis/DashboardCards";
import ListRequest from "@/app/components/apps/request/ListRequest";
import LateralForm from "@/app/components/apps/request/LateralForm";
import RequestEnergyCompany from '@/hooks/requestEnergyCompany/Request'
const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Solicitações",
  },
];

const RequestCE = () => {

  const { selectedItem, isDrawerOpen, isEditing, formData, selectedValues, situationOptions, handleChangeSituation, requestData, load, due_date, handleSave, handleCloseDrawer, handleRowClick, handleEditToggle, handleInputChange } = RequestEnergyCompany()

  return (
    <div >
      <PageContainer title="Solicitações da Concessionária de Energia" description="Essa é a Lista de Pagamentos">
        <Breadcrumb title="Solicitações da Concessionária de Energia" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <DashboardCards />
            {
              (load) ? <ListRequest data={requestData} onClick={handleRowClick} /> :
                < Loading />
            }
          </CardContent>
        </BlankCard>
      </PageContainer>
      {/* Drawer para o painel de detalhes */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
        {selectedItem && situationOptions.length > 0 &&
          <LateralForm
            handleChangeSituation={handleChangeSituation}
            isEditing={isEditing} formData={formData}
            due_date={due_date}
            handleInputChange={handleInputChange}
            options={situationOptions}
            multiSelectValues={selectedValues}
            handleEditToggle={handleEditToggle}
            handleSave={handleSave}
          />
        }
      </Drawer>
    </div>
  );
};

export default RequestCE;
