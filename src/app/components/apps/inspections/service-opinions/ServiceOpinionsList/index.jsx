'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Components
import {
  Button,
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
  Box,
  CircularProgress,
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

// Services and utils
import serviceOpinionsService from '@/services/serviceOpinionsService';
import { ServiceOpinionsContext } from '@/app/context/Inspection/ServiceOpinionsContext';
//import ServiceOpinionsDrawerFilters from '../ServiceOpinionsDrawerFilters'; // Altere para o novo componente
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';
import { forEach } from 'lodash';
const ServiceOpinionsList = () => {
  const router = useRouter();

  const [opinionsList, setOpinionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { filters, refresh } = useContext(ServiceOpinionsContext);
  const [order, setOrder] = useState('asc');
  const [orderDirection, setOrderDirection] = useState('asc');

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [opinionsToDelete, setOpinionsToDelete] = useState(null);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleCreateClick = () => {
    router.push('/apps/inspections/service-opinions/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/service-opinions/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setOpinionsToDelete(id);
    setIsDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsDialogOpen(false);
    setOpinionsToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await serviceOpinionsService.deleteServiceOpinions(opinionsToDelete);
      setOpinionsList(opinionsList.filter((item) => item.id !== opinionsToDelete));
      showAlert('Parecer excluído com sucesso', 'success');
    } catch (err) {
      setError(`Erro ao excluir o parecer`);
      showAlert('Erro ao excluir Parecer', 'error');
      console.error('Erro ao excluir Parecer:', err);
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

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setOpinionsList([]);
  }, [order, orderDirection, filters, refresh]);

  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        setLoading(true);
        setError(null);

        const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
        const queryParams = new URLSearchParams(filters[1]).toString();

        const data = await serviceOpinionsService.getServiceOpinions({
          ordering: orderingParam,
          params: queryParams,
          nextPage: page,
        });

        if (page === 1) {
          setOpinionsList(data.results);
        } else {
          const newItems = data.results.filter(
            (item) => !opinionsList.some((existingItem) => existingItem.id === item.id),
          );
          setOpinionsList((prevOpinionsList) => [...prevOpinionsList, ...newItems]);
        }
        setHasMore(!!data.next);
      } catch (error) {
        setError('Erro ao carregar Pareceres: ' + error.message);
        showAlert('Erro ao carregar Pareceres', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOpinions();
  }, [page, order, orderDirection, filters, refresh]);

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          Lista de Pareceres
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<AddBoxRounded />}
            sx={{ marginTop: 1, marginBottom: 2 }}
            onClick={handleCreateClick}
          >
            Adicionar Parecer
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/*<ServiceOpinionsDrawerFilters />  Altere para o novo componente */}
          </Box>
        </Box>
        <TableContainer
          component={Paper}
          elevation={10}
          sx={{ overflowX: 'auto', maxHeight: '50vh' }}
          onScroll={handleScroll}
        >
          <Table stickyHeader aria-label="service opinions table">
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
                    Nome/Descrição
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'name' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>

                {/* Service */}
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

                {/* Ações */}
                <TableCell align="right" sx={{ paddingRight: 3 }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>

            {loading && page === 1 ? (
              <TableSkeleton rows={5} columns={4} />
            ) : error && page === 1 ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TableBody>
                {opinionsList.map((opinion) => (
                  <TableRow key={opinion.id} hover>
                    <TableCell>{opinion.id}</TableCell>
                    <TableCell sx={{ flex: 2 }}>{opinion.name}</TableCell>
                    <TableCell sx={{ flex: 2 }}>{opinion.service.name}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditClick(opinion.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(opinion.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {loading && page > 1 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}
                {!hasMore && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2">Você viu tudo!</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>
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
    </>
  );
};

export default ServiceOpinionsList; // Renomeie o export
