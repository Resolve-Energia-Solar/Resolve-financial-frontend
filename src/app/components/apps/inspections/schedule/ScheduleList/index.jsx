'use client';
import React, { useState, useEffect, useContext } from 'react';
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
  Tooltip,
  IconButton,
  Paper,
  TablePagination,
  CircularProgress,
  Drawer,
  TextField,
  MenuItem,
  Chip
} from '@mui/material';
import {
  AddBoxRounded,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterAlt,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

// Serviços e contextos
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
    key: "schedule_agent",
    label: "Agente de Campo",
    type: "async-autocomplete",
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
    key: "service",
    label: "Serviço",
    type: "async-autocomplete",
    endpoint: "/api/services/",
    queryParam: "name__icontains",
    extraParams: {},
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
    key: "service_opinion",
    label: "Parecer do Serviço",
    type: "async-autocomplete",
    endpoint: "/api/service-opinions/",
    queryParam: "name__icontains",
    extraParams: {},
    mapResponse: (data) =>
      data.results.map((opinion) => ({
        label: opinion.name,
        value: opinion.id,
      })),
  },
  {
    key: "final_service_opinion",
    label: "Parecer Final do Serviço",
    type: "async-autocomplete",
    endpoint: "/api/service-opinions/",
    queryParam: "name__icontains",
    extraParams: {},
    mapResponse: (data) =>
      data.results.map((opinion) => ({
        label: opinion.name,
        value: opinion.id,
      })),
  },
];

const SchedulingList = () => {
  const router = useRouter();
  const userPermissions = useSelector((state) => state.user.permissions);
  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some(permission => userPermissions?.includes(permission));
  };

  // Obtém filtros e refresh do contexto de agendamentos
  const { filters, setFilters, refresh } = useContext(ScheduleDataContext);

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

  // Sempre que os filtros, order ou refresh mudarem, reinicializa página e lista
  useEffect(() => {
    setPage(1);
    setScheduleList([]);
  }, [order, orderDirection, filters, refresh]);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
      try {
        const data = await scheduleService.getSchedules({
          ordering: orderingParam,
          nextPage: page,
          limit: rowsPerPage,
          page: page + 1,
          ...filters,
        });
        setScheduleList(data.results);
        setTotalRows(data.count);
      } catch (err) {
        setError('Erro ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [page, rowsPerPage, order, orderDirection, filters, refresh]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCreateClick = () => {
    router.push('/apps/inspections/schedule/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/schedule/${id}/update`);
  };

  const handleRowClick = (schedule) => {
    setSelectedSchedule(schedule);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedSchedule(null);
  };

  const handleDeleteClick = (id) => {
    setScheduleToDelete(id);
    setIsDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsDialogOpen(false);
    setScheduleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await scheduleService.deleteSchedule(scheduleToDelete);
      setScheduleList(scheduleList.filter((item) => item.id !== scheduleToDelete));
      // Exiba alertas conforme sua implementação
    } catch (err) {
      setError('Erro ao excluir agendamento');
    } finally {
      handleCloseModal();
    }
  };

  const handleSort = (field) => {
    if (order === field) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrder(field);
      setOrderDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

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
      {/* Integração direta do GenericFilterDrawer */}
      <GenericFilterDrawer
        filters={scheduleFilterConfig}
        initialValues={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
        }}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />
      {loading ? (
        <Typography>Carregando...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} elevation={10}>
          <Table stickyHeader aria-label="schedule table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Criado Em
                    <Box sx={{ ml: 1 }}>
                      {order === 'created_at' && (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('customer.complete_name')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Contratante
                    <Box sx={{ ml: 1 }}>
                      {order === 'customer.complete_name' && (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Status Agendamento
                    <Box sx={{ ml: 1 }}>
                      {order === 'status' && (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>
                {/* Outras colunas conforme necessário */}
              </TableRow>
            </TableHead>
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
                  {/* Renderize as demais colunas conforme sua necessidade */}
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
      <ScheduleView
        open={drawerOpen}
        onClose={handleDrawerClose}
        selectedSchedule={selectedSchedule}
      />
    </Box>
  );
};

export default SchedulingList;
