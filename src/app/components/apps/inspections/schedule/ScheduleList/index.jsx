'use client';
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Paper,
  TablePagination,
  CircularProgress,
  Chip,
  DialogActions as DlgActions,
} from '@mui/material';
import {
  AddBoxRounded,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  FilterAlt,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import scheduleService from '@/services/scheduleService';
import ScheduleStatusChip from '../StatusChip';
import ScheduleView from '../ScheduleView';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';
import { ScheduleDataContext } from '@/app/context/Inspection/ScheduleContext';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';

// Configuração dos filtros para agendamentos
const scheduleFilterConfig = [
  {
    key: "schedule_date__range",
    label: "Data do Agendamento (Entre)",
    type: "range",
    inputType: "date",
  },
  {
    key: "status__in",
    label: "Status do Agendamento (Lista)",
    type: "multiselect",
    options: [
      { value: "Pendente", label: "Pendente" },
      { value: "Confirmado", label: "Confirmado" },
      { value: "Cancelado", label: "Cancelado" },
    ],
  },
  {
    key: "final_service_is_null",
    label: "Parecer Final do Serviço Pendente",
    type: "select",
    options: [
      { value: 'null', label: "Todos" },
      { value: true, label: "Pendente" },
      { value: 'false', label: "Concluído" },
    ],
  },
  {
    key: "service_opnion_is_null",
    label: "Parecer do Serviço Pendente",
    type: "select",
    options: [
      { value: 'null', label: "Todos" },
      { value: true, label: "Pendente" },
      { value: 'false', label: "Concluído" },
    ],
  },
  {
    key: "schedule_agent__in",
    label: "Agente de Campo",
    type: "async-multiselect",
    endpoint: "/api/users/",
    queryParam: "complete_name__icontains",
    extraParams: {},
    mapResponse: (data) =>
      data.results.map((user) => ({
        label: user.complete_name,
        value: user.id,
      })),
  },
  {
    key: "service__in",
    label: "Serviço",
    type: "async-multiselect",
    endpoint: "/api/services/",
    queryParam: "name__icontains",
    extraParams: { limit: 10 },
    mapResponse: (data) =>
      data.results.map((service) => ({
        label: service.name,
        value: service.id,
      })),
  },
  {
    key: "customer",
    label: "Cliente",
    type: "async-autocomplete",
    endpoint: "/api/users/",
    queryParam: "complete_name__icontains",
    extraParams: {},
    mapResponse: (data) =>
      data.results.map((customer) => ({
        label: customer.complete_name,
        value: customer.id,
      })),
  },
  {
    key: "branch__in",
    label: "Unidade",
    type: "async-multiselect",
    endpoint: "/api/branches/",
    queryParam: "name__icontains",
    extraParams: {},
    mapResponse: (data) =>
      data.results.map((branch) => ({
        label: branch.name,
        value: branch.id,
      })),
  },
  {
    key: "service_opinion__in",
    label: "Parecer do Serviço",
    type: "async-multiselect",
    endpoint: "/api/service-opinions/",
    queryParam: "name__icontains",
    extraParams: { is_final_opinion: false },
    mapResponse: (data) =>
      data.results.map((opinion) => ({
        label: `${opinion.name} - ${opinion.service?.name}`,
        value: opinion.id,
      })),
  },
  {
    key: "final_service_opinion__in",
    label: "Parecer Final do Serviço",
    type: "async-multiselect",
    endpoint: "/api/service-opinions/",
    queryParam: "name__icontains",
    extraParams: { is_final_opinion: true },
    mapResponse: (data) =>
      data.results.map((opinion) => ({
        label: `${opinion.name} - ${opinion.service?.name}`,
        value: opinion.id,
      })),
  },
];

// Hook para debouncing de valores
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const SchedulingList = () => {
  const router = useRouter();
  const userPermissions = useSelector((state) => state.user.permissions);
  const hasPermission = useCallback(
    (permissions) => {
      if (!permissions) return true;
      return permissions.some((permission) => userPermissions?.includes(permission));
    },
    [userPermissions]
  );

  // Obtém filtros e refresh do contexto de agendamentos
  const { filters, setFilters, refresh } = useContext(ScheduleDataContext);
  const debouncedFilters = useDebounce(filters, 500);

  const [scheduleList, setScheduleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('asc');
  const [orderDirection, setOrderDirection] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Cache para resultados já obtidos
  const cacheRef = useRef({});

  // Reinicializa a página e a lista sempre que filtros, ordenação ou refresh mudarem
  useEffect(() => {
    setPage(1);
    setScheduleList([]);
  }, [order, orderDirection, debouncedFilters, refresh]);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
      const queryParams = {
        ordering: orderingParam,
        nextPage: page,
        limit: rowsPerPage,
        fields: 'id,customer,service,service_opinion,final_service_opinion,schedule_date,schedule_start_time,schedule_agent,address,observation,status,created_at',
        page: page + 1,
        ...debouncedFilters,
      };
      const cacheKey = JSON.stringify(queryParams);

      if (cacheRef.current[cacheKey]) {
        const data = cacheRef.current[cacheKey];
        setScheduleList(data.results);
        setTotalRows(data.count);
        setLoading(false);
      } else {
        try {
          const data = await scheduleService.getSchedules(queryParams);
          setScheduleList(data.results);
          setTotalRows(data.count);
          cacheRef.current[cacheKey] = data;
        } catch (err) {
          setError('Erro ao carregar agendamentos');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSchedules();
  }, [page, rowsPerPage, order, orderDirection, debouncedFilters, refresh]);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleCreateClick = useCallback(() => {
    router.push('/apps/inspections/schedule/create');
  }, [router]);

  const handleEditClick = useCallback((id) => {
    router.push(`/apps/inspections/schedule/${id}/update`);
  }, [router]);

  const handleRowClick = useCallback((schedule) => {
    setSelectedSchedule(schedule);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setSelectedSchedule(null);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setScheduleToDelete(id);
    setIsDialogOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsDialogOpen(false);
    setScheduleToDelete(null);
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await scheduleService.deleteSchedule(scheduleToDelete);
      setScheduleList((prev) => prev.filter((item) => item.id !== scheduleToDelete));
    } catch (err) {
      setError('Erro ao excluir agendamento');
    } finally {
      handleCloseModal();
    }
  };

  const handleSort = useCallback(
    (field) => {
      if (order === field) {
        setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setOrder(field);
        setOrderDirection('asc');
      }
    },
    [order, orderDirection]
  );

  const formatDate = useCallback((dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }, []);

  const formatTime = useCallback((timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Lista de Agendamentos
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          onClick={handleCreateClick}
          sx={{ mt: 1, mb: 2 }}
        >
          Adicionar Agendamento
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
      {loading ? (
        <Typography>Carregando...</Typography>
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
          <Table stickyHeader aria-label="schedule table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('created_at')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Criado Em
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'created_at' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>

                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Contratante
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'customer.complete_name' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('status')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Status Agendamento
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'status' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                {hasPermission(['field_services.view_service_opinion']) && (
                  <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('service_opinion')}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Parecer do Serviço
                      <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                        {order === 'service_opinion' &&
                          (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                      </Box>
                    </Box>
                  </TableCell>
                )}
                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('final_service_opinion')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Parecer Final do Serviço
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'final_service_opinion' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('schedule_date')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Data
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'schedule_date' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('schedule_start_time')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Hora
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'schedule_start_time' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('service.name')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Serviço
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'service.name' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                {hasPermission(['field_services.view_agent_info']) && (
                  <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('schedule_agent.complete_name')}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Agente
                      <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                        {order === 'schedule_agent.complete_name' &&
                          (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                      </Box>
                    </Box>
                  </TableCell>
                )}
                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('address.street')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Endereço
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'address.street' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => handleSort('observation')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Descrição
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'observation' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <TableSkeleton rows={rowsPerPage} columns={11} />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TableBody>
                {scheduleList.map((schedule) => (
                  <TableRow key={schedule.id} hover onClick={() => handleRowClick(schedule)}>
                    <TableCell>
                      {format(new Date(schedule.created_at), 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>{schedule?.customer?.complete_name}</TableCell>
                    <TableCell>
                      <ScheduleStatusChip status={schedule.status} />
                    </TableCell>
                    {hasPermission(['field_services.view_service_opinion']) && (
                      <TableCell>
                        {schedule.service_opinion ? schedule.service_opinion.name : <Chip label="Sem Parecer" color="error" />}
                      </TableCell>
                    )}
                    <TableCell>
                      {schedule.final_service_opinion ? schedule.final_service_opinion.name : <Chip label="Em Análise" color="warning" />}
                    </TableCell>
                    <TableCell>{formatDate(schedule.schedule_date)}</TableCell>
                    <TableCell>{formatTime(schedule.schedule_start_time)}</TableCell>
                    <TableCell>{schedule.service.name}</TableCell>
                    {hasPermission(['field_services.view_agent_info']) && (
                      <TableCell>
                        {schedule.schedule_agent ? schedule.schedule_agent.complete_name : <Chip label="Sem Agente" color="error" />}
                      </TableCell>
                    )}
                    <TableCell>
                      {`${schedule.address.street}, ${schedule.address.number}, ${schedule.address.neighborhood}, ${schedule.address.city} - ${schedule.address.state}`}
                    </TableCell>
                    <TableCell>
                      {schedule.observation
                        ? schedule.observation.length > 50
                          ? `${schedule.observation.substring(0, 50)}...`
                          : schedule.observation
                        : <Chip label="Sem Observação" color="warning" />}
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
            )}
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
      <Dialog open={isDialogOpen} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este agendamento? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleCloseModal}>Cancelar</Button>
          <Button color="error" onClick={handleConfirmDelete}>Excluir</Button>
        </DialogActions>
      </Dialog>
      <ScheduleView open={drawerOpen} onClose={handleDrawerClose} selectedSchedule={selectedSchedule} />
    </Box>
  );
};

export default SchedulingList;
