// components/KanbanCard.js
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import thermometer from '@/utils/due_date_thermometer';
import ModalCardDetail from './ModalCardDetail';
import { useState } from 'react';



export default function KanbanCard({ task, onClick }) {

  const theme = useTheme();

  return (

    <Card variant="outlined" sx={{ mb: 2, padding: 0, overflowX: 'auto', boxShadow: theme.shadows[1] }} onClick={() => onClick(task)}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, padding: 2.5 }} >
        <Box sx={{ bgcolor: thermometer(task.start_date, task.due_date, task.completion_date), width: '25px', height: '14px' }}>

        </Box>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2">{task.description}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2">Inicio: {new Date(task?.start_date).toLocaleDateString()}</Typography>
          <Typography variant="body2">Vencimento: {new Date(task?.due_date).toLocaleDateString()}</Typography>
          <Typography variant="body2">Conclusão: {task.completion_date && new Date(task?.completion_date).toLocaleDateString()}</Typography>
        </Box>

      </CardContent>
    </Card>

  );
}
