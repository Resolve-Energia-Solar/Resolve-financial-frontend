'use client';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Chip,
  TableContainer,
  Paper,
  Typography,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Tooltip,
  Grid,
} from '@mui/material';
import { IconListDetails, IconX } from '@tabler/icons-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import projectService from '@/services/projectService';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import StatusChip from '@/utils/status/ProjectStatusChip';
import ProjectCards from '../../inforCards/InforQuantity';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { keyframes } from '@mui/system';
import { FilterContext } from '@/context/FilterContext';
import HorizontalProcessCards from '../Costumer-journey/HorizontalProcessCards';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';
import ScheduleOpinionChip from '../../inspections/schedule/StatusChip';
import StatusFinancialChip from '@/utils/status/FinancialChip';
import ChipRequest from '../../request/components/auto-complete/ChipRequest';
import { IconCheck } from '@tabler/icons-react';
import JourneyCounterChip from '../Costumer-journey/JourneyCounterChip';
import { on } from 'events';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const getStatusChip = (status) => {
  let label = '';
  let color = 'default';

  switch (status) {
    case 'P':
      label = 'Pendente';
      color = 'warning';
      break;
    case 'CO':
      label = 'Concluído';
      color = 'success';
      break;
    case 'EA':
      label = 'Em Andamento';
      color = 'primary';
      break;
    case 'C':
      label = 'Cancelado';
      color = 'error';
      break;
    case 'D':
      label = 'Distrato';
      color = 'default';
      break;
    case 'L':
      label = 'Liberado';
      color = 'success';
      break;
    case 'CA':
      label = 'Cancelado';
      color = 'error';
      break;
    case 'F':
      label = 'Finalizado';
      color = 'success';
      break;
    default:
      label = 'Desconhecido';
      color = 'grey';
  }

  return <Chip label={label} color={color} />;
};

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

const ProjectList = ({ onClick }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [indicators, setIndicators] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { filters, setFilters } = useContext(FilterContext);
  const [ordering, setOrdering] = useState('-created_at');

  const states = [
    { value: 'AC', label: 'AC' },
    { value: 'AL', label: 'AL' },
    { value: 'AP', label: 'AP' },
    { value: 'AM', label: 'AM' },
    { value: 'BA', label: 'BA' },
    { value: 'CE', label: 'CE' },
    { value: 'DF', label: 'DF' },
    { value: 'ES', label: 'ES' },
    { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' },
    { value: 'MT', label: 'MT' },
    { value: 'MS', label: 'MS' },
    { value: 'MG', label: 'MG' },
    { value: 'PA', label: 'PA' },
    { value: 'PB', label: 'PB' },
    { value: 'PR', label: 'PR' },
    { value: 'PE', label: 'PE' },
    { value: 'PI', label: 'PI' },
    { value: 'RJ', label: 'RJ' },
    { value: 'RN', label: 'RN' },
    { value: 'RS', label: 'RS' },
    { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' },
    { value: 'SC', label: 'SC' },
    { value: 'SP', label: 'SP' },
    { value: 'SE', label: 'SE' },
    { value: 'TO', label: 'TO' },
  ];

  const projectFilterConfig = [
    {
      key: 'customer',
      label: 'Cliente',
      type: 'async-autocomplete',
      endpoint: '/api/users',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'], limit: 10 },
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
      endpoint: '/api/users',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'], limit: 10 },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        })),
    },
    {
      key: 'homologator',
      label: 'Homologador',
      type: 'async-autocomplete',
      endpoint: '/api/users',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'], limit: 10 },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        })),
    },
    {
      key: 'seller',
      label: 'Vendedor',
      type: 'async-autocomplete',
      endpoint: '/api/users',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'], limit: 10 },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        })),
    },
    {
      key: 'sale_status',
      label: 'Status da Venda',
      type: 'multiselect',
      options: [
        { value: 'P', label: 'Pendente' },
        { value: 'CO', label: 'Concluído' },
        { value: 'EA', label: 'Em Andamento' },
        { value: 'C', label: 'Cancelado' },
        { value: 'D', label: 'Distrato' },
      ],
    },
    {
      key: 'sale_branches',
      label: 'Unidade',
      type: 'async-autocomplete',
      endpoint: '/api/branches',
      queryParam: 'name__icontains',
      mapResponse: (data) =>
        data.results.map((branch) => ({
          label: branch.name,
          value: branch.id,
        })),
    },
    {
      key: 'state__in',
      label: 'Estado',
      type: 'multiselect',
      options: states,
    },
    {
      key: 'city',
      label: 'Cidade',
      type: 'text',
    },
    {
      key: 'signature_date',
      label: 'Data de Contrato',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'payment_types',
      label: 'Tipo de Pagamentos',
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
        { value: '', label: 'Repasse de Obra' },
      ],
    },
    {
      key: 'financiers',
      label: 'Financiadora',
      type: 'async-autocomplete',
      endpoint: '/api/financiers',
      queryParam: 'name__icontains',
      mapResponse: (data) =>
        data.results.map((financier) => ({
          label: financier.name,
          value: financier.id,
        })),
    },
    {
      key: 'invoice_status',
      label: 'Tipo da Nota Fiscal',
      type: 'multiselect',
      options: [
        { value: 'E', label: 'Emitida' },
        { value: 'L', label: 'Liberada' },
        { value: 'P', label: 'Pendente' },
        { value: 'C', label: 'Cancelada' },
      ],
    },
    {
      key: 'is_released_to_engineering',
      label: 'Liberado para Engenharia',
      type: 'select',
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' },
        { value: 'null', label: 'Todos' },
      ],
    },
    {
      key: 'status',
      label: 'Status de Homologação',
      type: 'multiselect',
      options: [
        { value: 'P', label: 'Pendente' },
        { value: 'CO', label: 'Concluído' },
        { value: 'EA', label: 'Em Andamento' },
        { value: 'C', label: 'Cancelado' },
        { value: 'D', label: 'Distrato' },
      ],
    },
    {
      key: 'product_kwp',
      label: 'Kwp',
      type: 'number',
    },
    {
      key: 'trt_status',
      label: 'Status de TRT',
      type: 'multiselect',
      options: [
        { value: 'P', label: 'Pendente' },
        { value: 'A', label: 'Aprovado' },
        { value: 'EA', label: 'Em Andamento' },
        { value: 'R', label: 'Recusado' },
      ],
    },
    {
      key: 'material_list_is_completed',
      label: 'Lista de Material',
      type: 'select',
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' },
        { value: 'null', label: 'Todos' },
      ],
    },
    {
      key: 'supply_adquance',
      label: 'Adequação de Fornecimento',
      type: 'async-autocomplete',
      endpoint: '/api/supply-adequances',
      queryParam: 'name__icontains',
      mapResponse: (data) =>
        data.results.map((supply) => ({
          label: supply.name,
          value: supply.id,
        })),
    },
    {
      key: 'new_contract_number',
      label: 'Nova UC',
      type: 'select',
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' },
        { value: 'null', label: 'Todos' },
      ],
    },
    {
      key: 'access_opnion',
      label: 'Parecer de Acesso',
      type: 'select',
      options: [
        { value: 'liberado', label: 'Liberado' },
        { value: 'bloqueado', label: 'Bloqueado' },
        { value: 'null', label: 'Todos' },
      ],
    },
    {
      key: 'designer_status',
      label: 'Status do Projeto',
      type: 'multiselect',
      options: [
        { value: 'P', label: 'Pendente' },
        { value: 'CO', label: 'Concluído' },
        { value: 'EA', label: 'Em Andamento' },
        { value: 'C', label: 'Cancelado' },
        { value: 'D', label: 'Distrato' },
      ],
    },
    {
      key: 'attachments_status',
      label: 'Status do Anexo',
      type: 'multiselect',
      options: [
        { value: 'EA', label: 'Em Análise' },
        { value: 'A', label: 'Aprovado' },
        { value: 'R', label: 'Recusado' },
        { value: 'P', label: 'Parcial' },
      ],
    },
  ];

  useEffect(() => {
    const fetchProjectsAndIndicators = async () => {
      setLoadingProjects(true);
      setLoadingIndicators(true);
      try {
        const data = await projectService.index({
          page: page + 1,
          limit: rowsPerPage,
          expand:
            'sale,sale.customer,designer,homologator,product,sale,sale.branch,requests_energy_company,requests_energy_company.type,inspection.final_service_opinion',
          fields:
            'id,journey_counter,sale.id,sale.customer.complete_name,sale.signature_date,sale.total_value,sale.payment_status,sale.branch.name,is_documentation_completed,homologator.complete_name,designer_status,material_list_is_completed,trt_pending,peding_request,access_opnion,product.name,product.params,status,sale.status,is_released_to_engineering,requests_energy_company.status,requests_energy_company.type.name,delivery_status,installation_status,final_inspection_status,inspection.final_service_opinion.name',
          metrics: 'journey_counter,is_released_to_engineering,delivery_status,installation_status,final_inspection_status',
          is_pre_sale: false,
          ordering,
          ...filters,
        });

        const projectsWithStatus = data.results.map((project) => {
          const homolog =
            project.requests_energy_company?.find(
              (r) => r.type?.name?.toLowerCase() === 'vistoria final',
            )?.status || null;
          return {
            ...project,
            homologationStatus: homolog,
          };
        });

        setProjectsList(projectsWithStatus);
        setTotalRows(data.meta.pagination.total_count);

        const indicatorsData = await projectService.getIndicators({ ...filters, is_pre_sale: false });
        setIndicators(indicatorsData.indicators);

      } catch (err) {
        setError('Erro ao carregar Projetos e Indicadores');
      } finally {
        setLoadingProjects(false);
        setLoadingIndicators(false);
      }
    };

    fetchProjectsAndIndicators();
  }, [page, rowsPerPage, filters, ordering]);

  const handleSort = (field) => {
    setPage(0);
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else {
      setOrdering(field);
    }
  };

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target?.value, 10));
    setPage(0);
  }, []);

  const blockedToEngineering = useAnimatedNumber(indicators?.blocked_to_engineering || 0);
  const pendingMaterialList = useAnimatedNumber(indicators?.pending_material_list || 0);
  const releasedToEngineering = useAnimatedNumber(
    indicators?.is_released_to_engineering_count || 0,
  );
  const designerInProgress = useAnimatedNumber(indicators?.designer_in_progress_count || 0);
  const designerComplete = useAnimatedNumber(indicators?.designer_complete_count || 0);
  const designerCanceled = useAnimatedNumber(indicators?.designer_canceled_count || 0);

  const columns = [
    {
      field: 'sale.customer.complete_name',
      headerName: 'Cliente',
      render: (r) => r.sale.customer.complete_name
    },
    { field: 'product.name', headerName: 'Produto', render: (r) => r.product.name },
    {
      field: 'signature_date',
      headerName: 'Data de Contrato',
      render: (r) => new Date(r.sale.signature_date).toLocaleDateString('pt-BR'),
    },
    {
      field: 'journey_counter',
      headerName: 'Dias',
      render: (r) => <JourneyCounterChip count={r.journey_counter} />,
      sortable: true
    },
    { field: 'sale.branch.name', headerName: 'Unidade', render: (r) => r.sale.branch.name },
    {
      field: 'sale.total_value',
      headerName: 'Valor',
      render: (r) =>
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(r.sale.total_value),
    },
    {
      field: 'sale.status',
      headerName: 'Status Venda',
      render: (r) => <StatusChip status={r.sale.status} />,
    },
    {
      field: 'inspection_status',
      headerName: 'Status Vistoria',
      render: (r) => <ScheduleOpinionChip status={r.inspection?.final_service_opinion?.name} />
    },
    {
      field: 'status_financeiro',
      headerName: 'Status Financeiro',
      render: (r) => <StatusFinancialChip status={r.sale.payment_status} />,
    },
    {
      field: 'is_released_to_engineering',
      headerName: 'Liberado p/ Engenharia',
      render: (r) => (
        <Chip
          label={r.is_released_to_engineering ? 'Liberado' : 'Bloqueado'}
          color={r.is_released_to_engineering ? 'success' : 'error'}
          icon={
            r.is_released_to_engineering ? <IconCheck size={16} /> : <IconX size={16} />
          }
        />
      ),
    },
    {
      field: 'delivery_status',
      headerName: 'Status de Entrega',
      render: (r) => <ScheduleOpinionChip status={r.delivery_status} />,
    },
    {
      field: 'installation_status',
      headerName: 'Status de Instalação',
      render: (r) => <ScheduleOpinionChip status={r.installation_status} />,
    },
    {
      field: 'final_inspection_status',
      headerName: 'Status Homologação',
      render: (r) => <ScheduleOpinionChip status={r.final_inspection_status} />,
    },
  ];

  return (
    <>
      <Typography fontSize={20} fontWeight={700} sx={{ mt: 0 }} gutterBottom>
        Jornada do cliente
      </Typography>
      <Accordion defaultExpanded sx={{ marginBottom: 4 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="sale-cards-content"
          id="sale-cards-header"
        >
          <Typography variant="h6">Indicadores</Typography>
          <Tooltip
            title={
              <>
                <Typography variant="body2">
                  <strong>ATENÇÃO</strong>
                </Typography>
                <Typography variant="body2">
                  Para que o <strong>PROJETO</strong> seja liberado para a engenharia, é necessário
                  que:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • STATUS da VENDA esteja como <strong>FINALIZADO</strong>.
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • STATUS do FINANCEIRO na venda esteja como <strong>CONCLUÍDO</strong> ou{' '}
                  <strong>LIBERADO</strong>.
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • A vistoria principal esteja com PARECER FINAL <strong>APROVADO</strong>.
                </Typography>
              </>
            }
          >
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <HelpOutlineIcon />
            </Box>
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          {false && loadingIndicators ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" width={200} height={100} />
                <Skeleton variant="rectangular" width={200} height={100} />
                <Skeleton variant="rectangular" width={200} height={100} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" width={200} height={100} />
                <Skeleton variant="rectangular" width={200} height={100} />
                <Skeleton variant="rectangular" width={200} height={100} />
              </Box>
            </Box>
          ) : (
            <>
              <ProjectCards
                cardsData={[
                  {
                    backgroundColor: 'primary.light',
                    iconColor: 'primary.main',
                    IconComponent: IconListDetails,
                    title: 'Bloqueado',
                    subtitle: 'Para Engenharia',
                    count: blockedToEngineering,
                    onClick: () => setFilters({ ...filters, is_released_to_engineering: false }),
                  },
                  {
                    backgroundColor: 'success.light',
                    iconColor: 'success.main',
                    IconComponent: IconListDetails,
                    title: 'Pendente',
                    subtitle: 'Lista de Materiais',
                    count: pendingMaterialList,
                    onClick: () =>
                      setFilters({
                        ...filters,
                        material_list_is_completed: false,
                        is_released_to_engineering: true,
                        designer_status__in: 'CO',
                      }),
                  },
                  {
                    backgroundColor: 'secondary.light',
                    iconColor: 'secondary.main',
                    IconComponent: IconListDetails,
                    title: 'Liberados',
                    subtitle: 'Para Engenharia',
                    count: releasedToEngineering,
                    onClick: () => setFilters({ ...filters, is_released_to_engineering: true }),
                  },
                ]}
              />
              <ProjectCards
                cardsData={[
                  {
                    backgroundColor: 'primary.light',
                    iconColor: 'primary.main',
                    IconComponent: IconListDetails,
                    title: 'Em Andamento',
                    subtitle: 'Projetista',
                    count: designerInProgress,
                    onClick: () => setFilters({ ...filters, designer_status__in: 'EA' }),
                  },
                  {
                    backgroundColor: 'success.light',
                    iconColor: 'success.main',
                    IconComponent: IconListDetails,
                    title: 'Concluído',
                    subtitle: 'Projetista',
                    count: designerComplete,
                    onClick: () => setFilters({ ...filters, designer_status__in: 'CO' }),
                  },
                  {
                    backgroundColor: 'secondary.light',
                    iconColor: 'secondary.main',
                    IconComponent: IconListDetails,
                    title: 'Cancelado',
                    subtitle: 'Projetista',
                    count: designerCanceled,
                    onClick: () => setFilters({ ...filters, designer_status__in: 'C' }),
                  },
                ]}
              />
            </>
          )}
        </AccordionDetails>
      </Accordion>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
          >
            <Typography fontSize={14} fontWeight={600} gutterBottom>
              Lista de Projetos
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <Button
              variant="outlined"
              sx={{ mt: 1, mb: 2 }}
              onClick={() => setFilterDrawerOpen(true)}
            >
              Abrir Filtros
            </Button>
            <GenericFilterDrawer
              filters={projectFilterConfig}
              initialValues={filters}
              open={filterDrawerOpen}
              onClose={() => setFilterDrawerOpen(false)}
              onApply={(newFilters) => setFilters(newFilters)}
            />
          </Grid>
        </Grid>

        <TableHeader.Root>
          <TableHeader.Title
            title="Total"
            totalItems={totalRows}
            objNameNumberReference={projectsList.length === 1 ? 'Projeto' : 'Projetos'}
          />
        </TableHeader.Root>

        <Table.Root
          data={projectsList}
          totalRows={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRowClick={onClick}
          noWrap={true}
        >
          {/* Cabeçalho */}
          <Table.Head
            columns={columns}
            ordering={ordering}
            onSort={handleSort}
          />
          {/* Corpo */}
          <Table.Body
            loading={loadingProjects}
            columns={columns.length}
            onRowClick={onClick}
            sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' } }}
          >
            {columns.map(col => (
              <Table.Cell
                key={col.field}
                render={col.render}
                sx={col.sx}
              />
            ))}
          </Table.Body>
          <Table.Pagination />
        </Table.Root>
      </Grid>
    </>
  );
};

export default ProjectList;
