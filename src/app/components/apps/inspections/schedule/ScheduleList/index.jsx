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
} from '@mui/material';
import {
  AddBoxRounded,
  Delete as DeleteIcon,
  Edit as EditIcon,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { filters, refresh } = useContext(ScheduleDataContext);
  const [order, setOrder] = useState('asc');
  const [orderDirection, setOrderDirection] = useState('asc');

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setScheduleList([]);
  }, [order, orderDirection, filters, refresh]);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
      try {
        const queryParams = new URLSearchParams(filters[1]).toString();
        console.log('queryParams:', queryParams);
        console.log('page:', page);
        const data = await scheduleService.getSchedules({
          ordering: orderingParam,
          params: queryParams,
          nextPage: page,
        });
        if (page === 1) {
          setScheduleList(data.results);
        } else {
          setScheduleList((prevScheduleList) => {
            const newItems = data.results.filter(
              (item) => !prevScheduleList.some((existingItem) => existingItem.id === item.id),
            );
            return [...prevScheduleList, ...newItems];
          });
        }
        if (data.next) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError('Erro ao carregar agendamentos', err);
        showAlert('Erro ao carregar Categorias', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (page === 1 || hasMore) {
      fetchSchedules();
    }
  }, [page, order, orderDirection, filters, refresh]);

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

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
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
    <Box > 
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
          maxHeight: '50vh',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '&-ms-overflow-style:': {
            display: 'none',
          },
        }}
        onScroll={handleScroll}
      >
        <Table stickyHeader aria-label="schedule table">
          <TableHead>
            <TableRow>
              {/* Status */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('status')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Status
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'status' &&
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

              {/* Endereço */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('address.street')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Endereço
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'address.street' &&
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

              {/* Vendedor */}
              <TableCell>Vendedor</TableCell>

              {/* Unidade */}
              <TableCell>Unidade</TableCell>

              {/* Actions */}
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          {loading && page === 1 ? (
            <TableSkeleton rows={5} columns={10} />
          ) : error && page === 1 ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {scheduleList.map((schedule) => (
                <TableRow key={schedule.id} hover>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    <ScheduleStatusChip status={schedule.status} />
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {formatDate(schedule.schedule_date)}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {formatTime(schedule.schedule_start_time)}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule?.customer?.complete_name}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {`${schedule.address.street}, ${schedule.address.number}, ${schedule.address.neighborhood}, ${schedule.address.city} - ${schedule.address.state}`}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule.service.name}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule.schedule_agent ? (
                      schedule.schedule_agent.complete_name
                    ) : (
                      <Box
                        sx={{
                          backgroundColor: 'error.light',
                          color: 'error.main',
                          padding: 1,
                          textAlign: 'center',
                        }}
                      >
                        Sem agente associado
                      </Box>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule.project.id ? (
                      schedule.project.sale.seller.complete_name
                    ) : (
                      <Box
                        sx={{
                          backgroundColor: 'error.light',
                          color: 'error.main',
                          padding: 1,
                          textAlign: 'center',
                        }}
                      >
                        Sem projeto associado
                      </Box>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(schedule)}>
                    {schedule.project.id ? (
                      schedule.project.sale.branch.name
                    ) : (
                      <Box
                        sx={{
                          backgroundColor: 'error.light',
                          color: 'error.main',
                          padding: 1,
                          textAlign: 'center',
                        }}
                      >
                        Sem projeto associado
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Ações">
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuClick(event, schedule.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={menuAnchorEl}
                      open={menuOpenRowId === schedule.id}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleEditClick(schedule.id);
                          handleMenuClose();
                        }}
                      >
                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                        Editar
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDeleteClick(schedule.id);
                          handleMenuClose();
                        }}
                      >
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Excluir
                      </MenuItem>
                    </Menu>
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
              {!hasMore && (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="body2">Você viu tudo!</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>
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
