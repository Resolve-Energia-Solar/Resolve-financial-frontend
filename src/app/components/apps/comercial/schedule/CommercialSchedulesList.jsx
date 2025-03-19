'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
  Drawer
} from '@mui/material';
import { format } from 'date-fns';
import { ArrowDropUp, ArrowDropDown, AddBoxRounded } from '@mui/icons-material';
import ScheduleStatusChip from '../../inspections/schedule/StatusChip';
import CreateSchedule from './CreateSchedule';

const CommercialSchedulesList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para paginação e ordenação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('created_at'); // coluna padrão para ordenar
  const [orderDirection, setOrderDirection] = useState('asc');

  // Estados para modal e drawer
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await scheduleService.getScheduleIspections({
          fields:
            'customer.complete_name,service.name,service_opinion.name,final_service_opinion.name,schedule_date,schedule_start_time,schedule_agent.complete_name,address,status,created_at,id',
          expand: 'customer,service,schedule_agent,address',
        });
        setSchedules(response.results);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
  const renderOpinionBadge = (opinion, labelSuccess = 'Com Parecer', labelDefault = 'Sem Parecer') => {
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

  // Paginação: itens da página atual
  const paginatedSchedules = schedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

  // Funções para formatação de data e hora
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
    [formatDate, formatTime]
  );

  return (
    <Box sx={{ padding: 3 }}>
      {/* Cabeçalho: título e botão para adicionar vistoria (modal) */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Vistorias</Typography>
        <Button variant="outlined" sx={{ mt: 1 }} startIcon={<AddBoxRounded />} onClick={handleAddModalOpen}>
          Adicionar Vistoria
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">Erro ao carregar os agendamentos.</Alert>}

      {!loading && !error && schedules.length > 0 && (
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
                      {order === 'status' && (orderDirection === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />)}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Parecer do Serviço</TableCell>
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
                      Nome do Serviço
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
                {paginatedSchedules.map((schedule) => (
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
                      {renderOpinionBadge(schedule.final_service_opinion, 'Com Parecer', 'Em Análise')}
                    </TableCell>
                    <TableCell>
                      {schedule.schedule_date ? formatDate(schedule.schedule_date) : '-'}
                    </TableCell>
                    <TableCell>{schedule.schedule_start_time ? formatTime(schedule.schedule_start_time) : '-'}</TableCell>
                    <TableCell>
                      {schedule.service && schedule.service.name ? schedule.service.name : '-'}
                    </TableCell>
                    <TableCell>
                      {schedule.schedule_agent
                        ? schedule.schedule_agent.complete_name
                        : <Chip label="Sem Agente" color="warning" />}
                    </TableCell>
                    <TableCell>{formatAddress(schedule.address)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={schedules.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página"
          />
        </>
      )}

      {!loading && schedules.length === 0 && (
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
