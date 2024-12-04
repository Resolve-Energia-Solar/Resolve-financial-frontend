'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddBoxRounded,
  Description as DescriptionIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@mui/icons-material';

/* components */
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';
import { MyScheduleDataContext } from '@/app/context/InspectionContext/MyScheduleContext';

/* services */
import scheduleService from '@/services/scheduleService';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';
import { IconEyeglass } from '@tabler/icons-react';

const MyScheduleList = () => {
  const router = useRouter();
  const userId = useSelector((state) => state.user?.user?.id);

  const [schedulesList, setSchedulesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { filters, refresh } = useContext(MyScheduleDataContext);

  const [order, setOrder] = useState('schedule_date');
  const [orderDirection, setOrderDirection] = useState('asc');

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setSchedulesList([]);
  }, [order, orderDirection, filters, refresh]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(filters[1]).toString();
        const data = await scheduleService.getMySchedules({
          ordering: orderingParam,
          params: queryParams,
          nextPage: page,
          userId: userId,
        });
        if (page === 1) {
          setSchedulesList(data.results);
        } else {
          setSchedulesList((prevSchedulesList) => {
            const newItems = data.results.filter(
              (item) => !prevSchedulesList.some((existingItem) => existingItem.id === item.id),
            );
            return [...prevSchedulesList, ...newItems];
          });
        }
        if (data.next) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        setError('Erro ao buscar agendamentos');
        showAlert('Erro ao buscar agendamentos', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [page, order, orderDirection, filters, refresh]);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSaleToDelete(null);
  };

  const handleViewClick = (id) => {
    router.push(`/apps/inspections/my-schedule/${id}/view`);
  }

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
      <Typography variant="h6" gutterBottom>
        Lista de Agendamentos
      </Typography>
      <TableContainer
          component={Paper}
          elevation={10}
          sx={{ overflowX: 'auto', maxHeight: '50vh' }}
          onScroll={handleScroll}
        >
          <Table stickyHeader aria-label="sales table">
            <TableHead>
              <TableRow>
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

                <TableCell
                  sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('schedule_date')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Data de Agendamento
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'schedule_date' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>

                <TableCell
                  sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('schedule_start_time')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Hora do Agendamento
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'schedule_start_time' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>

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

                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            {loading && page === 1 ? (
              <TableSkeleton rows={5} columns={9} />
            ) : error && page === 1 ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TableBody>
                {schedulesList.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.schedule_agent.complete_name}</TableCell>
                    <TableCell>{schedule.schedule_date}</TableCell>
                    <TableCell>{schedule.schedule_start_time}</TableCell>
                    <TableCell>{schedule.status}</TableCell>
                    <TableCell>
                      <Tooltip title={'Visualizar'}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleViewClick(schedule.id)}
                        >
                          <IconEyeglass />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
      </TableContainer>
    </Box>
  );
};

export default MyScheduleList;
