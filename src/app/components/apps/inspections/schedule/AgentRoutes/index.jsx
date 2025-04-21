'use client';
import {
  CardContent,
  Grid,
} from '@mui/material';
import CardAgentRoutes from './Card';

export default function AgentRoutes() {
  const items = [
    {
      timestamp: '08:00 - 08:45',
      label: 'Rua João de Barros, 123',
      description: 'O agente iniciou a rota.',
      icon: 'car',
      color: 'primary'
    },
    {
      timestamp: '08:45',
      label: 'Chegada ao Cliente',
      description: 'Entrega iniciada no ponto A.',
      icon: 'location',
      color: 'secondary'
    },
    {
      timestamp: '09:30',
      label: 'Entrega Realizada',
      description: 'Cliente recebeu o pacote.',
      icon: 'delivery',
      color: 'success'
    },
    {
      timestamp: '10:00',
      label: 'Rota Concluída',
      description: 'Agente retornou à base.',
      icon: 'done',
      color: 'success'
    }
  ];
  
  return <>
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={3}>
        <CardAgentRoutes title="Matheus Barbosa de Lima" items={items} />
      </Grid>
    </Grid>
  </>;
}
