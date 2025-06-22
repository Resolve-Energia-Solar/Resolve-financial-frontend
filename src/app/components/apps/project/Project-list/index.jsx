'use client';
import { useState, useEffect, useContext, useCallback } from 'react';
import {
  Button,
  Chip,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { IconCheck, IconX } from '@tabler/icons-react';

// Services
import projectService from '@/services/projectService';

// Context
import { FilterContext } from '@/context/FilterContext';

// Components
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import JourneyCounterChip from '../Costumer-journey/JourneyCounterChip';
import StatusChip from '@/utils/status/ProjectStatusChip';
import StatusFinancialChip from '@/utils/status/FinancialChip';
import ScheduleOpinionChip from '../../inspections/schedule/StatusChip';
import ChipRequestStatus from '../../request/components/auto-complete/ChipRequestStatus';

const ProjectList = ({ onClick, defaultfilters }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { filters, setFilters } = useContext(FilterContext);
  const [ordering, setOrdering] = useState('-created_at');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (defaultfilters) {
      const isDifferent = Object.entries(defaultfilters).some(
        ([key, value]) => filters[key] !== value
      );

      if (isDifferent) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          ...defaultfilters,
        }));
      }
    }
  }, [defaultfilters, filters]);




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
        { value: 'F', label: 'Finalizado' },
        { value: 'EA', label: 'Em Andamento' },
        { value: 'C', label: 'Cancelado' },
        { value: 'D', label: 'Distrato' },
        { value: 'ED', label: 'Em Processo de Distrato' },
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
      // setLoadingIndicators(true);
      try {
        const data = await projectService.index({
          page: page + 1,
          limit: rowsPerPage,
          expand:
            'sale,sale.customer,designer,homologator,product,sale,sale.branch,requests_energy_company,requests_energy_company.type,inspection.final_service_opinion',
          fields:
            'id,journey_counter,sale.id,sale.customer.complete_name,sale.signature_date,sale.total_value,sale.payment_status,sale.branch.name,is_documentation_completed,homologator.complete_name,designer_status,material_list_is_completed,trt_pending,peding_request,access_opnion,product.name,product.params,status,sale.status,is_released_to_engineering,requests_energy_company.status,requests_energy_company.type.name,delivery_status,installation_status,final_inspection_status,inspection.final_service_opinion.name',
          metrics: 'journey_counter,delivery_status,installation_status,final_inspection_status',
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

        // const indicatorsData = await projectService.getIndicators({ ...filters, is_pre_sale: false });
        // setIndicators(indicatorsData.indicators);

      } catch (err) {
        setError('Erro ao carregar Projetos e Indicadores');
      } finally {
        setLoadingProjects(false);
        // setLoadingIndicators(false);
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
      render: (r) => <ChipRequestStatus status={r.final_inspection_status} />,
    },
  ];

  const [debouncedSearch] = useState(() => {
    const debounce = (fn, delay) => {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
      };
    };

    return debounce((value) => {
      setFilters(prev => ({ ...prev, q: value }));
    }, 1000);
  });

  if (error) {
    return (
      <Typography color="error" variant="body2">
        Erro ao carregar dados do projeto: {error.message}
      </Typography>
    );
  }

  return (
    <>
      <Typography fontSize={20} fontWeight={700} sx={{ mt: 0 }} gutterBottom>
        Jornada do cliente
      </Typography>
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
            <Tooltip title={
              <div>
                Pesquise por:
                <ul>
                  <li>Número do Projeto</li>
                  <li>Projetista (Nome, CPF/CNPJ, Email)</li>
                  <li>Homologador (Nome, CPF/CNPJ, Email)</li>
                  <li>Número do Contrato</li>
                  <li>Cliente (Nome, CPF/CNPJ, Email)</li>
                  <li>Vendedor (Nome, CPF/CNPJ, Email)</li>
                  <li>Supervisor de Vendas (Nome, CPF/CNPJ, Email)</li>
                  <li>Gerente de Vendas (Nome, CPF/CNPJ, Email)</li>
                  <li>Fornecedor (Nome, CPF/CNPJ, Email)</li>
                </ul>
              </div>
            } arrow>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Pesquisar..."
                onChange={(e) => debouncedSearch(e.target.value)}
                sx={{ marginRight: 2 }}
              />
            </Tooltip>
            <Button
              variant="outlined"
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
