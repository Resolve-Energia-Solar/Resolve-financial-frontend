'use client';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Box,
  Button,
  Grid,
  Chip,
  CardContent,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  Paper,
  CircularProgress,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';
import TableSkeleton from '@/app/components/apps/comercial/sale/components/TableSkeleton';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';

import { FilterContext } from '@/context/FilterContext';
import projectService from '@/services/projectService';
import JourneyCounterChip from '@/app/components/apps/project/Costumer-journey/JourneyCounterChip';

const BCrumb = [{ title: 'Início' }];

const CustomerJourney = () => {
  const { filters, setFilters } = useContext(FilterContext);
  const [loading, setLoading] = useState(true);
  const [projectList, setProjectList] = useState([]);
  // const [selectedProjectId, setSelectedProjectId] = useState(null);
  // const [selectedServices, setSelectedServices] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('created_at');
  const [orderDirection, setOrderDirection] = useState('asc');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

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

  const getFieldServiceStatusChip = (status) => {
    if (!status) {
      return <Chip label="Pendente" color="default" />;
    }
    const lowerStatus = status.toLowerCase();
    let color = 'default';

    if (lowerStatus.includes('solicitado') || lowerStatus.includes('solicito') || lowerStatus.includes('confirmado')) {
      color = 'primary';
    } else if (lowerStatus.includes('aprovado')) {
      color = 'success';
    } else if (lowerStatus.includes('reprovado') || lowerStatus.includes('reprovada')) {
      color = 'error';
    } else if (lowerStatus.includes('cancelado') || lowerStatus.includes('cancelada')) {
      color = 'error';
    } else if (lowerStatus.includes('concluído')) {
      color = 'success';
    } else if (lowerStatus.includes('andamento')) {
      color = 'info';
    } else if (lowerStatus.includes('entregue')) {
      color = 'success';
    } else if (lowerStatus.includes('agendado')) {
      color = 'info';
    }

    return <Chip label={status} color={color} />;
  }

  useEffect(() => {
    setLoading(true);
    projectService
      .index({
        page,
        limit: rowsPerPage,
        expand: [
          'sale',
          'sale.customer',
          'field_services.service.category',
          'field_services.final_service_opinion'
        ],
        fields: [
          'id',
          'sale.signature_date',
          'sale.contract_number',
          'journey_counter',
          'sale.customer.complete_name',
          'project_number',
          'sale.status',
          'sale.payment_status',
          'designer_status',
          'field_services.service.category.name',
          'field_services.final_service_opinion.name',
          'field_services.status',
          'field_services.schedule_date'
        ],
        metrics: 'journey_counter',
        ordering: orderDirection === 'desc' ? order : `-${order}`,
        ...filters,
      })
      .then((data) => {
        const getFieldServiceStatus = (project) => {
          const categories = ['Vistoria', 'Instalação', 'Entrega'];
          const latestServices = {};

          project.field_services.forEach(fs => {
            const categoryName = fs.service?.category?.name;
            if (!categories.includes(categoryName)) return;

            const serviceDate = new Date(fs.schedule_date);
            if (
              !latestServices[categoryName] ||
              serviceDate > new Date(latestServices[categoryName].schedule_date)
            ) {
              latestServices[categoryName] = fs;
            }
          });

          const result = {};
          categories.forEach(category => {
            result[category] = latestServices[category]
              ? (latestServices[category].final_service_opinion
                ? latestServices[category].final_service_opinion.name
                : latestServices[category].status)
              : null;
          });
          return result;
        };

        const projectsWithStatus = data.results.map(project => ({
          ...project,
          fieldServiceStatus: getFieldServiceStatus(project),
        }));

        setProjectList(projectsWithStatus);
        setTotalRows(data.meta.pagination.total_count);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Error fetching projects');
      })
      .finally(() => setLoading(false));
  }, [page, rowsPerPage, order, orderDirection, filters]);

  const handleSort = useCallback(
    (field) => {
      if (order === field) {
        setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setOrder(field);
        setOrderDirection('asc');
      }
    },
    [order, orderDirection],
  );

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const customerJourneyFilterConfig = [
    {
      key: 'customer',
      label: 'Cliente',
      type: 'async-multiselect',
      endpoint: '/api/users/',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'], limit: 10 },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        }))
    },
    {
      key: 'sale__in',
      label: 'Venda',
      type: 'async-multiselect',
      endpoint: '/api/sales/',
      queryParam: 'contract_number__icontains',
      mapResponse: (data) =>
        data.results.map((sale) => ({
          label: `${sale.contract_number} - ${sale.customer?.complete_name}`,
          value: sale.id,
        })),
      extraParams: {
        expand: ['customer'],
        fields: ['id', 'contract_number', 'customer.complete_name'],
      },
    },
    {
      key: 'product__in',
      label: 'Produto',
      type: 'async-multiselect',
      endpoint: '/api/products/',
      queryParam: 'product__in',
      mapResponse: (data) =>
        data.results.map((product) => ({
          label: product.name,
          value: product.id,
        })),
      extraParams: {
        fields: ['id', 'name'],
      },
    },
    {
      key: 'materials__in',
      label: 'Materiais',
      type: 'async-multiselect',
      endpoint: '/api/materials/',
      queryParam: 'materials__in',
      mapResponse: (data) =>
        data.results.map((material) => ({
          label: material.name,
          value: material.id,
        })),
      extraParams: {
        fields: ['id', 'name'],
      },
    },
    {
      key: 'project_number__icontains',
      label: 'Número do Projeto',
      type: 'text',
    },
    {
      key: 'plant_integration__icontains',
      label: 'ID da Usina',
      type: 'text',
    },
    {
      key: 'designer__in',
      label: 'Projetista',
      type: 'async-multiselect',
      endpoint: '/api/users/',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'], limit: 10 },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        }))
    },
    {
      key: 'designer_status__in',
      label: 'Status do Projeto de Engenharia',
      type: 'multiselect',
      options: [
        { label: 'Pendente', value: 'P' },
        { label: 'Concluído', value: 'CO' },
        { label: 'Em Andamento', value: 'EA' },
        { label: 'Cancelado', value: 'C' },
        { label: 'Distrato', value: 'D' },
      ],
    },
    {
      key: 'designer_coclusion_date__range',
      label: 'Data de Conclusão do Projeto de Engenharia',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'inspection__in',
      label: 'Agendamentos da Vistoria',
      type: 'async-multiselect',
      endpoint: '/api/schedules/',
      queryParam: 'inspection__in',
      mapResponse: (data) =>
        data.results.map((schedule) => ({
          label: schedule.protocol,
          value: schedule.id,
        })),
      extraParams: {
        fields: ['id', 'protocol'],
      },
    },
    {
      key: 'start_date__range',
      label: 'Data de Início',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'end_date__range',
      label: 'Data de Término',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'is_completed__in',
      label: 'Projeto Completo',
      type: 'multiselect',
      options: [
        { label: 'Sim', value: 'true' },
        { label: 'Não', value: 'false' },
      ],
    },
    {
      key: 'status__in',
      label: 'Status do Projeto',
      type: 'multiselect',
      options: [
        { label: 'Pendente', value: 'P' },
        { label: 'Concluído', value: 'CO' },
        { label: 'Em Andamento', value: 'EA' },
        { label: 'Cancelado', value: 'C' },
        { label: 'Distrato', value: 'D' },
      ],
    },
    {
      key: 'homologator__in',
      label: 'Homologador',
      type: 'async-multiselect',
      endpoint: '/api/users/',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'], limit: 10 },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        }))
    },
    {
      key: 'is_documentation_completed__in',
      label: 'Documentos Completos (Múltiplo)',
      type: 'multiselect',
      options: [
        { label: 'Sim', value: 'true' },
        { label: 'Não', value: 'false' },
      ],
    },
    {
      key: 'material_list_is_completed__in',
      label: 'Lista de Materiais Finalizada',
      type: 'multiselect',
      options: [
        { label: 'Sim', value: 'true' },
        { label: 'Não', value: 'false' },
      ],
    },
    {
      key: 'documention_completion_date__range',
      label: 'Data de Conclusão do Documento',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'registered_circuit_breaker__in',
      label: 'Disjuntor Cadastrado',
      type: 'async-multiselect',
      endpoint: '/api/materials/',
      queryParam: 'registered_circuit_breaker__in',
      mapResponse: (data) =>
        data.results.map((material) => ({
          label: material.name,
          value: material.id,
        })),
      extraParams: {
        fields: ['id', 'name'],
      },
    },
    {
      key: 'created_at__range',
      label: 'Data de Criação',
      type: 'range',
      inputType: 'date',
    }
  ];

  return (
    <PageContainer title="Jornada do Cliente" description="Acompanhe a jornada do cliente por todas as etapas.">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <Grid container justifyContent="space-between" marginBlockEnd={3}>
            <Typography variant="h5" gutterBottom alignContent={'center'}>
              Clientes
            </Typography>
            <Grid container xs={2} justifyContent={'flex-end'}>
              <Button variant="outlined" onClick={() => setFilterDrawerOpen(true)}>
                Abrir Filtros
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <TableSkeleton rows={rowsPerPage} columns={11} />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer
              component={Paper}
              elevation={10}
              sx={{
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              <Table stickyHeader aria-label="project table">
                <TableHead>
                  <TableRow>
                    <TableCell>Contador</TableCell>
                    <TableCell>Data de Assinatura</TableCell>
                    <TableCell onClick={() => handleSort('customer__name')}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>Venda / Cliente</span>
                        {order === 'status' &&
                          (orderDirection === 'asc' ? (
                            <ArrowDropUpIcon sx={{ ml: 0.5 }} />
                          ) : (
                            <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                          ))}
                      </Box>
                    </TableCell>
                    <TableCell>Projeto</TableCell>
                    <TableCell>Vistoria</TableCell>
                    <TableCell>Status da Venda</TableCell>
                    <TableCell>Financeiro</TableCell>
                    <TableCell>Engenharia</TableCell>
                    <TableCell>Entrega</TableCell>
                    <TableCell>Instalação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectList.map((project) => (
                    <TableRow
                      key={project.id}
                      hover
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setDetailsDrawerOpen(true);
                      }}
                    >
                      <TableCell>
                        <JourneyCounterChip counter={project.journey_counter} />
                      </TableCell>
                      <TableCell sx={{ textWrap: 'nowrap' }}>
                        {project.sale?.signature_date
                          ? new Date(project.sale.signature_date).toLocaleString('pt-BR')
                          : "-"}
                      </TableCell>
                      <TableCell sx={{ textWrap: 'nowrap' }}>
                        {project.sale?.contract_number} / {project?.sale?.customer?.complete_name}
                      </TableCell>
                      <TableCell>{project.project_number}</TableCell>
                      <TableCell>
                        {getFieldServiceStatusChip(project.fieldServiceStatus?.Vistoria)}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(project.sale?.status)}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(project.sale?.payment_status)}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(project.designer_status)}
                      </TableCell>
                      <TableCell>
                        {getFieldServiceStatusChip(project.fieldServiceStatus?.Entrega)}
                      </TableCell>
                      <TableCell>
                        {getFieldServiceStatusChip(project.fieldServiceStatus?.['Instalação'])
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                  {loading && page > 1 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

          )}
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
        </CardContent>
      </BlankCard>
      <GenericFilterDrawer
        filters={customerJourneyFilterConfig}
        initialValues={filters}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />
      {/* <DetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        projectId={selectedProjectId}
      /> */}
    </PageContainer>
  );
};

export default CustomerJourney;
