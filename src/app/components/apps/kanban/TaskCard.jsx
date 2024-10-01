import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const TaskCard = ({ task, handleTaskClick }) => {
  return (
    <Card onClick={() => handleTaskClick(task)} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {task.title || 'Tarefa'}
        </Typography>

        {task.description && (
          <Typography variant="body2" color="textSecondary">
            Descrição: {task.description}
          </Typography>
        )}

        {task.start_date && (
          <Typography variant="body2" color="textSecondary">
            Início: {new Date(task.start_date).toLocaleDateString('pt-BR')}
          </Typography>
        )}

        {task.due_date && (
          <Typography variant="body2" color="textSecondary">
            Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}
          </Typography>
        )}

        {task.end_date && (
          <Typography variant="body2" color="textSecondary">
            Concluído em: {new Date(task.end_date).toLocaleDateString('pt-BR')}
          </Typography>
        )}

        {/* Renderize outros campos importantes, se necessário */}
        <Box mt={1}>
          <Typography variant="body2">
            Status: {task.status || 'Pendente'}
          </Typography>
          {task.assigned_to && (
            <Typography variant="body2">
              Responsável: {task.assigned_to}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

