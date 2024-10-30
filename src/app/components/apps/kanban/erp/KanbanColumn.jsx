// components/KanbanColumn.js
import { Box, Typography } from '@mui/material';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ title, tasks }) {
  return (
    <Box sx={{ maxWidth: '300px', height: '80vh', minWidth: '300px', mx: 1,py: 3, bgcolor: '#f4f6f8', borderRadius: '8px' }}>
      <Typography variant="h5" sx={{ mb: 2, px: 3 }}>{title}</Typography>
      <Box sx={{ overflowY: 'auto', height: '80vh', px: 3 }}>

        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </Box>
    </Box >
  );
}
