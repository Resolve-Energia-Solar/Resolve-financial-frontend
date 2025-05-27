import * as React from 'react';
import { useSnackbar } from 'notistack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react';
import TablePagination from '@mui/material/TablePagination';
import Grid from '@mui/material/Grid';
import ScheduleService from '@/services/scheduleService';
import ListScheduleSkeleton from '@/app/components/apps/inspections/schedule/AgentRoutes/components/ListScheduleSkeleton';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DetailsDrawer from '@/app/components/apps/schedule/DetailsDrawer';

export default function ListSchedule({ form, onClose, onRefresh }) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const [filters, setFilters] = useState({
    customer: null,
    schedule_creator: null,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ScheduleService.index({
          fields:
            'id,customer,service,address,schedule_date,schedule_end_date,schedule_start_time,schedule_end_time,schedule_agent',
          expand: 'customer,address,service,schedule_agent',
          customer: filters.customer?.value,
          service: form.service,
          schedule_date__range: `${form.schedule_date},${form.schedule_date}`,
          schedule_creator: filters.schedule_creator?.value,
          schedule_agent__isnull: true,
          page: page + 1,
          limit: rowsPerPage,
        });

        console.log('response address: ', response);

        setRows(response.results || []);
        setTotalRows(response.meta?.pagination?.total_count || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, filters, refresh, form]);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleAssociateAgent = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmAction = async () => {
    try {
      setLoadingConfirm(true);
      const exists_agent = await ScheduleService.find(selectedRow.id, {
        fields: 'schedule_agent',
      });

      if (exists_agent.schedule_agent) {
        handleRefresh();
        enqueueSnackbar('Já existe um agente associado a este agendamento.', {
          variant: 'warning',
        });
        return;
      }

      const associate = await ScheduleService.update(selectedRow.id, {
        schedule_agent: form.schedule_agent,
      });

      if (associate) {
        onRefresh();
        onClose();
        enqueueSnackbar('Agente associado com sucesso.', {
          variant: 'success',
        });
      }
    } catch (err) {
      if (err.response && err.response.data && typeof err.response.data === 'object') {
        if ('available_time' in err.response.data) {
          const { message, available_time } = err.response.data;
          const timeSlots = available_time.map((slot) => (
            <li key={`${slot.start}-${slot.end}`}>
              {slot.start} - {slot.end}
            </li>
          ));
          enqueueSnackbar(
            <div style={{ maxWidth: '400px' }}>
              <Typography variant="body1">{message}</Typography>
              <Typography variant="body2">Horários disponíveis:</Typography>
              <ul>{timeSlots}</ul>
            </div>,
            { variant: 'warning' },
          );
        }
      }
      console.error('Erro ao associar o agente:', err);
    } finally {
      setLoadingConfirm(false);
      setOpenDialog(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // New handler for row click
  const handleRowClick = (row) => {
    setSelectedScheduleId(row.id);
    setDetailsDrawerOpen(true);
  };

  if (loading) {
    return <ListScheduleSkeleton />;
  }

  return (
    <Paper>
      <DetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => {
          setDetailsDrawerOpen(false);
          setSelectedScheduleId(null);
        }}
        scheduleId={selectedScheduleId}
      />
      <Grid container spacing={1} sx={{ p: 1 }}>
        <Grid item xs={12} md={3}>
          <GenericAsyncAutocompleteInput
            label="Cliente"
            value={filters.customer}
            onChange={(newValue) => setFilters({ ...filters, customer: newValue })}
            endpoint="/api/users/"
            size="small"
            queryParam="complete_name__icontains"
            extraParams={{ fields: ['id', 'complete_name'], limit: 10 }}
            mapResponse={(data) =>
              data.results.map((u) => ({ label: u.complete_name, value: u.id }))
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <GenericAsyncAutocompleteInput
            label="Criado por"
            value={filters.schedule_creator}
            onChange={(newValue) => setFilters({ ...filters, schedule_creator: newValue })}
            endpoint="/api/users/"
            size="small"
            queryParam="complete_name__icontains"
            extraParams={{ fields: ['id', 'complete_name'], limit: 10 }}
            mapResponse={(data) =>
              data.results.map((u) => ({ label: u.complete_name, value: u.id }))
            }
            fullWidth
          />
        </Grid>
      </Grid>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="Schedule table">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Serviço</TableCell>
              <TableCell>Data de Início</TableCell>
              <TableCell>Hora de Início</TableCell>
              <TableCell>Hora de Fim</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Agente</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                onClick={() => handleRowClick(row)} // Add onClick to open DetailsDrawer
              >
                <TableCell>{row.customer?.complete_name || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={row.service?.name || 'N/A'}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.schedule_date || 'N/A'}</TableCell>
                <TableCell>{row.schedule_start_time || 'N/A'}</TableCell>
                <TableCell>{row.schedule_end_time || 'N/A'}</TableCell>
                <TableCell>
                  {row?.address
                    ? `${row.address.street || ''} - ${row.address.neighborhood || ''}, ${row.address.state || ''
                    }, ${row.address.country || ''}`
                    : 'Endereço não disponível'}
                </TableCell>
                <TableCell>
                  {row.schedule_agent ? (
                    <Chip
                      label={row.schedule_agent.complete_name}
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Chip
                      label="Não associado"
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ backgroundColor: '#fdecea', color: '#d32f2f' }}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssociateAgent(row);
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage="Linhas por página"
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Ação</DialogTitle>
        <DialogContent>
          <Typography variant="body3">
            Você tem certeza que deseja associar este agendamento ao agente?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleConfirmAction}
            color="primary"
            disabled={loadingConfirm}
            endIcon={loadingConfirm ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {loadingConfirm ? 'Carregando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
