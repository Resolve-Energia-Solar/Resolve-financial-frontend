'use client';

import Loading from '@/app/loading';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';
import { Box, Button, CardContent } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import ListRequest from '@/app/components/apps/request/ListRequest';
import LateralForm from '@/app/components/apps/request/LateralForm';
import RequestEnergyCompany from '@/hooks/requestEnergyCompany/Request';
import SideDrawer from '@/app/components/shared/SideDrawer';
import SendingForm from '@/app/components/apps/request/SendingForm';
import InforCards from '@/app/components/apps/inforCards/InforCards';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import { Accordion, Typography, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RequestList from '@/app/components/apps/request/Request-list';
import { RequestDataContextProvider } from '@/app/context/RequestContext';
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
              <RequestList />
            </CardContent>
          </BlankCard>
        </PageContainer>
      </RequestDataContextProvider>
    </div>
  );
};

export default RequestCE;
