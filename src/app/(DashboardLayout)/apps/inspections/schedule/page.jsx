'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* material */
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
} from '@mui/material';
import { AddBoxRounded, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

/* components */
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';

/* services */
import scheduleService from '@/services/scheduleService';

const SchedulingList = () => {
  const [scheduleList, setScheduleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');

  const router = useRouter();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await scheduleService.getSchedules();
        setScheduleList(data.results);
      } catch (err) {
        setError('Erro ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleCreateClick = () => {
    router.push('/apps/inspections/schedule/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/schedule/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setScheduleToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setScheduleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await scheduleService.deleteSchedule(scheduleToDelete);
      setScheduleList(scheduleList.filter((item) => item.id !== scheduleToDelete));
    } catch (err) {
      setError('Erro ao excluir agendamento');
    } finally {
      handleCloseModal();
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => {
          if (orderBy === 'service') {
            return b.service.name < a.service.name ? -1 : 1;
          }
          if (orderBy === 'schedule_agent') {
            return b.schedule_agent.complete_name < a.schedule_agent.complete_name ? -1 : 1;
          }
          return b[orderBy] < a[orderBy] ? -1 : 1;
        }
      : (a, b) => {
          if (orderBy === 'service') {
            return a.service.name < b.service.name ? -1 : 1;
          }
          if (orderBy === 'schedule_agent') {
            return a.schedule_agent.complete_name < b.schedule_agent.complete_name ? -1 : 1;
          }
          return a[orderBy] < b[orderBy] ? -1 : 1;
        };
  };

  const sortedScheduleList = scheduleList.sort(getComparator(order, orderBy));

  return (
    <PageContainer title={'Agendamentos'} description={'Lista de agendamentos'}>
      <BlankCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Agendamentos
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddBoxRounded />}
            sx={{ marginTop: 1, marginBottom: 2 }}
            onClick={handleCreateClick}
          >
            Adicionar Agendamento
          </Button>
          {loading ? (
            <Typography>Carregando...</Typography>
          ) : error ? (
            <Typography color={'error'}>{error}</Typography>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table aria-label="table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'id'}
                        direction={orderBy === 'id' ? order : 'asc'}
                        onClick={() => handleRequestSort('id')}
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'schedule_date'}
                        direction={orderBy === 'schedule_date' ? order : 'asc'}
                        onClick={() => handleRequestSort('schedule_date')}
                      >
                        Data
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'schedule_start_time'}
                        direction={orderBy === 'schedule_start_time' ? order : 'asc'}
                        onClick={() => handleRequestSort('schedule_start_time')}
                      >
                        Hora
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'project'}
                        direction={orderBy === 'project' ? order : 'asc'}
                        onClick={() => handleRequestSort('project')}
                      >
                        Projeto
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'service'}
                        direction={orderBy === 'service' ? order : 'asc'}
                        onClick={() => handleRequestSort('service')}
                      >
                        Serviço
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'schedule_agent'}
                        direction={orderBy === 'schedule_agent' ? order : 'asc'}
                        onClick={() => handleRequestSort('schedule_agent')}
                      >
                        Responsável Técnico
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'status'}
                        direction={orderBy === 'status' ? order : 'asc'}
                        onClick={() => handleRequestSort('status')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedScheduleList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{formatDate(item.schedule_date)}</TableCell>
                        <TableCell>{formatTime(item.schedule_start_time)}</TableCell>
                        <TableCell>{item.project}</TableCell>
                        <TableCell>{item.service.name}</TableCell>
                        <TableCell>{item.schedule_agent.complete_name}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>
                          <Tooltip title="Editar">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditClick(item.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteClick(item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={scheduleList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </CardContent>
      </BlankCard>

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={open}
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
    </PageContainer>
  );
};

export default SchedulingList;
