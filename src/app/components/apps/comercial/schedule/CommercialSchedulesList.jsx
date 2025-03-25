'use client';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import scheduleService from '@/services/scheduleService';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  FilterAlt
} from '@mui/material';
import { ArrowDropUp, ArrowDropDown, AddBoxRounded } from '@mui/icons-material';
import ScheduleStatusChip from '../../inspections/schedule/StatusChip';
import CreateSchedule from './CreateSchedule';
import TableSkeleton from '../sale/components/TableSkeleton';
import { CommercialScheduleDataContext } from '@/app/context/Inspection/CommercialScheduleContext';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';

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
    key: 'service__in',
    label: 'Serviço',
    type: 'async-multiselect',
    endpoint: '/api/services/',
    queryParam: 'name__icontains',
    extraParams: { limit: 10, fields: ['id', 'name'] },
    mapResponse: (data) =>
      data.results.map((service) => ({
        label: service.name,
        value: service.id,
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


const CommercialSchedulesList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('created_at');
  const [orderDirection, setOrderDirection] = useState('asc');
  const { filters, setFilters, refresh } = useContext(CommercialScheduleDataContext);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await scheduleService.getScheduleIspections({
          fields:
            'customer.complete_name,service.name,service_opinion.name,final_service_opinion.name,schedule_date,schedule_start_time,schedule_agent.complete_name,address,status,created_at,id,groups',
          expand: 'customer,service,schedule_agent,address',
          page: page + 1,
          limit: rowsPerPage,
        });
        console.log(response);
        setSchedules(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [page, rowsPerPage]);  


  // Função para formatar o endereço
  const formatAddress = (address) => {
    if (!address) return '-';
    const { street, neighborhood, city, state, country } = address;
    return (
      street +
      (neighborhood ? `, ${neighborhood}` : '') +
      (city ? `, ${city}` : '') +
      (state ? `, ${state}` : '') +
      (country ? ` - ${country}` : '')
    );
  };

  // Renderiza um badge para as opiniões
  const renderOpinionBadge = (
    opinion,
    labelSuccess = 'Com Parecer',
    labelDefault = 'Sem Parecer',
  ) => {
    if (opinion && opinion.name) {
      return <Chip label={labelSuccess} color="success" />;
    }
    return <Chip label={labelDefault} variant="outlined" />;
  };

  // Função para ordenar a lista localmente
  const handleSort = (field) => {
    const isAsc = order === field && orderDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setOrder(field);
    setOrderDirection(newDirection);

    const sorted = [...schedules].sort((a, b) => {
      let aField = a;
      let bField = b;
      field.split('.').forEach((f) => {
        aField = aField ? aField[f] : '';
        bField = bField ? bField[f] : '';
      });
      if (typeof aField === 'string') aField = aField.toLowerCase();
      if (typeof bField === 'string') bField = bField.toLowerCase();
      if (aField < bField) return newDirection === 'asc' ? -1 : 1;
      if (aField > bField) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setSchedules(sorted);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Funções para o modal de adicionar vistoria
  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  // Funções para o drawer de visualização da vistoria
  const handleRowClick = (schedule) => {
    setSelectedSchedule(schedule);
    setViewDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setViewDrawerOpen(false);
    setSelectedSchedule(null);
  };


  const formatDate = useCallback((dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }, []);

  const formatTime = useCallback((timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }, []);

  const formatDateTime = useCallback(
    (dateTimeString) => {
      const [date, time] = dateTimeString.split('T');
      return `${formatDate(date)} ${formatTime(time)}`;
    },
    [formatDate, formatTime],
  );

  return (
    <Box sx={{ padding: 3 }}>
      {/* Cabeçalho: título e botão para adicionar vistoria (modal) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Vistorias</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 1 }}
          startIcon={<AddBoxRounded />}
          onClick={handleAddModalOpen}
        >
          Adicionar Vistoria
        </Button>
        <Button
          variant="outlined"
          startIcon={<FilterAlt />}
          onClick={() => setFilterDrawerOpen(true)}
          sx={{ mt: 1, mb: 2 }}
        >
          Filtros
        </Button>
      </Box>
      <GenericFilterDrawer
        filters={scheduleFilterConfig}
        initialValues={filters}
        onApply={(newFilters) => setFilters(newFilters)}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />

      {loading && 
      <TableSkeleton rows={rowsPerPage} columns={12} />
      }
      {error && <Alert severity="error">Erro ao carregar os agendamentos.</Alert>}

      {!loading && !error && schedules?.meta?.pagination.total_count > 0 && (
        <>
          <TableContainer
            component={Paper}
            elevation={10}
            sx={{
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Table stickyHeader sx={{ minWidth: 1200 }} aria-label="commercial schedules table">
              <TableHead>
                <TableRow>
                  <TableCell
                    onClick={() => handleSort('created_at')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Criado Em
                      {order === 'created_at' &&
                        (orderDirection === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />)}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('customer.complete_name')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Cliente
                      {order === 'customer.complete_name' &&
                        (orderDirection === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />)}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('status')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Status
                      {order === 'status' &&
                        (orderDirection === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />)}
                    </Box>
                  </TableCell>
                  {/* <TableCell sx={{ fontWeight: 'bold' }}>Parecer do Serviço</TableCell> */}
                  <TableCell sx={{ fontWeight: 'bold' }}>Parecer Final do Serviço</TableCell>
                  <TableCell
                    onClick={() => handleSort('schedule_date')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Data
                      {order === 'schedule_date' &&
                        (orderDirection === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />)}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('schedule_start_time')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Hora
                      {order === 'schedule_start_time' &&
                        (orderDirection === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />)}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('service.name')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Serviço
                      {order === 'service.name' &&
                        (orderDirection === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />)}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort('schedule_agent.complete_name')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Agente
                      {order === 'schedule_agent.complete_name' &&
                        (orderDirection === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />)}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Endereço</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.results.map((schedule) => (
                  <TableRow
                    key={schedule.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRowClick(schedule)}
                  >
                    <TableCell>
                      {schedule.created_at ? formatDateTime(schedule.created_at) : '-'}
                    </TableCell>
                    <TableCell>
                      {schedule.customer && schedule.customer.complete_name
                        ? schedule.customer.complete_name
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <ScheduleStatusChip status={schedule.status} />
                    </TableCell>
                    <TableCell>{renderOpinionBadge(schedule.service_opinion)}</TableCell>
                    <TableCell>
                      {renderOpinionBadge(
                        schedule.final_service_opinion,
                        'Com Parecer',
                        'Em Análise',
                      )}
                    </TableCell>
                    <TableCell>
                      {schedule.schedule_date ? formatDate(schedule.schedule_date) : '-'}
                    </TableCell>
                    <TableCell>
                      {schedule.schedule_start_time
                        ? formatTime(schedule.schedule_start_time)
                        : '-'}
                    </TableCell>
                    {/* <TableCell>
                      {schedule.service && schedule.service.name ? schedule.service.name : '-'}
                    </TableCell> */}
                    <TableCell>
                      {schedule.schedule_agent ? (
                        schedule.schedule_agent.complete_name
                      ) : (
                        <Chip label="Sem Agente" color="warning" />
                      )}
                    </TableCell>
                    <TableCell>{formatAddress(schedule.address)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={schedules.meta.pagination.total_count}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página"
          />
        </>
      )}

      {!loading && schedules?.meta?.pagination.total_count === 0 && (
        <Typography>Nenhum agendamento encontrado.</Typography>
      )}

      <Dialog open={addModalOpen} onClose={handleAddModalClose} fullWidth maxWidth="md">
        <DialogTitle>Adicionar Vistoria</DialogTitle>
        <DialogContent>
          <CreateSchedule onClose={handleAddModalClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddModalClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Drawer para visualizar os detalhes da vistoria */}
      <Drawer anchor="right" open={viewDrawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 500, p: 2 }}>
          <Typography variant="h6">Detalhes da Vistoria</Typography>
          {/* Insira aqui o componente de visualização da vistoria */}
          {selectedSchedule ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Detalhes para a vistoria com ID: {selectedSchedule.id}
            </Typography>
          ) : (
            <Typography>Selecione uma vistoria</Typography>
          )}
          <Button onClick={handleDrawerClose} variant="outlined" sx={{ mt: 2 }}>
            Fechar
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CommercialSchedulesList;
