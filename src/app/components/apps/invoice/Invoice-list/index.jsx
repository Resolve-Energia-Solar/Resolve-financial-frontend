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
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import InforCards from '../../inforCards/InforCards';
import { FilterContext } from '@/context/FilterContext';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import SalePaymentList from '../components/paymentList/SalePaymentList';
import paymentService from '@/services/paymentService';
import { useEffect } from 'react';

// Hook para animar números
function useAnimatedNumber(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * targetValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return displayValue;
}

export default function InvoiceList({ onClick }) {
  const { filters, setFilters } = useContext(FilterContext);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  // Inicialize indicators como objeto (não array)
  const [indicators, setIndicators] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [error, setError] = useState('');

  const fetchIndicators = async () => {
    setLoadingIndicators(true);
    try {
      const response = await paymentService.getIndicators({ ...filters });
      console.log('Indicadores:', response);
      setIndicators(response.indicators);
    } catch (err) {
      console.error('Erro ao carregar indicadores:', err);
      setError('Erro ao carregar indicadores.');
    } finally {
      setLoadingIndicators(false);
    }
  };

  useEffect(() => {
    fetchIndicators();
  }, [filters]);

  // Valores animados (caso os dados estejam disponíveis)
  const onTimeInstallmentCount = useAnimatedNumber(indicators?.installments?.on_time_installments_count || 0);
  const onTimeInstallmentValue = useAnimatedNumber(indicators?.installments?.on_time_installments_value || 0);
  const overdueInstallmentsCount = useAnimatedNumber(indicators?.installments?.overdue_installments_count || 0);
  const overdueInstallmentsValue = useAnimatedNumber(indicators?.installments?.overdue_installments_value || 0);
  const paidInstallmentsCount = useAnimatedNumber(indicators?.installments?.paid_installments_count || 0);
  const paidInstallmentsValue = useAnimatedNumber(indicators?.installments?.paid_installments_value || 0);
  const totalInstallments = useAnimatedNumber(indicators?.installments?.total_installments || 0);
  const totalInstallmentsValue = useAnimatedNumber(indicators?.installments?.total_installments_value || 0);
  const totalPayments = useAnimatedNumber(indicators?.consistency?.total_payments || 0);
  const totalPaymentsValue = useAnimatedNumber(indicators?.consistency?.total_payments_value || 0);
  const consistentPayments = useAnimatedNumber(indicators?.consistency?.consistent_payments || 0);
  const consistentPaymentsValue = useAnimatedNumber(indicators?.consistency?.consistent_payments_value || 0);
  const inconsistentPayments = useAnimatedNumber(indicators?.consistency?.inconsistent_payments || 0);
  const inconsistentPaymentsValue = useAnimatedNumber(indicators?.consistency?.inconsistent_payments_value || 0);

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
    {
      key: 'payments_types__in',
      label: 'Tipos de Pagamento',
      type: 'multiselect',
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
      <Accordion defaultExpanded sx={{ marginBottom: 4 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="sale-cards-content"
          id="sale-cards-header"
        >
          <Typography variant="h6">Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <InforCards 
          cardsData={[
            {
              backgroundColor: 'error.light',
              iconColor: 'error.main',
              IconComponent: IconListDetails,
              title: 'Parcelas Vencidas',
              // onClick: () => setFilters({ ...filters, /* defina filtro se necessário */ }),
              value: overdueInstallmentsValue,
              count: overdueInstallmentsCount,
            },
            {
              backgroundColor: 'info.light',
              iconColor: 'info.main',
              IconComponent: IconSortAscending,
              title: 'Parcelas em Dia',
              // onClick: () => setFilters({ ...filters, /* defina filtro se necessário */ }),
              value: onTimeInstallmentValue,
              count: onTimeInstallmentCount,
            },
            {
              backgroundColor: 'success.light',
              iconColor: 'success.main',
              IconComponent: IconPaperclip,
              title: 'Parcelas Pagas',
              // onClick: () => setFilters({ ...filters, /* defina filtro se necessário */ }),
              value: paidInstallmentsValue,
              count: paidInstallmentsCount,
            },
            {
              backgroundColor: 'secondary.light',
              iconColor: 'secondary.main',
              IconComponent: IconListDetails,
              title: 'Total de Parcelas',
              // onClick: () => setFilters({ ...filters, /* defina filtro se necessário */ }),
              value: totalInstallmentsValue,
              count: totalInstallments,
            },
            {
              backgroundColor: 'primary.light',
              iconColor: 'primary.main',
              IconComponent: IconSortAscending,
              title: 'Pagamentos Pagos (Dentro do Prazo)',
              // onClick: () => setFilters({ ...filters, /* defina filtro se necessário */ }),
              value: consistentPaymentsValue,
              count: consistentPayments,
            },
            {
              backgroundColor: 'warning.light',
              iconColor: 'warning.main',
              IconComponent: IconSortAscending,
              title: 'Pagamentos Pagos (Fora do Prazo)',
              // onClick: () => setFilters({ ...filters, /* defina filtro se necessário */ }),
              value: inconsistentPaymentsValue,
              count: inconsistentPayments,
            },
            {
              backgroundColor: 'success.light',
              iconColor: 'success.main',
              IconComponent: IconSortAscending,
              title: 'Total de Pagamentos',
              // onClick: () => setFilters({ ...filters, /* defina filtro se necessário */ }),
              value: totalPaymentsValue,
              count: totalPayments,
            },
            ]} />
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
        {/* Título da página */}
        <Typography variant="h5" component="h1">
          Financeiro
        </Typography>

        {/* Botão com ícone de filtro */}
        <Button
          variant="outlined"
          sx={{ mt: 1, mb: 2 }}
          onClick={() => setFilterDrawerOpen(true)}
          startIcon={<FilterListIcon />} // Ícone à esquerda do texto
        >
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
