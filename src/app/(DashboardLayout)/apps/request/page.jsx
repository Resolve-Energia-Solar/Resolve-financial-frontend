"use client";

import Loading from "@/app/loading";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import { Box, Button, CardContent } from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import DashboardCards from "@/app/components/apps/invoice/components/kpis/DashboardCards";
import ListRequest from "@/app/components/apps/request/ListRequest";
import LateralForm from "@/app/components/apps/request/LateralForm";
import RequestEnergyCompany from '@/hooks/requestEnergyCompany/Request'
import SideDrawer from "@/app/components/shared/SideDrawer";
import SendingForm from "@/app/components/apps/request/SendingForm";
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

  const { selectedItem, openDrawer, isEditing, formData, selectedValues, situationOptions, handleChangeSituation, requestData, load, due_date, handleSave, toggleDrawerClosed, handleRowClick, handleEditToggle, handleInputChange, openDrawerCreate, handleCreateRequest, toggleDrawerCreateClosed } = RequestEnergyCompany()

  return (
    <div >
      <PageContainer title="Solicitações da Concessionária de Energia" description="Essa é a Lista de Pagamentos">
        <Breadcrumb title="Solicitações da Concessionária de Energia" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <DashboardCards />
            <Box sx={{ display: 'flex' }}>
              <Button onClick={handleCreateRequest}>Nova Solicitação</Button>
            </Box>
            {
              (load) ? <ListRequest data={requestData} onClick={handleRowClick} /> :
                < Loading />
            }
          </CardContent>
        </BlankCard>
      </PageContainer>
      {/* Drawer para o painel de detalhes */}
      <SideDrawer title="Detalhes do Solicitação" open={openDrawer} onClose={toggleDrawerClosed}>
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
      </SideDrawer>
      {/* Criação de Nova Solicitação */}
      <SideDrawer title="Detalhes do Solicitação" open={openDrawerCreate} onClose={toggleDrawerCreateClosed}>


        <SendingForm handleChangeSituation={handleChangeSituation}
          isEditing={isEditing} formData={formData}
          due_date={due_date}
          handleInputChange={handleInputChange}
          options={situationOptions}
          multiSelectValues={selectedValues}
          handleEditToggle={handleEditToggle}
          handleSave={handleSave} />

      </SideDrawer>
    </div>
  );
};

export default RequestCE;
