'use client';
import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Stack,

} from '@mui/material';
import { useEffect } from 'react';
import paymentService from '@/services/paymentService';
import { AddBoxRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import PaymentList from '../components/paymentList/list';
import InforCards from '../../inforCards/InforCards';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function InvoiceList({ onClick }) {

  const [paymentList, setPaymentsList] = useState()

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await paymentService.getPayments();
        setPaymentsList(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateClick = () => {
    router.push('/apps/invoice/create');
  };

  const cardsData = [
    {
      backgroundColor: 'primary.light',
      iconColor: 'primary.main',
      IconComponent: IconListDetails,
      title: 'Crédito',
      count: '-',
    },
    {
      backgroundColor: 'success.light',
      iconColor: 'success.main',
      IconComponent: IconListDetails,
      title: 'Débito',
      count: '-',
    },
    {
      backgroundColor: 'secondary.light',
      iconColor: 'secondary.main',
      IconComponent: IconPaperclip,
      title: 'Boleto',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Financiamento',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Parcelamento Interno',
      count: '-',
    },
  ];

  return (
    <Box>
      {/* <DashboardCards /> */}

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


      <Stack
        mt={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddBoxRounded />}
            sx={{ marginTop: 1, marginBottom: 2 }}
            onClick={handleCreateClick}
          >
            Adicionar Pagamento
          </Button>
        </Box>
      </Stack>
      <PaymentList onClick={onClick} />
    </Box>
  );
}
export default InvoiceList;
