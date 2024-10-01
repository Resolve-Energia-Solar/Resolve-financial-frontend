import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const TaskCard = ({ task, handleTaskClick }) => {
  return (
    <Card onClick={() => handleTaskClick(task)} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {task.projects.sales.customers.name || 'Tarefa'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Contrato: {task.projects.sales.contract_number || 'Tarefa'}
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

        <Box mt={1}>
          <Typography variant="body2">Status: {task.status || 'Pendente'}</Typography>
          {task.assigned_to && (
            <Typography variant="body2">
              Responsável: {task.assigned_to.name || task.assigned_to}
            </Typography>
          )}
        </Box>

        {task.client && (
          <Box mt={1}>
            <Typography variant="body2">Cliente: {task.client.name}</Typography>
          </Box>
        )}

        {task.project && (
          <Box mt={1}>
            <Typography variant="body2">Projeto: {task.project.title}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
