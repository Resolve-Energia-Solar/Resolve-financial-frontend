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
import { Box, useTheme } from '@mui/material';
import { ptBR } from 'date-fns/locale';
import scheduleService from '@/services/scheduleService';
import DetailsDrawer from '../schedule/DetailsDrawer';
import GenericAsyncAutocompleteInput from '../../filters/GenericAsyncAutocompleteInput';

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

const BigCalendar = () => {
  const [calevents, setCalEvents] = useState();
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [start, setStart] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState();
  const theme = useTheme();


  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.index({
        service: category,
        schedule_date_year: start.getFullYear(),
        schedule_date_month: start.getMonth() + 1,
        expand: 'customer,address',
        fields:
          'id,schedule_date,schedule_start_time,schedule_end_date,schedule_end_time,customer,address',
        view_all: true,
      });

      const events = transformEvents(response?.results || []);
      setCalEvents(events);
    } catch (error) {
      console.error('Erro ao buscar schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformEvents = (results) => {
    return results.map((item) => {
      const startDateStr = item.schedule_date;
      const startTimeStr = item.schedule_start_time;
      const endDateStr = item.schedule_end_date;
      const endTimeStr = item.schedule_end_time;

      const start = new Date(`${startDateStr}T${startTimeStr}`);
      const end = new Date(`${endDateStr}T${endTimeStr}`);

      const allDay = startTimeStr === '00:00:00' && endTimeStr === '23:59:59';

      const customerName = item.customer.complete_name || 'Cliente sem nome';
      const address = item.address?.complete_address || 'Endereço não disponível';

      const title = `${customerName}`;
      const color = theme.palette.primary;
      const schedule_id = item.id;

      return {
        title,
        allDay,
        schedule_id,
        start,
        end,
        color,
      };
    });
  };

  useEffect(() => {
    fetchSchedule();
  }, [start,category]);

  const handleStartChange = (newDate) => {
    setStart(newDate);
    setCalendarDate(newDate);
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
                inputFormat="MM/yyyy"
                value={start}
                onChange={handleStartChange}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
              />
            </LocalizationProvider>

            <Box sx={{width: '400px'}}>
              <GenericAsyncAutocompleteInput
                label="Escolhe o serviço"
                name="service"
                value={category}
                onChange={(option) => setCategory(option?.value)}
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
              date={calendarDate}
              onNavigate={(newDate) => {
                setCalendarDate(newDate);
                setStart(newDate);
              }}
              selectable
              events={calevents}
              defaultView="month"
              localizer={localizer}
              messages={messages}
              style={{ height: 'calc(100vh - 350px)' }}
              onSelectEvent={(event) => {
                setSelectedScheduleId(event.schedule_id);
                setDetailsDrawerOpen(true);
              }}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.color?.main || theme.palette.primary.main,
                  color: theme.palette.getContrastText(event.color?.main || theme.palette.primary.main),
                  borderRadius: '4px',
                  padding: '2px',
                },
              })}
            
            />
          )}
        </CardContent>
      </BlankCard>

      <DetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => {
          setDetailsDrawerOpen(false);
          setSelectedScheduleId(null);
        }}
        scheduleId={selectedScheduleId}
      />
    </>
  );
};

export default BigCalendar;
