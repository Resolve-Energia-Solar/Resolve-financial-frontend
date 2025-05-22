'use client';
import {
  Grid,
  TextField,
  Box,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import CardAgentRoutes from './components/Card';
import userService from '@/services/userService';
import scheduleService from '@/services/scheduleService';
import { useEffect, useState, useCallback } from 'react';
import ModalMaps from '@/app/components/apps/inspections/schedule/AgentRoutes/components/Maps/ModalMaps';
import UpdateSchedulePage from '@/app/(DashboardLayout)/apps/schedules/[id]/update/page';
import AddSchedulePage from '@/app/components/apps/inspections/schedule/AgentRoutes/Add-Schedule/Add-Schedule';
import ListSchedule from '@/app/components/apps/inspections/schedule/AgentRoutes/List-Schedule/List-Schedule';
import { IconMapUp } from '@tabler/icons-react';
import ModalGeralMaps from './components/Maps/ModalGeralMaps';
import { useSelector } from 'react-redux';

export default function AgentRoutes({ projectId = null }) {
  const [agents, setAgents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');
  const [committedName, setCommittedName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [points, setPoints] = useState([]);

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_AGENT_ROUTES_KEY || '';
  const [modalEditScheduleOpen, setModalEditScheduleOpen] = useState(false);
  const [modelCreateScheduleOpen, setModelCreateScheduleOpen] = useState(false);
  const [modalListScheduleOpen, setModalListScheduleOpen] = useState(false);
  const [modalMapsOpen, setModalMapsOpen] = useState(false);
  const [modalMapGeralOpen, setModalMapGeralOpen] = useState(false);

  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({});

  const permissions = useSelector((state) => state.user.permissions);
  const canEdit = permissions.includes('field_services.can_see_admin_schedules');

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleOpenMap = (locations) => {
    setPoints(locations);
    setModalMapsOpen(true);
  };

  const handleOpenModalListSchedule = (agentId) => {
    setModalListScheduleOpen(true);
    setFormData({
      schedule_agent: agentId,
      schedule_date: format(selectedDate, 'yyyy-MM-dd'),
      service: 1,
      project: projectId || null,
    });
  };

  const handleOpenModalCreateSchedule = (agentId) => {
    setModelCreateScheduleOpen(true);
    setFormData({
      schedule_agent: agentId,
      schedule_date: format(selectedDate, 'yyyy-MM-dd'),
      service: 1,
      project: projectId || null,
    });
  };

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
              expand: 'address,service',
              fields:
                'id,address,schedule_date,schedule_end_date,schedule_start_time,schedule_end_time,service',
              ordering: 'schedule_start_time',
              limit: 5,
            });

            const schedulesWithAgentName = (scheduleResponse.results || []).map((schedule) => ({
              ...schedule,
              agent_name: agent.complete_name,
            }));

            setSchedules((prev) => [...prev, ...schedulesWithAgentName]);

            return {
              ...agent,
              schedules: schedulesWithAgentName,
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
    [rowsPerPage, page, refresh],
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

        <Button startIcon={<IconMapUp />} onClick={() => setModalMapGeralOpen(true)}>
          Abrir Mapa
        </Button>

        <ModalGeralMaps
          open={modalMapGeralOpen}
          onClose={() => setModalMapGeralOpen(false)}
          pointsData={schedules}
          apiKey={GOOGLE_MAPS_API_KEY}
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
                date={selectedDate}
                title={agent.complete_name}
                items={agent.schedules}
                onItemClick={handleOpenModalSchedule}
                onCreateSchedule={handleOpenModalCreateSchedule}
                onListSchedule={handleOpenModalListSchedule}
                onOpenMap={handleOpenMap}
                canEdit={canEdit}
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
            <UpdateSchedulePage
              scheduleId={selectedScheduleId}
              onClosedModal={() => setModalEditScheduleOpen(false)}
            />
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
            <AddSchedulePage
              form={formData}
              onClose={() => setModelCreateScheduleOpen(false)}
              onRefresh={() => handleRefresh()}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalListScheduleOpen}
        onClose={() => setModalListScheduleOpen(false)}
        maxWidth="lg"
      >
        <DialogContent>
          <DialogTitle>Lista de Agendamentos</DialogTitle>
          <DialogContentText>
            <ListSchedule
              form={formData}
              onClose={() => setModalListScheduleOpen(false)}
              onRefresh={() => handleRefresh()}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <ModalMaps
        open={modalMapsOpen}
        onClose={() => setModalMapsOpen(false)}
        title="Rota Agente"
        points={points}
        apiKey={GOOGLE_MAPS_API_KEY}
      />
    </LocalizationProvider>
  );
}
