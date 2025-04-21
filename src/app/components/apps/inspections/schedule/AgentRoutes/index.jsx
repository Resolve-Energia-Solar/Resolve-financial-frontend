'use client';
import { Grid, TextField, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import CardAgentRoutes from './Card';
import userService from '@/services/userService';
import scheduleService from '@/services/scheduleService';
import { useEffect, useState, useCallback } from 'react';

export default function AgentRoutes() {
  const [agents, setAgents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState('');

  const fetchData = useCallback(async (date, nameFilter) => {
    try {
      const agentResponse = await userService.index({
        name: nameFilter,
        category: 1,
        fields: 'id,complete_name',
        date: date.toISOString().split('T')[0],
        order_by_schedule_count: 'desc',
      });

      const agentsData = agentResponse.results;
      const dateStr = date.toISOString().split('T')[0];

      const agentsWithDetails = await Promise.all(
        agentsData.map(async (agent) => {
          const scheduleResponse = await scheduleService.index({
            schedule_agent: agent.id,
            schedule_date__range: `${dateStr},${dateStr}`,
            expand: 'address',
            fields: 'id,address,schedule_date,schedule_end_date,schedule_start_time,schedule_end_time',
            ordering: 'schedule_start_time',
            limit: 5,
          });

          return {
            ...agent,
            schedules: scheduleResponse.results || [],
          };
        })
      );

      setAgents(agentsWithDetails);
    } catch (error) {
      console.error('Erro ao buscar dados dos agentes:', error);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedDate, name);
  }, [selectedDate, fetchData]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNameCommit = () => {
    fetchData(selectedDate, name);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      {/* Filtros fora do grid de cards */}
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

      {/* Grid com os cards */}
      <Grid container spacing={2}>
        {agents.map((agent) => (
          <Grid item xs={12} md={4} lg={3} key={agent.id}>
            <CardAgentRoutes
              title={agent.complete_name}
              items={agent.schedules}
            />
          </Grid>
        ))}
      </Grid>
    </LocalizationProvider>
  );
}
