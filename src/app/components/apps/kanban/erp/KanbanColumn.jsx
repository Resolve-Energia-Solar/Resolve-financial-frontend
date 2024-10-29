// components/KanbanColumn.js
import { Box, Typography } from '@mui/material';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ title, tasks }) {
  return (
    <Box sx={{ width: '300px', mx: 1, p: 2, bgcolor: '#f4f6f8', borderRadius: '8px' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>
      {tasks.map((task) => (
        <KanbanCard key={task.id} task={task} />
      ))}
    </Box>
  );
}
