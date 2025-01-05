"use client";

import Loading from "@/app/loading";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import { Box, Button, CardContent } from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import ListRequest from "@/app/components/apps/request/ListRequest";
import LateralForm from "@/app/components/apps/request/LateralForm";
import RequestEnergyCompany from '@/hooks/requestEnergyCompany/Request'
import SideDrawer from "@/app/components/shared/SideDrawer";
import SendingForm from "@/app/components/apps/request/SendingForm";
import InforCards from '@/app/components/apps/inforCards/InforCards';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import {
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RequestList from "@/app/components/apps/request/Request-list";
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

  const cardsData = [
    {
      backgroundColor: 'primary.light',
      iconColor: 'primary.main',
      IconComponent: IconListDetails,
      title: 'Parecer de Acesso',
      count: '-',
    },
    {
      backgroundColor: 'success.light',
      iconColor: 'success.main',
      IconComponent: IconListDetails,
      title: 'Aumento de carga ',
      count: '-',
    },
    {
      backgroundColor: 'secondary.light',
      iconColor: 'secondary.main',
      IconComponent: IconPaperclip,
      title: 'Vistoria final',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Ajuste de ramal',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Nova UC',
      count: '-',
    },
  ];

  return (
    <div >
      <PageContainer title="Solicitações da Concessionária de Energia" description="Essa é a Lista de Pagamentos">
        <Breadcrumb title="Solicitações da Concessionária de Energia" items={BCrumb} />
        <BlankCard>

          <Accordion sx={{ marginBottom: 4 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="sale-cards-content"
              id="sale-cards-header"
            >
              <Typography variant="h6">Status</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <InforCards cardsData={cardsData} />
            </AccordionDetails>
          </Accordion>

          <CardContent>
            <Box sx={{ display: 'flex' }}>
            </Box>
            <RequestList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </div>
  );
};

export default RequestCE;
