'use client';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import InforCards from '../../inforCards/InforCards';
import { FilterContext } from '@/context/FilterContext';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import SalePaymentList from '../components/paymentList/SalePaymentList';

export default function InvoiceList({ onClick }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filters, setFilters } = useContext(FilterContext);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const router = useRouter();
  const context = useContext(FilterContext);

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
      key: 'customer',
      label: 'Cliente',
      type: 'async-autocomplete',
      queryParam: 'complete_name__icontains',
      endpoint: '/api/users',
      extraParams: { fields: ['id', 'complete_name'] },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        })),
    },
    {
      key: 'borrower',
      label: 'Tomador',
      type: 'async-autocomplete',
      queryParam: 'complete_name__icontains',
      endpoint: '/api/users',
      extraParams: { fields: ['id', 'complete_name'] },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        })),
    },
    {
      key: 'is_pre_sale',
      label: 'Pré-venda',
      type: 'select',
      options: [
        { label: 'Todos', value: null },
        { label: 'Sim', value: 'true' },
        { label: 'Não', value: 'false' },
      ],
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
      key: 'payment_status__in',
      label: 'Status do Financeiro',
      type: 'multiselect',
      options: [
        { value: 'P', label: 'Pendente' },
        { value: 'L', label: 'Liberado' },
        { value: 'C', label: 'Concluído' },
        { value: 'CA', label: 'Cancelado' },
      ],
    },
    // {
    //   key: 'document_completion_date__range',
    //   label: 'Data de Conclusão do Documento',
    //   type: 'range',
    //   inputType: 'date',
    // },
    {
      key: 'billing_date',
      label: 'Data de Competência',
      queryParam: 'billing_date__range',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'status__in',
      label: 'Status da Venda',
      type: 'multiselect',
      options: [
        { value: 'F', label: 'Finalizado' },
        { value: 'EA', label: 'Em Andamento' },
        { value: 'P', label: 'Pendente' },
        { value: 'C', label: 'Cancelado' },
        { value: 'D', label: 'Distrato' },
      ],
    },
    {
      key: 'branch',
      label: 'Filial',
      type: 'async-autocomplete',
      endpoint: '/api/branches',
      queryParam: 'name__icontains',
      extraParams: { fields: ['id', 'name'] },
      mapResponse: (data) =>
        data.results.map((branch) => ({
          label: branch.name,
          value: branch.id,
        })),
    },
    {
      key: 'marketing_campaign',
      label: 'Campanha de Marketing',
      type: 'async-autocomplete',
      endpoint: '/api/marketing_campaigns',
      queryParam: 'name__icontains',
      extraParams: { fields: ['id', 'name'] },
      mapResponse: (data) =>
        data.results.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        })),
    },
    {
      key: 'seller',
      label: 'Vendedor',
      type: 'async-autocomplete',
      endpoint: '/api/users',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'] },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        })),
    },
    {
      key: 'created_at',
      label: 'Data de Criação',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'is_signed',
      label: 'Assinado',
      type: 'select',
      options: [
        { label: 'Sim', value: 'true' },
        { label: 'Não', value: 'false' },
      ],
    },
    {
      key: 'signature_date',
      label: 'Data de Assinatura',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'final_service_opinion',
      label: 'Parecer Final do Serviço',
      type: 'async-autocomplete',
      endpoint: '/api/service-opinions/',
      queryParam: 'name__icontains',
      extraParams: {
        is_final_opinion: true,
        limit: 10,
        fields: ['id', 'name', 'service.name'],
        expand: 'service',
      },
      mapResponse: (data) =>
        data.results.map((opinion) => ({
          label: `${opinion.name} - ${opinion.service?.name}`,
          value: opinion.id,
        })),
    },
  ];

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
        <Button variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={() => setFilterDrawerOpen(true)}>
          Abrir Filtros
        </Button>
      </Box>

      <SalePaymentList onClick={onClick} />

      <GenericFilterDrawer
        filters={paymentFilterConfig}
        initialValues={{
          ...filters,
          is_pre_sale: [{ label: 'Não', value: 'false' }],
        }}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </Box>
  );
}
