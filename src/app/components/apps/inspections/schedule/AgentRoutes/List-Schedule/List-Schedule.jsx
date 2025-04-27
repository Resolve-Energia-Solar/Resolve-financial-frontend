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
import ScheduleService from '@/services/scheduleService';
import ListScheduleSkeleton from '@/app/components/apps/inspections/schedule/AgentRoutes/components/ListScheduleSkeleton';

export default function ListSchedule({ form, onClose, onRefresh }) {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [loading, setLoading] = useState(true); // 👈 adiciona loading

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 👈 começa carregando
      try {
        const response = await ScheduleService.index({
          fields: 'customer,service,address,schedule_date,schedule_end_date,schedule_start_time,schedule_end_time,schedule_agent',
          expand: 'customer,address,service,schedule_agent',
          page: page + 1,
          limit: rowsPerPage,
        });

        console.log('API Response:', response.results);
        setRows(response.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // 👈 para de carregar
      }
    };

    fetchData();
  }, [page, rowsPerPage]);

  const handleAssociateAgent = (row) => {
    console.log('Associar agente para:', row);
  };

  if (loading) {
    return <ListScheduleSkeleton />; // 👈 mostra o skeleton enquanto carrega
  }

  return (
    <TableContainer component={Paper}>
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
  );
}
