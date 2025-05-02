'use client';

import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';
import { Box, Button, CardContent } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import RequestEnergyCompany from '@/hooks/requestEnergyCompany/Request';
import { RequestDataContextProvider } from '@/app/context/RequestContext';
import DeliveryLIstByProject from '@/app/components/apps/logistics/ResquestLIstByProject/DeliveryLIstByProject';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Solicitações',
  },
];

const RequestCE = () => {
  const {
    selectedItem,
    openDrawer,
    isEditing,
    formData,
    selectedValues,
    situationOptions,
    handleChangeSituation,
    requestData,
    load,
    due_date,
    handleSave,
    toggleDrawerClosed,
    handleRowClick,
    handleEditToggle,
    handleInputChange,
    openDrawerCreate,
    handleCreateRequest,
    toggleDrawerCreateClosed,
  } = RequestEnergyCompany();

  return (
    <div>
      <RequestDataContextProvider>
        <PageContainer
          title="Solicitações da Concessionária de Energia"
          description="Essa é a Lista de Pagamentos"
        >
          <Breadcrumb items={BCrumb} />
          <BlankCard>
            <CardContent>
              <Box sx={{ display: 'flex' }}></Box>
              <DeliveryLIstByProject/>
            </CardContent>
          </BlankCard>
        </PageContainer>
      </RequestDataContextProvider>
    </div>
  );
};

export default RequestCE;
