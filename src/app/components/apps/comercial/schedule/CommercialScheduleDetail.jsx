'use client';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Paper,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Comment from '../../comment';
import { formatDateTime } from '@/utils/inspectionFormatDate';
import React, { useState, useCallback } from 'react';
// Componentes fictícios (substitua pelos reais)
const ScheduleComments = ({ scheduleId }) => (
  <Box p={2}>
    <Comment appLabel={'field_services'} model={'schedule'} objectId={scheduleId} />
  </Box>
);

const ScheduleHistory = ({ scheduleId }) => (
  <Box p={2}>
    <Typography variant="body2">Histórico do agendamento #{scheduleId}</Typography>
  </Box>
);

const formatAddress = (address) => {
  if (!address) return '-';
  const { street, neighborhood, city, state, country } = address;
  return (
    street +
    (neighborhood ? `, ${neighborhood}` : '') +
    (city ? `, ${city}` : '') +
    (state ? `, ${state}` : '') +
    (country ? ` - ${country}` : '')
  );
};

const getStatusChip = (status) => {
  let color = 'default';
  if (status === 'Pendente') color = 'warning';
  else if (status === 'Confirmado') color = 'success';
  else if (status === 'Cancelado') color = 'error';
  return <Chip label={status} color={color} size="small" />;
};

const CommercialScheduleDetail = ({ schedule }) => {
  const [tabValue, setTabValue] = useState(0);

  const formatDate = useCallback((dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
    }, []);
    

  if (!schedule) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">Nenhum agendamento selecionado.</Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Informações do Agendamento" />
          <Tab label="Comentários" />
          <Tab label="Histórico" />
        </Tabs>

        <Divider />



        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
            {tabValue === 0 && (
                <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                    <PersonIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                        <strong>Cliente</strong>
                    </Typography>
                    </Box>
                    <Typography variant="body1">
                    {schedule.customer?.complete_name || '-'}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                    <BuildIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                        <strong>Serviço</strong>
                    </Typography>
                    </Box>
                    <Typography variant="body1">
                    {schedule.service?.name || '-'}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mr: 1 }}>
                        <strong>Status do Agendamento</strong>
                    </Typography>
                    </Box>
                    <Typography variant="body1">
                    {getStatusChip(schedule.status)}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                    <CalendarTodayIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                        <strong>Data do Agendamento</strong>
                    </Typography>
                    </Box>
                    <Typography variant="body1">{formatDate(schedule.schedule_date) || '-'}</Typography>
                </Grid>

                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                    <AccessTimeIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                        <strong>Hora de Início</strong>
                    </Typography>
                    </Box>
                    <Typography variant="body1">{schedule.schedule_start_time || '-'}</Typography>
                </Grid>

                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                    <SupervisorAccountIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                        <strong>Agente</strong>
                    </Typography>
                    </Box>
                    <Chip
                    label={schedule.schedule_agent?.complete_name || 'Sem Agente'}
                    color={schedule.schedule_agent ? 'success' : 'error'}
                    variant="outlined"
                    />
                </Grid>

                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                    <LocationOnIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                        <strong>Endereço</strong>
                    </Typography>
                    </Box>
                    <Typography variant="body1">{formatAddress(schedule.address)}</Typography>
                </Grid>

                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" mb={0.5}>
                    <ScheduleIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                        <strong>Criado Em</strong>
                    </Typography>
                    </Box>
                    <Typography variant="body1">{formatDateTime(schedule.created_at) || '-'}</Typography>
                </Grid>
                </Grid>
            )}

            {tabValue === 1 && <ScheduleComments scheduleId={schedule.id} />}
            {tabValue === 2 && <ScheduleHistory scheduleId={schedule.id} />}
        </Box>

      </Paper>
    </Box>
  );
};

export default CommercialScheduleDetail;
