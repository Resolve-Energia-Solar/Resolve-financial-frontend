import * as React from 'react';
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

export default function ListSchedule({ form, onClose, onRefresh }) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    customer: null,
    schedule_creator: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ScheduleService.index({
          fields: 'customer,service,address,schedule_date,schedule_end_date,schedule_start_time,schedule_end_time,schedule_agent',
          expand: 'customer,address,service,schedule_agent',
          customer: filters.customer?.value,
          schedule_creator: filters.schedule_creator?.value,
          page: page + 1,
          limit: rowsPerPage,
        });

        setRows(response.results || []);
        setTotalRows(response.meta?.pagination?.total_count || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, filters]);

  const handleAssociateAgent = (row) => {
    console.log('Associar agente para:', row);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <ListScheduleSkeleton />;
  }

  return (
    <Paper>
      <Grid container spacing={1} sx={{p:1}}>
        <Grid item xs={12} md={3}>
          <GenericAsyncAutocompleteInput
            label="Cliente"
            value={filters.customer}
            onChange={(newValue) => setFilters({ ...filters, customer: newValue })}
            endpoint="/api/users/"
            size="small"
            queryParam="complete_name__icontains"
            extraParams={{ fields: ['id', 'complete_name'] }}
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
            extraParams={{ fields: ['id', 'complete_name'] }}
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
              <TableCell>Agente</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                  <IconButton color="primary" onClick={() => handleAssociateAgent(row)}>
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
    </Paper>
  );
}
