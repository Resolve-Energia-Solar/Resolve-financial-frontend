'use client';
import React, { useState, useContext } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from '@mui/material';
import { AddBoxRounded, FilterAlt } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';

import FilterDrawer from '../components/filterDrawer/FilterDrawer';
import PaymentList from '../components/paymentList/list';
import InforCards from '../../inforCards/InforCards';

import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';

import { InvoiceContext } from '@/app/context/InvoiceContext';

export default function InvoiceList({ onClick }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filters, setFilters } = useContext(InvoiceContext);
  const router = useRouter();

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


  const toggleFilterDrawer = (open) => () => {
    setIsFilterOpen(open);
  };


  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };


  const handleCreateClick = () => {
    router.push('/apps/invoice/create');
  };

  return (
    <Box>
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

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          onClick={handleCreateClick}
        >
          Adicionar Pagamento
        </Button>
        <Button
          variant="outlined"
          startIcon={<FilterAlt />}
          onClick={toggleFilterDrawer(true)}
        >
          Filtros
        </Button>
      </Box>

      <FilterDrawer
        externalOpen={isFilterOpen}
        onClose={toggleFilterDrawer(false)}
        onApplyFilters={handleApplyFilters}
      />

      <PaymentList onClick={onClick} />
    </Box>
  );
}
