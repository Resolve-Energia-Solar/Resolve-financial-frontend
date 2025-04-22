'use client';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
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
import ScheduleStatusChip from '@/app/components/apps/inspections/schedule/StatusChip';
import TableSkeleton from '@/app/components/apps/comercial/sale/components/TableSkeleton';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';

import { FilterContext } from '@/context/FilterContext';
import scheduleService from '@/services/scheduleService';
import serviceCatalogService from '@/services/serviceCatalogService';
import { formatDate } from '@/utils/dateUtils';
import DetailsDrawer from '@/app/components/apps/schedule/DetailsDrawer';
import UserCard from '@/app/components/apps/users/userCard';
import ScheduleOpinionChip from '@/app/components/apps/inspections/schedule/StatusChip/ScheduleOpinionChip';

const BCrumb = [{ to: '/', title: 'Início' }, { title: 'Agendamentos' }];

const ScheduleTable = () => {
  const { filters, setFilters, refresh } = useContext(FilterContext);
  const [loading, setLoading] = useState(true);
  const [scheduleList, setScheduleList] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('created_at');
  const [orderDirection, setOrderDirection] = useState('asc');
  const userPermissions = useSelector((state) => state.user.permissions);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const hasPermission = useCallback(
    (permissions) => !permissions || permissions.some((p) => userPermissions?.includes(p)),
    [userPermissions],
  );

  useEffect(() => {
    serviceCatalogService
      .getServicesCatalog({ fields: 'id,name', limit: 100 })
      .then((data) => {
        const list = data.results || [];
        setServices(list);
        if (list.length > 0) {
          setSelectedServices(list.map((s) => s.id));
        }
      })
      .catch((err) => console.error('Erro ao buscar serviços:', err));
  }, []);

  useEffect(() => {
    if (selectedServices.length === 0) return;
    setLoading(true);
    scheduleService
      .index({
        page,
        limit: rowsPerPage,
        expand: ['customer', 'service_opinion', 'final_service_opinion', 'branch', 'address', 'service'],
        service__in: selectedServices.join(','),
        fields: [
          'id',
          'service.name',
          'created_at',
          'customer.complete_name',
          'status',
          'service_opinion.name',
          'final_service_opinion.name',
          'schedule_date',
          'schedule_start_time',
          'schedule_agent.complete_name',
          'address.complete_address',
          'observation',
          'branch.name',
          'schedule_agent',
          'observation',
          'service.name'
        ],
        ordering: orderDirection === 'desc' ? order : `-${order}`,
        ...filters,
      })
      .then((data) => {
        setScheduleList(data.results);
        setTotalRows(data.meta.pagination.total_count);
      })
      .catch((err) => {
        console.error('Erro:', err);
        setError('Erro ao buscar agendamentos');
      })
      .finally(() => setLoading(false));
  }, [selectedServices, page, rowsPerPage, order, orderDirection, filters]);

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

  const scheduleFilterConfig = [
    {
      key: 'schedule_date__range',
      label: 'Data do Agendamento (Entre)',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'status__in',
      label: 'Status do Agendamento (Lista)',
      type: 'multiselect',
      options: [
        { value: 'Pendente', label: 'Pendente' },
        { value: 'Confirmado', label: 'Confirmado' },
        { value: 'Cancelado', label: 'Cancelado' },
      ],
    },
    {
      key: 'final_service_is_null',
      label: 'Parecer Final do Serviço Pendente',
      type: 'select',
      options: [
        { value: 'null', label: 'Todos' },
        { value: true, label: 'Pendente' },
        { value: 'false', label: 'Concluído' },
      ],
    },
    {
      key: 'service_opnion_is_null',
      label: 'Parecer do Serviço Pendente',
      type: 'select',
      options: [
        { value: 'null', label: 'Todos' },
        { value: true, label: 'Pendente' },
        { value: 'false', label: 'Concluído' },
      ],
    },
    {
      key: 'schedule_agent__in',
      label: 'Agente de Campo',
      type: 'async-multiselect',
      endpoint: '/api/users/',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'] },
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        })),
    },
    {
      key: 'customer',
      label: 'Cliente',
      type: 'async-autocomplete',
      endpoint: '/api/users/',
      queryParam: 'complete_name__icontains',
      extraParams: { fields: ['id', 'complete_name'] },
      mapResponse: (data) =>
        data.results.map((customer) => ({
          label: customer.complete_name,
          value: customer.id,
        })),
    },
    {
      key: 'branch__in',
      label: 'Unidade',
      type: 'async-multiselect',
      endpoint: '/api/branches/',
      queryParam: 'name__icontains',
      extraParams: { limit: 10, fields: ['id', 'name'] },
      mapResponse: (data) =>
        data.results.map((branch) => ({
          label: branch.name,
          value: branch.id,
        })),
    },
    {
      key: 'service_opinion__in',
      label: 'Parecer do Serviço',
      type: 'async-multiselect',
      endpoint: '/api/service-opinions/',
      queryParam: 'name__icontains',
      extraParams: {
        is_final_opinion: false,
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
    {
      key: 'final_service_opinion__in',
      label: 'Parecer Final do Serviço',
      type: 'async-multiselect',
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
    <PageContainer title="Lista de Agendamentos" description="Listagem de Agendamentos">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Typography variant="h5" gutterBottom alignContent={'center'}>
              Lista de Agendamentos
            </Typography>
            <Box sx={{ p: 2 }}>
              <Link href="/apps/schedules/create" passHref>
                <Button variant="contained" color="primary">
                  Criar Agendamento
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid container alignItems="center" justifyContent={'space-between'} my={2}>
            <Grid item xs={10}>
              <FormControl fullWidth>
                <InputLabel id="services-select-label">Serviços</InputLabel>
                <Select
                  labelId="services-select-label"
                  id="services-select"
                  multiple
                  value={selectedServices}
                  onChange={(e) => {
                    setSelectedServices(e.target.value);
                    setPage(1);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const service = services.find((s) => s.id === value);
                        return <Chip key={value} label={service ? service.name : value} />;
                      })}
                    </Box>
                  )}
                  label="Serviços"
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
              <Table stickyHeader aria-label="schedule table" sx={{ textWrap: 'nowrap' }}>
                <TableHead>
                  <TableRow>
                    {selectedServices.length > 1 && <TableCell>Serviço</TableCell>}
                    <TableCell onClick={() => handleSort('schedule_date,schedule_start_time')}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>Data e Hora</span>
                        {order === 'schedule_date,schedule_start_time' &&
                          (orderDirection === 'asc' ? (
                            <ArrowDropUpIcon sx={{ ml: 0.5 }} />
                          ) : (
                            <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                          ))}
                      </Box>
                    </TableCell>
                    <TableCell>Contratante</TableCell>
                    <TableCell>Unidade</TableCell>
                    <TableCell>Agente</TableCell>
                    <TableCell>Endereço</TableCell>
                    <TableCell onClick={() => handleSort('status')}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>Status</span>
                        {order === 'status' &&
                          (orderDirection === 'asc' ? (
                            <ArrowDropUpIcon sx={{ ml: 0.5 }} />
                          ) : (
                            <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                          ))}
                      </Box>
                    </TableCell>
                    {hasPermission(['field_services.view_service_opinion']) && (
                      <TableCell onClick={() => handleSort('service_opinion')}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <span>Parecer</span>
                          {order === 'service_opinion' &&
                            (orderDirection === 'asc' ? (
                              <ArrowDropUpIcon sx={{ ml: 0.5 }} />
                            ) : (
                              <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                            ))}
                        </Box>
                      </TableCell>
                    )}
                    <TableCell>Parecer Final</TableCell>
                    <TableCell onClick={() => handleSort('created_at')}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>Criado em</span>
                        {order === 'created_at' &&
                          (orderDirection === 'asc' ? (
                            <ArrowDropUpIcon sx={{ ml: 0.5 }} />
                          ) : (
                            <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                          ))}
                      </Box>
                    </TableCell>
                    <TableCell>Observação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduleList.map((schedule) => (
                    <TableRow
                      key={schedule.id}
                      hover
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedScheduleId(schedule.id);
                        setDetailsDrawerOpen(true);
                      }}
                    >
                      {selectedServices.length > 1 && <TableCell>{schedule.service.name}</TableCell>}
                      <TableCell>
                        {`${formatDate(schedule.schedule_date)} - ${schedule.schedule_start_time}`}
                      </TableCell>
                      <TableCell>{schedule?.customer?.complete_name || "Sem cliente"}</TableCell>
                      <TableCell>{schedule?.branch?.name || "Sem unidade"}</TableCell>
                      <TableCell>
                        {schedule.schedule_agent
                          ? <UserCard userId={schedule.schedule_agent} showPhone showEmail={false} />
                          : <span>Sem agente</span>}
                      </TableCell>
                      <TableCell sx={{ textWrap: 'wrap' }}>
                        {schedule.address.complete_address}
                      </TableCell>
                      <TableCell>
                        <ScheduleStatusChip status={schedule.status} />
                      </TableCell>
                      {hasPermission(['field_services.view_service_opinion']) && (
                        <TableCell>
                          <ScheduleOpinionChip status={schedule.service_opinion?.name} />
                        </TableCell>
                      )}
                      <TableCell>
                        <ScheduleOpinionChip status={schedule.final_service_opinion?.name} />
                      </TableCell>
                      <TableCell>{new Date(schedule.created_at).toLocaleString('pt-BR')}</TableCell>
                      <TableCell sx={{ textWrap: 'wrap' }}>{schedule.observation}</TableCell>
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
        filters={scheduleFilterConfig}
        initialValues={filters}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />
      <DetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        scheduleId={selectedScheduleId}
      />
    </PageContainer>
  );
};

export default ScheduleTable;
