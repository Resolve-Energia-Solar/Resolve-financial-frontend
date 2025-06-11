'use client';
import React, { useEffect, useState } from 'react';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import BlankCard from '@/app/components/shared/BlankCard';
import { Box, Dialog, DialogContent, DialogContentText, TablePagination, useTheme } from '@mui/material';
import { ptBR } from 'date-fns/locale';
import scheduleService from '@/services/scheduleService';
import DetailsDrawer from '../schedule/DetailsDrawer';
import GenericAsyncAutocompleteInput from '../../filters/GenericAsyncAutocompleteInput';
import AddSchedulePage from '../inspections/schedule/AgentRoutes/Add-Schedule/Add-Schedule';

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const messages = {
  today: 'Hoje',
  previous: 'Anterior',
  next: 'Próximo',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Nenhum evento neste período.',
};

const sanitize = (str) => {
  return String(str || '')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br/>');
};

const CustomEventWrapper = ({ event, children }) => (
  <>
    <div
      style={{ zIndex: 999 }}
      data-tooltip-id={`tooltip-${event.schedule_id}`}
      data-tooltip-html={`
        ${sanitize(event.service)}<br/>
        <strong>Agente: ${sanitize(event.agentName)}</strong><br/>
        <strong>Cliente: ${sanitize(event.title)}</strong><br/>
        ${sanitize(event.address)}<br/>
        <strong>Parecer Final: ${sanitize(event.final_service_opinion)}</strong>
      `}
    >
      {children}
    </div>
    <Tooltip id={`tooltip-${event.schedule_id}`} place="top" style={{ zIndex: 9999 }} />
  </>
);

const BigCalendar = () => {
  const [calevents, setCalEvents] = useState([]);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [modalCreateScheduleOpen, setModalCreateScheduleOpen] = useState(false);
  const [start, setStart] = useState(new Date());
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState();
  const [formData, setFormData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRows, setTotalRows] = useState(0);

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => setRefresh((prev) => !prev);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.index({
        service: category,
        schedule_date_year: start.getFullYear(),
        schedule_date_month: start.getMonth() + 1,
        expand:
          'customer,address,service,schedule_agent,final_service_opinion,final_service_opinion_user',
        fields:
          'id,schedule_date,schedule_start_time,schedule_end_date,schedule_end_time,customer,address,service,schedule_agent,final_service_opinion,final_service_opinion_user',
        view_all: true,
        page: page + 1,
        limit: rowsPerPage,
      });
  
      setTotalRows(response.meta?.pagination?.total_count || 0);
      const events = transformEvents(response?.results || []);
      setCalEvents(events);
    } catch (error) {
      console.error('Erro ao buscar schedule:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const transformEvents = (results) => {
    const serviceColors = {
      1: '#FF5733', // Vermelho alaranjado
      2: '#33FF57', // Verde
      3: '#3357FF', // Azul
      4: '#F033FF', // Magenta
      5: '#33FFF5', // Ciano
      6: '#FF33A8', // Rosa
      7: '#A833FF', // Roxo
      8: '#33FF8E', // Verde água
      9: '#FFC733', // Laranja
      10: '#8E33FF', // Violeta
    };

    return results.map((item) => {
      const startDateStr = item.schedule_date;
      const startTimeStr = item.schedule_start_time;
      const endDateStr = item.schedule_end_date;
      const endTimeStr = item.schedule_end_time;

      const start = new Date(`${startDateStr}T${startTimeStr}`);
      const end = new Date(`${endDateStr}T${endTimeStr}`);
      const allDay = startTimeStr === '00:00:00' && endTimeStr === '23:59:59';

      const customerName = item.customer?.complete_name || '-';
      const agentName = item.schedule_agent?.complete_name || '-';
      const address = item.address?.complete_address || 'Endereço não disponível';
      const service = item.service.name;
      const serviceId = item.service.id;
      const final_service_opinion = item.final_service_opinion?.name || '-';
      const final_service_opinion_user = item.final_service_opinion_user?.name || '-';

      const color = serviceColors[serviceId] || '#CCCCCC';

      return {
        title: customerName,
        address,
        allDay,
        schedule_id: item.id,
        start,
        end,
        color,
        service,
        serviceId,
        agentName,
        final_service_opinion,
        final_service_opinion_user,
      };
    });
  };

  useEffect(() => {
    fetchSchedule();
  }, [start, category, refresh, page, rowsPerPage]);

  const handleStartChange = (newDate) => {
    setStart(newDate);
  };

  return (
    <>
      <BlankCard>
        <CardContent>
          <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Escolha a data"
                views={['year', 'month']}
                value={start}
                onChange={handleStartChange}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
              />
            </LocalizationProvider>

            <Box sx={{ width: '400px' }}>
              <GenericAsyncAutocompleteInput
                label="Escolha o serviço"
                name="service"
                value={category}
                onChange={(option) => {
                  setCategory(option?.value);
                  setFormData((prev) => ({
                    ...prev,
                    service: option?.value,
                  }));
                }}
                endpoint="/api/services/"
                size="small"
                queryParam="name__icontains"
                extraParams={{ fields: ['id', 'name'] }}
                mapResponse={(data) =>
                  data.results.map((p) => ({
                    label: p.name,
                    value: p.id,
                  }))
                }
                fullWidth
              />
            </Box>
          </Box>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ height: 'calc(100vh - 350px)' }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Calendar
              date={start}
              onNavigate={(newDate) => setStart(newDate)}
              selectable
              events={calevents}
              defaultView="month"
              localizer={localizer}
              messages={messages}
              style={{ height: 'calc(100vh - 350px)' }}
              components={{ eventWrapper: CustomEventWrapper }}
              onSelectEvent={(event) => {
                setSelectedScheduleId(event.schedule_id);
                setDetailsDrawerOpen(true);
              }}
              onSelectSlot={(event) => {
                const date = event.start;
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const onlyDate = `${year}-${month}-${day}`;
                setFormData((prev) => ({
                  ...prev,
                  schedule_date: onlyDate,
                }));
                setModalCreateScheduleOpen(true);
              }}
            />
          )}
        </CardContent>

        <TablePagination
          rowsPerPageOptions={[25, 50, 75, 100, 200]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Linhas por página"
        />
      </BlankCard>

      <DetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => {
          setDetailsDrawerOpen(false);
          setSelectedScheduleId(null);
        }}
        scheduleId={selectedScheduleId}
      />

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
    </>
  );
};

export default BigCalendar;
