import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import InfoCard from '@/app/components/apps/inforCards/InforCards.jsx';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { AddBoxRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import ChipRequest from '../components/auto-complete/ChipRequest';
import AddRequestCompany from '../Add-request';
import { RequestDataContext } from '@/app/context/RequestContext';
import projectService from '@/services/projectService';
import RequestTypeService from '@/services/requestTypeService';
import SideDrawer from '@/app/components/shared/SideDrawer';
import EditRequestByProject from '../components/EditRequestByProject';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import { IconListDetails, IconSortAscending } from '@tabler/icons-react';
import { IconPaperclip } from '@tabler/icons-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatusChip from '@/utils/status/ProjectStatusChip';
import ChipRequestStatus from '../components/auto-complete/ChipRequestStatus';
import GenericChip from '@/utils/status/Chip';
import theme from '@/utils/theme';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import StatusWithProgressBar from '../components/StatusWithProgressBar';

const ResquestLIstByProject = () => {
  const router = useRouter();
  const context = useContext(RequestDataContext);
  const filters = context?.filters || {};
  const setFilters = context?.setFilters || (() => {});

  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [refresh, setRefresh] = useState(false);

  // --- controles do filtro drawer ---
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // --- Tipos de solicitação ---
  const [requestTypes, setRequestTypes] = useState([]);
  const [selectedRequestType, setSelectedRequestType] = useState(null);

  useEffect(() => {
    RequestTypeService.index({ fields: 'id,name' })
      .then((data) => {
        const types = data.results || [];
        setRequestTypes(types);
        if (types.length > 0) {
          setSelectedRequestType(types[0].id);
        }
      })
      .catch((err) => console.error('Erro ao buscar tipos de solicitação:', err));
  }, []);

  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const refreshData = () => setRefresh((prev) => !prev);

  // Fetch dos projetos
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await projectService.index({
          page: page + 1,
          limit: rowsPerPage,
          fields: [
            'id',
            'project_number',
            'sale.id',
            'sale.status',
            'sale.customer.id',
            'sale.customer.email',
            'sale.customer.complete_name',
            'product.id',
            'product.name',
            'homologator.complete_name',
            'designer_status',
            'material_list_is_completed',
            'trt_pending',
            'peding_request',
            'access_opnion',
            'status',
            'is_released_to_engineering',
            'requests_energy_company.id',
            'requests_energy_company.type.name',
            'requests_energy_company.type.id',
            'requests_energy_company.interim_protocol',
            'requests_energy_company.status',
            'requests_energy_company.request_date',
            'requests_energy_company.conclusion_date',
            'supply_adquance',
            'access_opnion_status',
            'access_opnion_days_int',
            'load_increase_status',
            'load_increase_days_int',
            'branch_adjustment_status',
            'branch_adjustment_days_int',
            'new_contact_number_status',
            'new_contact_number_days_int',
            'final_inspection_status',
            'final_inspection_days_int',
            'supply_adquance_names',
          ].join(','),
          expand:
            'requests_energy_company,sale.customer,homologator,requests_energy_company.type,product',
          metrics:
            'homologation_status,supply_adquance_names,trt_pending,pending_material_list,trt_status',
          ...stableFilters,
        });
        setProjectsList(data.results);
        setTotalRows(data.meta.pagination.total_count);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar Solicitações');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, rowsPerPage, refresh, stableFilters, selectedRequestType]);

  const decoratedProjects = useMemo(() => {
    return projectsList.map((proj) => {
      const ofType = (proj.requests_energy_company || []).filter(
        (r) => r.type?.id === selectedRequestType,
      );

      const latestRequest = ofType.length
        ? ofType.sort((a, b) => new Date(b.request_date) - new Date(a.request_date))[0]
        : null;

      return { ...proj, latestRequest };
    });
  }, [projectsList, selectedRequestType]);

  // Paginação
  const handlePageChange = (_, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

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
      key: 'current_step__in',
      label: 'Etapa Atual',
      type: 'async-multiselect',
      endpoint: '/api/steps-names',
      queryParam: 'name__icontains',
      mapResponse: (data) =>
        data.results.map((step) => ({
          label: step.name,
          value: step.id,
        })),
    },
    {
      key: 'signature_date',
      label: 'Data de Contrato',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'product_kwp',
      label: 'Kwp',
      type: 'number',
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
      key: 'access_opnion_status',
      label: 'Parecer de Acesso',
      type: 'multiselect',
      options: [
        { value: 'Bloqueado', label: 'Bloqueado' },
        { value: 'Pendete', label: 'Pendente' },
        { value: 'Solicitado', label: 'Solicitado' },
        { value: 'Deferido', label: 'Deferido' },
        { value: 'Indeferido', label: 'Indeferido' },
      ],
    },
    {
      key: 'load_increase_status',
      label: 'Aumento de Carga',
      type: 'multiselect',
      options: [
        { value: 'Bloqueado', label: 'Bloqueado' },
        { value: 'Pendete', label: 'Pendente' },
        { value: 'Solicitado', label: 'Solicitado' },
        { value: 'Deferido', label: 'Deferido' },
        { value: 'Indeferido', label: 'Indeferido' },
      ],
    },
    {
      key: 'branch_adjustment_status',
      label: 'Ajuste de Ramal',
      type: 'multiselect',
      options: [
        { value: 'Bloqueado', label: 'Bloqueado' },
        { value: 'Pendete', label: 'Pendente' },
        { value: 'Solicitado', label: 'Solicitado' },
        { value: 'Deferido', label: 'Deferido' },
        { value: 'Indeferido', label: 'Indeferido' },
      ],
    },
    {
      key: 'final_inspection_status',
      label: 'Vistoria Final',
      type: 'multiselect',
      options: [
        { value: 'Bloqueado', label: 'Bloqueado' },
        { value: 'Pendete', label: 'Pendente' },
        { value: 'Solicitado', label: 'Solicitado' },
        { value: 'Deferido', label: 'Deferido' },
        { value: 'Indeferido', label: 'Indeferido' },
      ],
    },
    {
      key: 'new_contact_number_status',
      label: 'Nova UC Status',
      type: 'multiselect',
      options: [
        { value: 'Bloqueado', label: 'Bloqueado' },
        { value: 'Pendete', label: 'Pendente' },
        { value: 'Solicitado', label: 'Solicitado' },
        { value: 'Deferido', label: 'Deferido' },
        { value: 'Indeferido', label: 'Indeferido' },
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
      key: 'is_released_to_engineering',
      label: 'Liberado para Engenharia',
      type: 'select',
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' },
        { value: 'null', label: 'Todos' },
      ],
    },
  ];

  const trtStatusMap = {
    Bloqueado: {
      label: 'Bloqueado',
      color: theme.palette.error.light,
      icon: <CancelIcon color='light' />,
    },
    Reprovada: {
      label: 'Reprovada',
      color: theme.palette.error.light,
      icon: <CancelIcon color='light' />,
    },
    'Em Andamento': {
      label: 'Em Andamento',
      color: theme.palette.info.light,
      icon: <HourglassFullIcon color='light' />,
    },
    Concluída: {
      label: 'Concluída',
      color: theme.palette.success.light,
      icon: <CheckCircleIcon color='light' />,
    },
    Pendente: {
      label: 'Pendente',
      color: theme.palette.warning.light,
      icon: <HourglassEmptyIcon color='light' />,
    },
  };

  // Estados e handlers para modais/edição
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [requestSelected, setRequestSelected] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleEdit = (proj) => {
    setRequestSelected(proj);
    setOpenSideDrawer(true);
  };

  const handleSideDrawerClose = () => {
    setOpenSideDrawer(false);
    refreshData();
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    refreshData();
  };

  // placeholder: defina projectFilterConfig em outro lugar
  // const projectFilterConfig = [...]

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
      title: 'Aumento de carga',
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
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Typography variant="h4">Homologação</Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={10}>
            <FormControl fullWidth required>
              <InputLabel id="request-type-select-label">Tipo Solicitação</InputLabel>
              <Select
                labelId="request-type-select-label"
                id="request-type-select"
                value={selectedRequestType ?? ''}
                label="Tipo Solicitação"
                onChange={(e) => {
                  setSelectedRequestType(e.target.value);
                  setPage(0);
                }}
              >
                {requestTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2} sx={{ textAlign: 'right' }}>
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
              onApply={(newFilters) => {
                setFilters(newFilters);
                setPage(0);
              }}
            />
          </Grid>
        </Grid>

        {/* <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="sale-cards-content"
            id="sale-cards-header"
          >
            <Typography variant="h6">Indicadores</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InfoCard cardsData={cardsData} />
          </AccordionDetails>
        </Accordion> */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<AddBoxRounded />}
            onClick={() => setOpenAddDialog(true)}
          >
            Nova Solicitação
          </Button>
        </Box>
      </Box>

      {loading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <TableCell key={idx}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: rowsPerPage }).map((_, ridx) => (
                <TableRow key={ridx}>
                  {Array.from({ length: 10 }).map((__, cidx) => (
                    <TableCell key={cidx}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Liberado para Eng.</TableCell>
                <TableCell>Projeto</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Status da Venda</TableCell>
                <TableCell>Homologador</TableCell>
                <TableCell>Tipo Solicitação</TableCell>
                <TableCell>Protoc. Provisório</TableCell>
                <TableCell>Status da Solic.</TableCell>
                <TableCell>Data da Solicitação</TableCell>
                <TableCell>Data de Conclusão</TableCell>
                <TableCell>ART/TRT</TableCell>
                <TableCell>Adequação Fornec.</TableCell>
                <TableCell>Parecer Acesso</TableCell>
                <TableCell>Aumento Carga</TableCell>
                <TableCell>Ajuste Ramal</TableCell>
                <TableCell>Nova UC</TableCell>
                <TableCell>Vistoria Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {decoratedProjects.map((item) => {
                return (
                  <TableRow
                    key={item.id}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleEdit(item)}
                  >
                    <TableCell>
                      {item.is_released_to_engineering ? (
                        <CheckCircleOutlineIcon color="success" />
                      ) : (
                        <RemoveCircleOutlineIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>{item.project_number || '-'}</TableCell>
                    <TableCell>
                      {item.sale?.customer?.complete_name || item.sale?.customer?.email || '-'}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={item.sale?.status} />
                    </TableCell>
                    <TableCell>
                      {item.homologator?.complete_name ||
                        item.homologator?.email ||
                        'Não Associado'}
                    </TableCell>
                    <TableCell>{item.latestRequest?.type?.name || 'Falta solicitação'}</TableCell>
                    <TableCell>{item.latestRequest?.interim_protocol || '-'}</TableCell>
                    <TableCell>
                      <ChipRequest status={item.latestRequest?.status} />
                    </TableCell>
                    <TableCell>
                      {item.latestRequest?.request_date
                        ? format(new Date(item.latestRequest.request_date), 'dd/MM/yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {item.latestRequest?.conclusion_date
                        ? format(new Date(item.latestRequest.conclusion_date), 'dd/MM/yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <GenericChip status={item.trt_pending} statusMap={trtStatusMap} />
                    </TableCell>
                    <TableCell>{item.supply_adquance_names}</TableCell>
                    <TableCell>
                      <StatusWithProgressBar
                        status={item.access_opnion_status}
                        days={item.access_opnion_days_int}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusWithProgressBar
                        status={item.load_increase_status}
                        days={item.load_increase_days_int}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusWithProgressBar
                        status={item.branch_adjustment_status}
                        days={item.branch_adjustment_days_int}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusWithProgressBar
                        status={item.new_contact_number_status}
                        days={item.new_contact_number_days_int}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusWithProgressBar
                        status={item.final_inspection_status}
                        days={item.final_inspection_days_int}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            labelRowsPerPage="Linhas por página"
          />
        </TableContainer>
      )}

      <SideDrawer title="Editar Solicitação" open={openSideDrawer} onClose={handleSideDrawerClose}>
        <EditRequestByProject
          projectId={requestSelected?.id}
          projectData={requestSelected}
          onClosedModal={handleSideDrawerClose}
          onRefresh={refreshData}
        />
      </SideDrawer>

      <Dialog open={openAddDialog} onClose={handleAddDialogClose} fullWidth maxWidth="lg">
        <DialogTitle>Criar Solicitação</DialogTitle>
        <DialogContent>
          <AddRequestCompany onClosedModal={handleAddDialogClose} onRefresh={refreshData} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResquestLIstByProject;
