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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { AddBoxRounded } from '@mui/icons-material';
import FilterAlt from '@mui/icons-material/FilterAlt';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import ChipRequest from '../components/auto-complete/ChipRequest';
import AddRequestCompany from '../Add-request';
import RequestDrawer from '../components/filterDrawer/RequestDrawer';
import { RequestDataContext } from '@/app/context/RequestContext';
import InforCards from '@/app/components/apps/inforCards/InforCards';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import projectService from '@/services/projectService';
import RequestTypeService from '@/services/requestTypeService';
import StatusChip from '@/utils/status/DocumentStatusIcon';
import SideDrawer from '@/app/components/shared/SideDrawer';
import EditRequestByProject from '../components/EditRequestByProject';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ResquestLIstByProject = ({}) => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const context = useContext(RequestDataContext);
  const filters = context ? context.filters : {};
  const setFilters = context ? context.setFilters : () => {};

  // Estado para o projeto selecionado e para o SideDrawer de edição
  const [requestSelected, setRequestSelected] = useState(null);
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // NOVO: Estado para tipos de solicitação
  const [requestTypes, setRequestTypes] = useState([]);
  const [selectedRequestTypes, setSelectedRequestTypes] = useState([]);

  // Buscar tipos de solicitação utilizando o RequestTypeService
  useEffect(() => {
    RequestTypeService.index({ fields: 'id,name' })
      .then((data) => {
        const types = data.results || [];
        setRequestTypes(types);
        // Por padrão, seleciona todos
        setSelectedRequestTypes(types.map((type) => type.id));
      })
      .catch((err) => console.error('Erro ao buscar tipos de solicitação:', err));
  }, []);

  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const refreshData = () => {
    setRefresh(!refresh);
  };

  const toggleRequestDrawer = (open) => () => {
    setIsFilterOpen(open);
  };

  const handleApplyFilters = (newFilters) => {
    if (context) {
      setFilters(newFilters);
      setPage(0);
    }
  };

  // Função para abrir o SideDrawer ao clicar na linha da tabela
  const handleEdit = (project) => {
    setRequestSelected(project);
    setOpenSideDrawer(true);
  };

  const handleSideDrawerClose = () => {
    setOpenSideDrawer(false);
  };

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
            'requests_energy_company.interim_protocol',
            'requests_energy_company.status',
            'requests_energy_company.request_date',
            'requests_energy_company.conclusion_date',
          ].join(','),
          expand:
            'requests_energy_company,sale.customer,homologator,requests_energy_company.type,product',
          // Filtro mocado para tipos de solicitação
          request_type__in: selectedRequestTypes.join(','),
          ...stableFilters,
        });
        console.log('Data fetched:', data);
        setProjectsList(data.results);
        setTotalRows(data.meta.pagination.total_count);
      } catch (err) {
        setError('Erro ao carregar Solicitações');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, rowsPerPage, refresh, stableFilters, selectedRequestTypes]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4">Solicitações</Typography>

        {/* Formulário para filtrar por Tipo de Solicitação */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={10}>
            <FormControl fullWidth>
              <InputLabel id="request-type-select-label">Tipo Solicitação</InputLabel>
              <Select
                labelId="request-type-select-label"
                id="request-type-select"
                multiple
                value={selectedRequestTypes}
                onChange={(e) => {
                  setSelectedRequestTypes(e.target.value);
                  setPage(0);
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const type = requestTypes.find((t) => t.id === value);
                      return <Chip key={value} label={type ? type.name : value} />;
                    })}
                  </Box>
                )}
                label="Tipo Solicitação"
              >
                {requestTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Se necessário, adicione outros filtros ou botões aqui */}
        </Grid>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="sale-cards-content"
            id="sale-cards-header"
          >
            <Typography variant="h6">Indicadores</Typography>
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
          {/* Botão de filtros, se necessário */}
          {/* <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            onClick={toggleRequestDrawer(true)}
          >
            Filtros
          </Button> */}
        </Box>
      </Box>

      {/* <RequestDrawer
        externalOpen={isFilterOpen}
        onClose={toggleRequestDrawer(false)}
        onApplyFilters={handleApplyFilters}
      /> */}

      {loading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(projectsList) &&
                projectsList.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleEdit(item)}
                  >
                    <TableCell>
                      {item.is_released_to_engineering ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>{item.project_number || '-'}</TableCell>
                    <TableCell>
                      {item.sale?.customer?.complete_name ||
                        item.sale?.customer?.email}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={item.status} />
                    </TableCell>
                    <TableCell>
                      {item.homologator?.complete_name ||
                        item.homologator?.email ||
                        'Não Associado'}
                    </TableCell>
                    <TableCell>
                      {item?.requests_energy_company[0]?.type?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {item?.requests_energy_company[0]?.interim_protocol || '-'}
                    </TableCell>
                    <TableCell>
                      <ChipRequest
                        status={item.requests_energy_company[0]?.status}
                      />
                    </TableCell>
                    <TableCell>
                      {item.requests_energy_company[0]?.request_date
                        ? format(
                            new Date(
                              item.requests_energy_company[0]?.request_date
                            ),
                            'dd/MM/yyyy'
                          )
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {item.requests_energy_company[0]?.conclusion_date
                        ? format(
                            new Date(
                              item.requests_energy_company[0]?.conclusion_date
                            ),
                            'dd/MM/yyyy'
                          )
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* SideDrawer para edição */}
      <SideDrawer
        title="Editar Solicitação"
        open={openSideDrawer}
        onClose={handleSideDrawerClose}
        projectId={requestSelected?.id}
      >
        <EditRequestByProject
          projectId={requestSelected?.id}
          projectData={requestSelected}
          onClosedModal={handleSideDrawerClose}
          onRefresh={refreshData}
        />
      </SideDrawer>

      {/* Dialog para criação */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Criar Solicitação</DialogTitle>
        <DialogContent>
          <AddRequestCompany
            onClosedModal={() => setOpenAddDialog(false)}
            onRefresh={refreshData}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResquestLIstByProject;
