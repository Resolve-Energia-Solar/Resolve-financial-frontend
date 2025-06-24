'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Grid,
  TextField,
  Box,
  TablePagination,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import CardAgentRoutes from './components/Card';
import ModalMaps from './components/Maps/ModalMaps';
import ModalGeralMaps from './components/Maps/ModalGeralMaps';
import UpdateSchedulePage from '@/app/(DashboardLayout)/apps/schedules/[id]/update/page';
import AddSchedulePage from './Add-Schedule/Add-Schedule';
import ListSchedule from './List-Schedule/List-Schedule';
import { IconMapUp } from '@tabler/icons-react';

import userService from '@/services/userService';
import scheduleService from '@/services/scheduleService';
import { useSelector } from 'react-redux';

const DEFAULT_START = '08:00';
const DEFAULT_END   = '18:00';

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
  const [modalCreateScheduleOpen, setModalCreateScheduleOpen] = useState(false);
  const [modalListScheduleOpen, setModalListScheduleOpen] = useState(false);
  const [modalMapsOpen, setModalMapsOpen] = useState(false);
  const [modalMapGeralOpen, setModalMapGeralOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({});

  const permissions = useSelector((state) => state.user.permissions);
  const canEdit = permissions.includes('field_services.view_all_schedule');

  const handleRefresh = () => setRefresh((prev) => !prev);

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
      project: projectId,
    });
  };

  const handleOpenModalCreateSchedule = (agentId) => {
    setModalCreateScheduleOpen(true);
    setFormData({
      schedule_agent: agentId,
      schedule_date: format(selectedDate, 'yyyy-MM-dd'),
      service: 1,
      project: projectId,
    });
  };

  const handleOpenModalSchedule = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
    setModalEditScheduleOpen(true);
  };

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchData = useCallback(
    async (date, nameFilter) => {
      setLoading(true);
      try {
        setSchedules([]);
        const dateStr = format(date, 'yyyy-MM-dd');

        // 1) Busca lista de agentes
        const agentResponse = await userService.index({
          name: nameFilter,
          category: 1,
          expand: 'free_time_agent',
          limit: rowsPerPage,
          page: page + 1,
          fields: 'id,complete_name,free_time_agent',
          date: dateStr,
          order_by_schedule_count: 'desc',
          view_all: true,
        });

        setTotalRows(agentResponse.meta?.pagination?.total_count || 0);
        const agentsData = agentResponse.results;

        // 2) Para cada agente, busca agendas e disponibilidade
        const detailed = await Promise.all(
          agentsData.map(async (agent) => {
            const [scheduleResp, availability] = await Promise.all([
              scheduleService.index({
                schedule_agent: agent.id,
                schedule_date__range: `${dateStr},${dateStr}`,
                expand: 'address,service,customer',
                fields: 'id,address,schedule_date,schedule_end_date,schedule_start_time,schedule_end_time,service.name,customer.complete_name,customer.schedule_inspection_count',
                ordering: 'schedule_start_time',
                limit: 5,
                view_all: true,
              }),
              userService.availability(agent.id, {
                date: dateStr,
                start_time: DEFAULT_START,
                end_time: DEFAULT_END,
              }),
            ]);

            const scheds = (scheduleResp.results || []).map((s) => ({
              ...s,
              agent_name: agent.complete_name,
            }));

            setSchedules((prev) => [...prev, ...scheds]);

            return {
              ...agent,
              schedules: scheds,
              available: availability.available,
              availabilityDetails: availability,
            };
          })
        );

        setAgents(detailed);
      } catch (error) {
        console.error('Erro ao buscar dados dos agentes:', error);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage, page, refresh]
  );

  console.log('Agents:', agents);

  useEffect(() => {
    fetchData(selectedDate, committedName);
  }, [selectedDate, committedName, fetchData]);

  const handleNameChange = (e) => setName(e.target.value);
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
          onChange={(newVal) => newVal && setSelectedDate(newVal)}
          renderInput={(params) => <TextField {...params} />}
        />

        <TextField
          label="Filtrar por nome"
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameCommit}
          onKeyDown={(e) => e.key === 'Enter' && handleNameCommit()}
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
                freeTimeAgent={agent?.availabilityDetails?.free_time_agent[0] || null}
                title={agent.complete_name}
                items={agent.schedules}
                onItemClick={handleOpenModalSchedule}
                onCreateSchedule={handleOpenModalCreateSchedule}
                onListSchedule={handleOpenModalListSchedule}
                onOpenMap={handleOpenMap}
                canEdit={canEdit}
                available={agent.availabilityDetails?.available}
                availabilityDetails={agent.availabilityDetails}
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

      {/* Modais de CRUD de agendamento */}
      <Dialog
        open={modalEditScheduleOpen}
        onClose={() => setModalEditScheduleOpen(false)}
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
        open={modalCreateScheduleOpen}
        onClose={() => setModalCreateScheduleOpen(false)}
        maxWidth="lg"
      >
        <DialogContent>
          <DialogContentText>
            <AddSchedulePage
              form={formData}
              onClose={() => setModalCreateScheduleOpen(false)}
              onRefresh={handleRefresh}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalListScheduleOpen}
        onClose={() => setModalListScheduleOpen(false)}
        maxWidth="lg"
      >
        <DialogTitle>Lista de Agendamentos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <ListSchedule
              form={formData}
              onClose={() => setModalListScheduleOpen(false)}
              onRefresh={handleRefresh}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Mapa de rota individual */}
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
