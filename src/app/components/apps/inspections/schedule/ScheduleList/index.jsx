'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import theme from '@/utils/theme';

// Components
import {
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
  TableSortLabel,
  TextField,
  Grid,
  Box,
  Menu,
  MenuItem,
  CircularProgress,
  Drawer,
  Chip,
} from '@mui/material';
import {
  AddBoxRounded,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Map as Mapsicon,
  MoreVert as MoreVertIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@mui/icons-material';

// Services and utils
import scheduleService from '@/services/scheduleService';

import ScheduleStatusChip from '../StatusChip';
import ScheduleDrawerFilters from '../ScheduleDrawerFilters';
import ScheduleView from '../ScheduleView';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';
import { ScheduleDataContext } from '@/app/context/Inspection/ScheduleContext';

const SchedulingList = () => {
  const router = useRouter();

  const [scheduleList, setScheduleList] = useState([]);

  console.log('scheduleList:', scheduleList);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const { filters, refresh } = useContext(ScheduleDataContext);
  const [order, setOrder] = useState('asc');
  const [orderDirection, setOrderDirection] = useState('asc');

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [totalRows, setTotalRows] = useState(0);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    setPage(1);
    setScheduleList([]);
  }, [order, orderDirection, filters, refresh]);

  console.log('filters:', filters);

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
        setError('Erro ao carregar agendamentos', err);
        showAlert('Erro ao carregar Categorias', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [page, rowsPerPage, order, orderDirection, filters, refresh]);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleCreateClick = () => {
    router.push('/apps/inspections/schedule/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/schedule/${id}/update`);
  };

  const handleViewClick = (id) => {
    router.push(`/apps/inspections/schedule/${id}/maps`);
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

  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await scheduleService.deleteSchedule(scheduleToDelete);
      setScheduleList(scheduleList.filter((item) => item.id !== scheduleToDelete));
      showAlert('Agendamento excluída com sucesso', 'success');
    } catch (err) {
      setError('Erro ao excluir agendamento');
      showAlert('Erro ao excluir Agendamento', 'error');
      console.error('Erro ao excluir Agendamento:', err);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          sx={{ marginTop: 1, marginBottom: 2 }}
          onClick={handleCreateClick}
        >
          Adicionar Agendamento
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ScheduleDrawerFilters />
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        elevation={10}
        sx={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '&-ms-overflow-style:': {
            display: 'none',
          },
        }}
      >
        <Table stickyHeader aria-label="schedule table">
          <TableHead>
            <TableRow>
              {/* Contratante */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('customer.complete_name')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Contratante
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'customer.complete_name' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>
              {/* Status */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('status')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Status Agendamento
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'status' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('service_opinion')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Parecer do Serviço
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'service_opinion' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('final_service_opinion')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Parecer Final do Serviço
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'final_service_opinion' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Data do Agendamento */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('schedule_date')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Data
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'schedule_date' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Hora do Agendamento */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('schedule_start_time')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Hora
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'schedule_start_time' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Serviço */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('service.name')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Serviço
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'service.name' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Agente */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('schedule_agent.complete_name')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Agente
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'schedule_agent.complete_name' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton 
              rows={rowsPerPage}
              columns={8} />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {scheduleList.map((schedule) => (
                <TableRow key={schedule.id} hover>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule?.customer?.complete_name}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    <ScheduleStatusChip status={schedule.status} />
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule.service_opinion ? (
                      schedule.service_opinion.name
                    ) : (
                      <Chip label="Sem Parecer" color="error" />
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule.final_service_opinion ? (
                      schedule.final_service_opinion.name
                    ) : (
                      <Chip label="Em Análise" color="warning" />
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {formatDate(schedule.schedule_date)}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {formatTime(schedule.schedule_start_time)}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule.service.name}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule.schedule_agent ? (
                      schedule.schedule_agent.complete_name
                    ) : (
                      <Chip label="Sem Agente" color="error" />
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
          )}
        </Table>
      </TableContainer>

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
      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={isDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleCloseModal}
      >
        <DialogTitle id="alert-dialog-title">Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza de que deseja excluir este agendamento? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Componente Drawer para exibir detalhes do agendamento */}
      <ScheduleView
        open={drawerOpen}
        onClose={handleDrawerClose}
        selectedSchedule={selectedSchedule}
      />
    </Box>
  );
};

export default SchedulingList;
