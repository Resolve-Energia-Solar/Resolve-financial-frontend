// components/KanbanCard.js
import { Card, CardContent, Typography } from '@mui/material';

export default function KanbanCard({ task }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2">{task.description}</Typography>
      </CardContent>
    </Card>
  );
}
