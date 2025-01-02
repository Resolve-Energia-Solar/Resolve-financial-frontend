// components/KanbanColumn.js
import { Box, Typography } from '@mui/material';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ title, color, tasks, onClickCard }) {
  return (
    <Box sx={{ maxWidth: '300px',maxHeight: '80vh', height: '80vh', minWidth: '300px', mx: 1, py: 3, bgcolor: color, borderRadius: '8px', boxShadow: 5 }}>
      <Typography variant="h6" sx={{ mb: 2, px: 3 }}>{title}</Typography>
      <Box sx={{ overflowY: 'auto', scrollbarWidth: 'none !important', height: '80vh', px: 3 }} >

        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onClick={onClickCard} />
        ))}
      </Box>
    </Box >
  );
}
