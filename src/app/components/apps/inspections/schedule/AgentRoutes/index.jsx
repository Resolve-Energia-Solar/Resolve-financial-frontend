'use client';
import { Grid, TextField, Box, TablePagination, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import CardAgentRoutes from './components/Card';
import userService from '@/services/userService';
import scheduleService from '@/services/scheduleService';
import { useEffect, useState, useCallback } from 'react';
import ScheduleFormEdit from '../Edit-schedule/tabs/ScheduleFormEdit';
import UpdateSchedulePage from '@/app/(DashboardLayout)/apps/schedules/[id]/update/page';
import AddSchedulePage from '@/app/components/apps/inspections/schedule/AgentRoutes/Add-Schedule/Add-Schedule';

export default function AgentRoutes() {
  const [agents, setAgents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');
  const [committedName, setCommittedName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [modalEditScheduleOpen, setModalEditScheduleOpen] = useState(false);
  const [modelCreateScheduleOpen, setModelCreateScheduleOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [formData, setFormData] = useState({});


  const handleOpenModalCreateSchedule = (agentId) => {
    setModelCreateScheduleOpen(true);
    setFormData({
      schedule_agent: agentId,
    })
  }

  const handleOpenModalSchedule = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    setModalEditScheduleOpen(true);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = useCallback(
    async (date, nameFilter) => {
      setLoading(true);
      try {
        const agentResponse = await userService.index({
          name: nameFilter,
          category: 1,
          limit: rowsPerPage,
          page: page + 1,
          fields: 'id,complete_name',
          date: format(date, 'yyyy-MM-dd'),
          order_by_schedule_count: 'desc',
        });

        setTotalRows(agentResponse.meta?.pagination?.total_count || 0);

        const agentsData = agentResponse.results;
        const dateStr = format(date, 'yyyy-MM-dd');

        const agentsWithDetails = await Promise.all(
          agentsData.map(async (agent) => {
            const scheduleResponse = await scheduleService.index({
              schedule_agent: agent.id,
              schedule_date__range: `${dateStr},${dateStr}`,
              expand: 'address',
              fields:
                'id,address,schedule_date,schedule_end_date,schedule_start_time,schedule_end_time',
              ordering: 'schedule_start_time',
              limit: 5,
            });

            return {
              ...agent,
              schedules: scheduleResponse.results || [],
            };
          }),
        );

        setAgents(agentsWithDetails);
      } catch (error) {
        console.error('Erro ao buscar dados dos agentes:', error);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage, page],
  );

  useEffect(() => {
    fetchData(selectedDate, committedName);
  }, [selectedDate, committedName, fetchData, page, rowsPerPage]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNameCommit = () => {
    if (name !== committedName) {
      setCommittedName(name);
      setPage(0);
    }
  };

  const handleModel = (newValue) => {
    console.log('abrindo o modal', newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <DatePicker
          label="Data"
          value={selectedDate}
          onChange={(newValue) => {
            if (newValue) setSelectedDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />

        <TextField
          label="Filtrar por nome"
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameCommit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleNameCommit();
            }
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {agents.map((agent) => (
            <Grid item xs={12} md={4} lg={3} key={agent.id}>
              <CardAgentRoutes
                id={agent.id}
                title={agent.complete_name}
                items={agent.schedules}
                onItemClick={handleOpenModalSchedule}
                onCreateSchedule={handleOpenModalCreateSchedule}
              />
            </Grid>
          ))}
        </Grid>
      )}

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

      <Dialog
        open={modalEditScheduleOpen}
        onClose={() => setModalEditScheduleOpen(false)}
        aria-labelledby="draggable-dialog-title"
        maxWidth="lg"
      >
        <DialogContent>
          <DialogContentText>
            <UpdateSchedulePage scheduleId={selectedScheduleId} onClosedModal={() => setModalEditScheduleOpen(false)} />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modelCreateScheduleOpen}
        onClose={() => setModelCreateScheduleOpen(false)}
        aria-labelledby="draggable-dialog-title"
        maxWidth="lg"
      >
        <DialogContent>
          <DialogContentText>
            <AddSchedulePage form={formData} serviceId={1} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}
