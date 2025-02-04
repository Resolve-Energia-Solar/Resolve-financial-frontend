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

// Componentes personalizados
import FilterDrawer from '../components/filterDrawer/FilterDrawer';
import PaymentList from '../components/paymentList/list';
import InforCards from '../../inforCards/InforCards';

// Ícones para os cards
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';

// Contexto que fornece os filtros e refresh
import { InvoiceContext } from '@/app/context/InvoiceContext';

export default function InvoiceList({ onClick }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filters, setFilters } = useContext(InvoiceContext);
  const router = useRouter();

  // Dados para os cards de status (exemplo)
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

  // Abre/fecha o drawer de filtros
  const toggleFilterDrawer = (open) => () => {
    setIsFilterOpen(open);
  };

  // Handler para aplicar filtros; atualiza o contexto
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Redireciona para a tela de criação de pagamento
  const handleCreateClick = () => {
    router.push('/apps/invoice/create');
  };

  return (
    <Box>
      {/* Seção de cards de status */}
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

      {/* Container com botões: "Adicionar Pagamento" à esquerda e "Filtros" à direita */}
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

      {/* Drawer de filtros */}
      <FilterDrawer
        externalOpen={isFilterOpen}
        onClose={toggleFilterDrawer(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Componente de listagem */}
      <PaymentList onClick={onClick} />
    </Box>
  );
}
