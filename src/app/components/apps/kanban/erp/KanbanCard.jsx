// components/KanbanCard.js
import { Avatar, Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import thermometer from '@/utils/due_date_thermometer';
import { AccessTime, Check } from '@mui/icons-material';
import { keyframes } from '@emotion/react';


export default function KanbanCard({ task, onClick }) {

  const theme = useTheme();

  const pulseAnimation = keyframes`
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    `;

  return (

    <Card variant="outlined" sx={{ mb: 2, padding: 0, overflowX: 'auto', boxShadow: theme.shadows[1] }} onClick={() => onClick(task)}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingInline: 2, paddingBottom: '10px !important', paddingTop: '14px' }} className='card-content'>
        <Box display='flex' fullWidth justifyContent='flex-end'>
          {task.column.name == 'Feito' ?
            <Check
              sx={{
                fontSize: '1.2rem',
                width: '20px',
                height: '20px',
                backgroundColor: '#77DD77',
                borderRadius: '50%',
                color: '#FFFFFF',
                border: '2px solid #77DD77'
              }}
            /> :
            <AccessTime
              sx={{
                fontSize: '1.2rem',
                animation: `${pulseAnimation} 1.5s infinite`,
                transition: 'color 0.3s ease-in-out',
                width: '17px',
                height: '17px',
                backgroundColor: thermometer(task.start_date, task.due_date, task.completion_date),
                borderRadius: '50%',
              }}
            />
          }
        </Box>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2">{task?.project.homologator?.complete_name}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2">Inicio: {new Date(task?.start_date).toLocaleDateString()}</Typography>
          <Typography variant="body2">Vencimento: {new Date(task?.due_date).toLocaleDateString()}</Typography>
          <Typography variant="body2">Conclusão: {task.completion_date && new Date(task?.completion_date).toLocaleDateString()}</Typography>
        </Box>
        <Box backgroundColor="#E0E0E0" width='100%' height='.5px' />
        <Box display='flex' fullWidth justifyContent='space-between' alignItems='center'>
          <Typography variant="body2">Dono: {task?.project?.sale?.customer?.name}</Typography>
          <Avatar variant="" sx={{ width: '32px', height: '32px' }} />
        </Box>
      </CardContent>
    </Card>

  );
}
