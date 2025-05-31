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
import EditRequestByProject from '../components/LogisticEditProject';
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
import serviceCatalogService from '@/services/serviceCatalogService';
import LogisticEditProject from '../components/LogisticEditProject';

const DeliveryLIstByProject = () => {
  const router = useRouter();
  const context = useContext(RequestDataContext);
  const filters = context?.filters || {};
  const setFilters = context?.setFilters || (() => { });

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
    serviceCatalogService.index({ fields: 'id,name' })
      .then((data) => {
        const types = data.results || [];
        setRequestTypes(types);
        if (types.length > 0) {
          setSelectedRequestType(types[0].id);
        }
      })
      .catch((err) =>
        console.error('Erro ao buscar tipos de solicitação:', err)
      );
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
            'load_increase_status',
            'branch_adjustment_status',
            'new_contact_number_status',
            'final_inspection_status',
            'address'
          ].join(','),
          expand:
            'requests_energy_company,sale.customer,homologator,requests_energy_company.type,product',
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
  }, [page, rowsPerPage, refresh, stableFilters]);

  // const decoratedProjects = useMemo(() => {
  //   return projectsList.map(proj => {
  //     const ofType = (proj.requests_energy_company || [])
  //       .filter(r => r.type?.id === selectedRequestType);

  //     const latestRequest = ofType.length
  //       ? ofType.sort((a, b) => new Date(b.request_date) - new Date(a.request_date))[0]
  //       : null;

  //     return { ...proj, latestRequest };
  //   });
  // }, [projectsList, selectedRequestType]);

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
      key: 'access_opnion_status',
      label: 'Parecer de Acesso',
      type: 'multiselect',
      options: [
        { value: 'Bloqueado', label: 'Bloqueado' },
        { value: 'Pendente', label: 'Pendente' },
        { value: 'Solicitado', label: 'Solicitado' },
        { value: 'Deferido', label: 'Deferido' },
        { value: 'Indeferido', label: 'Indeferido' },
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
      key: 'is_released_to_engineering',
      label: 'Liberado para Engenharia',
      type: 'select',
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' },
        { value: 'null', label: 'Todos' }
      ],
    },
  ];

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
      title: 'Bloqueado',
      count: '-',
    },
    {
      backgroundColor: 'success.light',
      iconColor: 'success.main',
      IconComponent: IconListDetails,
      title: 'Liberado',
      count: '-',
    },
    {
      backgroundColor: 'secondary.light',
      iconColor: 'secondary.main',
      IconComponent: IconPaperclip,
      title: 'Agendado',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Entregue',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Cancelado',
      count: '-',
    },
  ];

  const cardsBuyData = [
    {
      backgroundColor: 'primary.light',
      iconColor: 'primary.main',
      IconComponent: IconListDetails,
      title: 'Pendente',
      count: '-',
    },
    {
      backgroundColor: 'success.light',
      iconColor: 'success.main',
      IconComponent: IconListDetails,
      title: 'Distrato',
      count: '-',
    },
    {
      backgroundColor: 'secondary.light',
      iconColor: 'secondary.main',
      IconComponent: IconPaperclip,
      title: 'Cancelado',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Aguardando Pagamento',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Compra Realizada',
      count: '-',
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <Typography variant="h4">Logística</Typography>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="sale-cards-content"
            id="sale-cards-header"
          >
            <Typography variant="h6">Indicadores de Entrega</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InfoCard cardsData={cardsData} />
          </AccordionDetails>

          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="sale-cards-content"
            id="sale-cards-header"
          >
            <Typography variant="h6">Indicadores de Compras</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <InfoCard cardsData={cardsBuyData} />
          </AccordionDetails>
        </Accordion>

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
          // onClick={() => setOpenAddDialog(true)}
          >
            Criar Entrega
          </Button>
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
                <TableCell>Projeto</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Status da Venda</TableCell>
                <TableCell>Status de Compra</TableCell>
                <TableCell>Status da Entrega</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectsList.map((item) => {
                return (
                  <TableRow
                    key={item.id}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleEdit(item)}
                  >
                    <TableCell>PROJ1234 - Cliente X</TableCell>
                    <TableCell>
                      -
                    </TableCell>
                    <TableCell>
                      {item.address?.complete_address || '-'}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={item.sale?.status} />
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                    <TableCell>
                      -
                    </TableCell>
                  </TableRow>
                )
              }
              )}
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

      <SideDrawer
        title="Editar Solicitação"
        open={openSideDrawer}
        onClose={handleSideDrawerClose}
      >
        <LogisticEditProject
          projectId={requestSelected?.id}
          projectData={requestSelected}
          onClosedModal={handleSideDrawerClose}
          onRefresh={refreshData}
        />
      </SideDrawer>

      <Dialog
        open={openAddDialog}
        onClose={handleAddDialogClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Criar Entrega</DialogTitle>
        <DialogContent>
          <AddRequestCompany
            onClosedModal={handleAddDialogClose}
            onRefresh={refreshData}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeliveryLIstByProject;
