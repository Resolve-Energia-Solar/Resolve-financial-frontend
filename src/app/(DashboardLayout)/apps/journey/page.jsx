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
import CounterChip from '@/app/components/apps/comercial/sale/CounterChip';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';

import { FilterContext } from '@/context/FilterContext';
import projectService from '@/services/projectService';

const BCrumb = [{ title: 'Início' }];

const CustomerJourney = () => {
  const { filters, setFilters, refresh } = useContext(FilterContext);
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
        color = 'info';
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
          'sale.treadmill_counter',
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

  const customerJourneyFilterConfig = [];

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
                        <CounterChip counter={project.sale?.treadmill_counter || 0} projectId={project.id} />
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
                        {project.fieldServiceStatus?.Vistoria ? (
                          <Chip label={project.fieldServiceStatus.Vistoria} variant="outlined" />
                        ) : (
                          '-'
                        )}
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
                        {project.fieldServiceStatus?.Entrega ? (
                          <Chip label={project.fieldServiceStatus.Entrega} variant="outlined" />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {project.fieldServiceStatus?.["Instalação"] ? (
                          <Chip label={project.fieldServiceStatus["Instalação"]} variant="outlined" />
                        ) : (
                          '-'
                        )}
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
