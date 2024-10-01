import React from 'react';
import { Box, Typography } from '@mui/material';

const TaskDetails = ({ selectedTask }) => {
  return (
    <Box>
      <Typography variant="h6">Detalhes da Tarefa</Typography>
      {Object.keys(selectedTask).map((key) => (
        <Typography key={key} variant="body1">
          {key}: {selectedTask[key] || 'N/A'}
        </Typography>
      ))}
    </Box>
  );
};

export default TaskDetails;
