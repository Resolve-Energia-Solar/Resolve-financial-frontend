'use client';

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddBoxRounded, FilterAlt } from '@mui/icons-material';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';

import FilterDrawer from '../components/filterDrawer/FilterDrawer';
import PaymentList from '../components/paymentList/list';
import InforCards from '../../inforCards/InforCards';

import { FilterContext } from '@/context/FilterContext';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';

export default function InvoiceList({ onClick }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filters, setFilters } = useContext(FilterContext);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
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

  const paymentFilterConfig = [
    {
      key: 'borrower',
      label: 'Tomador',
      type: 'async-autocomplete', // Ou 'select' se for uma lista estática
      endpoint: '/api/users/', // Endpoint atualizado para '/api/users/'
      queryParam: 'search',
      mapResponse: (response) => response.data, // Exemplo de mapeamento
    },
    {
      key: 'sale',
      label: 'Venda',
      type: 'async-autocomplete', // Ou 'select'
      endpoint: '/api/sales',
      queryParam: 'search',
      mapResponse: (response) => response.data,
    },
    {
      key: 'value',
      label: 'Valor',
      type: 'number-range', // Para filtrar valores entre mínimo e máximo
      subkeys: { min: 'value__gte', max: 'value__lte' },
    },
    {
      key: 'payment_type',
      label: 'Tipo de Pagamento',
      type: 'multiselect', // Ou 'select' se não for múltiplo
      options: [
        { value: 'C', label: 'Crédito' },
        { value: 'D', label: 'Débito' },
        { value: 'B', label: 'Boleto' },
        { value: 'F', label: 'Financiamento' },
        { value: 'PI', label: 'Parcelamento interno' },
        { value: 'P', label: 'Pix' },
        { value: 'T', label: 'Transferência Bancária' },
        { value: 'DI', label: 'Dinheiro' },
        { value: 'PA', label: 'Poste auxiliar' },
        { value: 'RO', label: 'Repasse de Obra' },
      ],
    },
    {
      key: 'financier',
      label: 'Financiadora',
      type: 'async-autocomplete',
      endpoint: '/api/financiers',
      queryParam: 'search',
      mapResponse: (response) => response.data,
    },
    {
      key: 'due_date',
      label: 'Data de Vencimento',
      type: 'range', // Para filtro de intervalo de datas
    },
    {
      key: 'observation',
      label: 'Observação',
      type: 'custom', // Filtro customizado, como um campo de texto
    },
    {
      key: 'invoice_status',
      label: 'Status da Nota Fiscal',
      type: 'multiselect',
      options: [
        { value: 'E', label: 'Emitida' },
        { value: 'L', label: 'Liberada' },
        { value: 'P', label: 'Pendente' },
        { value: 'C', label: 'Cancelada' },
      ],
    },
    {
      key: 'created_at',
      label: 'Criado em',
      type: 'range', // Para intervalo de datas
    },
  ];

  const handleApplyFilters = (newFilters) => {
    if (context) {
      setFilters(newFilters);
      setPage(0);
    }
  };

  const toggleFilterDrawer = (open) => () => {
    setIsFilterOpen(open);
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
          sx={{ mt: 1, mb: 2 }}
          onClick={() => setFilterDrawerOpen(true)}
        >
          Abrir Filtros
        </Button>
      </Box>

      <FilterDrawer
        externalOpen={isFilterOpen}
        onClose={toggleFilterDrawer(false)}
        onApplyFilters={handleApplyFilters}
      />

      <PaymentList onClick={onClick} />

      <GenericFilterDrawer
        filters={paymentFilterConfig}
        initialValues={filters}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </Box>
  );
}
