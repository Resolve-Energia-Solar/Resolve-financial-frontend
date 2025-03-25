'use client';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  Snackbar,
  Stack,
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import AddBoxRounded from '@mui/icons-material/AddBoxRounded';
import FilterAlt from '@mui/icons-material/FilterAlt';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import HelpIcon from '@mui/icons-material/Help';
import ScheduleStatusChip from '../../inspections/schedule/StatusChip';
import CreateCommercialSchedule from './CreateCommercialSchedule';
import TableSkeleton from '../sale/components/TableSkeleton';
import { CommercialScheduleDataContext } from '@/app/context/Inspection/CommercialScheduleContext';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import { format } from 'date-fns';
import scheduleService from '@/services/scheduleService';
import CommercialScheduleDetail from './CommercialScheduleDetail';

const scheduleFilterConfig = [
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
];

const CommercialSchedulesList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Ordenação via backend, não há lógica de ordenação no front
  const { filters, setFilters } = useContext(CommercialScheduleDataContext);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getScheduleIspections({
        fields:
          'customer.complete_name,service.name,service_opinion.name,final_service_opinion.name,schedule_date,schedule_start_time,schedule_agent.complete_name,address,status,created_at,id,groups',
        expand: 'customer,service,schedule_agent,address',
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
      });
      console.log("Dados buscados:", response);
      setSchedules(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => setAddModalOpen(false);
  const handleRowClick = (schedule) => {
    setSelectedSchedule(schedule);
    setViewDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setViewDrawerOpen(false);
    setSelectedSchedule(null);
  };

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

  const renderOpinionBadge = (opinion, labelSuccess = 'Com Parecer', labelDefault = 'Sem Parecer') => {
    if (opinion && opinion.name) {
      return <Chip label={labelSuccess} color="success" />;
    }
    return <Chip label={labelDefault} variant="outlined" />;
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
      <Typography variant="h6">Agendamentos</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button variant="outlined" sx={{ mt: 1 }} startIcon={<AddBoxRounded />} onClick={handleAddModalOpen}>
          Adicionar Agendamento
        </Button>
        <Button variant="outlined" startIcon={<FilterAlt />} onClick={() => setFilterDrawerOpen(true)} sx={{ mt: 1, mb: 2 }}>
          Filtros
        </Button>
      </Box>
      <GenericFilterDrawer
        filters={scheduleFilterConfig}
        initialValues={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setPage(0);
        }}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />
      {loading && <TableSkeleton rows={rowsPerPage} columns={12} />}
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Criado Em</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Parecer Final do Serviço</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hora</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Agente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Endereço</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.results.map((schedule) => (
                  <TableRow key={schedule.id} hover sx={{ cursor: 'pointer' }} onClick={() => handleRowClick(schedule)}>
                    <TableCell>{schedule.created_at ? formatDateTime(schedule.created_at) : '-'}</TableCell>
                    <TableCell>{schedule.customer && schedule.customer.complete_name ? schedule.customer.complete_name : '-'}</TableCell>
                    <TableCell><ScheduleStatusChip status={schedule.status} /></TableCell>
                    <TableCell>{renderOpinionBadge(schedule.final_service_opinion, 'Com Parecer', 'Em Análise')}</TableCell>
                    <TableCell>{schedule.schedule_date ? formatDate(schedule.schedule_date) : '-'}</TableCell>
                    <TableCell>{schedule.schedule_start_time ? formatTime(schedule.schedule_start_time) : '-'}</TableCell>
                    <TableCell>{schedule.schedule_agent ? schedule.schedule_agent.complete_name : <Chip label="Sem Agente" color="warning" />}</TableCell>
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
        <DialogTitle>Adicionar Agendamento</DialogTitle>
        <DialogContent>
          <CreateCommercialSchedule onClose={handleAddModalClose} onRefresh={fetchData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddModalClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
      <Drawer anchor="right" open={viewDrawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 500, p: 2 }}>
          <Typography variant="h6">Detalhes do Agendamento</Typography>
          {selectedSchedule ? (
            <Typography variant="body2" sx={{ mt: 1 }}>
                <CommercialScheduleDetail schedule={selectedSchedule} />
            </Typography>
          ) : (
            <Typography>Selecione um Agendamento</Typography>
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
