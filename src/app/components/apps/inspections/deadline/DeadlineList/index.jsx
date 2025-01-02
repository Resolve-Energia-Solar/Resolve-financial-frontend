'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { formatTime } from '@/utils/inspectionFormatDate';

/* material */
import {
  Box,
  Button,
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
  Snackbar,
  Alert,
} from '@mui/material';
import {
  AddBoxRounded,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@mui/icons-material';

/* components */
import {
  DeadlineDataContext,
  DeadlineDataContextProvider,
} from '@/app/context/Inspection/DeadlineContext';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';

/* services */
import deadlineService from '@/services/deadlineService';
import DeadlineDrawerFilters from '../DeadlineDrawerFilters';

const DeadlineList = () => {
  const router = useRouter();

  const [deadlineList, setDeadlineList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { filters, refresh } = useContext(DeadlineDataContext);
  const [order, setOrder] = useState('asc');
  const [orderDirection, setOrderDirection] = useState('asc');

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [deadlineToDelete, setDeadlineToDelete] = useState(null);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setDeadlineList([]);
  }, [order, orderDirection, filters, refresh]);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  useEffect(() => {
    const fetchDeadlines = async () => {
      setLoading(true);
      setError(null);
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
      try {
        const queryParams = new URLSearchParams(filters[1]).toString();
        const data = await deadlineService.getDeadlines({
          ordering: orderingParam,
          params: queryParams,
          nextPage: page,
        });
        if (page === 1) {
          setDeadlineList(data.results);
        } else {
          setDeadlineList((prevDeadlineList) => {
            const newItems = data.results.filter(
              (item) => !prevDeadlineList.some((existingItem) => existingItem.id === item.id),
            );
            return [...prevDeadlineList, ...newItems];
          });
        }
        if (data.next) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError('Erro ao carregar prazos');
        showAlert('Erro ao carregar prazos', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, [page, order, orderDirection, filters, refresh]);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleCreateClick = () => {
    router.push('/apps/inspections/deadline/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/deadline/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setDeadlineToDelete(id);
    setIsDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsDialogOpen(false);
    setDeadlineToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deadlineService.deleteDeadline(deadlineToDelete);
      setDeadlineList(deadlineList.filter((deadline) => deadline.id !== deadlineToDelete));
      showAlert('Prazo deletado com sucesso', 'success');
    } catch (err) {
      setError('Erro ao deletar prazo');
      showAlert('Erro ao deletar prazo', 'error');
      console.error('Erro ao deletar prazo:', err);
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

  return (
    <Box>
      <Typography variant={'h6'} gutterBottom>
        Lista de Prazos
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant={'outlined'}
          startIcon={<AddBoxRounded />}
          sx={{ marginTop: 1, marginBottom: 2 }}
          onClick={handleCreateClick}
        >
          Adicionar Prazo
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DeadlineDrawerFilters />
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={10}
        sx={{ overflowX: 'auto', maxHeight: '50vh' }}
        onScroll={handleScroll}
      >
        <Table stickyHeader aria-label="deadline table">
          <TableHead>
            <TableRow>
              {/* ID */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('id')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  ID
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'id' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Name */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('name')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Nome
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'name' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Hours */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('hours')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Horas
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'hours' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Observation */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('observation')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Observação
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'observation' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Actions */}
              <TableCell align="right" sx={{ paddingRight: 3 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          {loading && page === 1 ? (
            <TableSkeleton rows={5} columns={5} />
          ) : error && page === 1 ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {deadlineList.map((deadline) => (
                <TableRow key={deadline.id} hover>
                  <TableCell>{deadline.id}</TableCell>
                  <TableCell>{deadline.name}</TableCell>
                  <TableCell>{formatTime(deadline.hours)}</TableCell>
                  <TableCell>{deadline.observation}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={'Editar'}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(deadline.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={'Excluir'}>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(deadline.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {loading && page > 1 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
              {!hasMore && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
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
            Tem certeza de que deseja excluir este prazo? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="primary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DeadlineList;
