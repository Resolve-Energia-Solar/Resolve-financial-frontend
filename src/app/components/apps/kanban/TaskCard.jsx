import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Assignment, Event, CheckCircle, Person, Business, Close } from '@mui/icons-material';
import { styled } from '@mui/system';

const AnimatedCard = styled(Card)({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  },
});

const TaskCard = ({ task }) => {
  const [open, setOpen] = useState(false);

  // Função para abrir o modal
  const handleTaskClick = () => {
    setOpen(true);
  };

  // Função para fechar o modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AnimatedCard onClick={handleTaskClick} sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Assignment sx={{ fontSize: '1rem', color: 'grey', verticalAlign: 'middle', mr: 1 }} />
            {task.projects?.sales?.customers.name || 'Tarefa'}
          </Typography>

          <Box display="flex" alignItems="center" mt={1}>
            <Business sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
            <Typography variant="body2">
              Contrato: {task.projects?.sales?.contract_number || 'Tarefa'}
            </Typography>
          </Box>

          {task.description && (
            <Box display="flex" alignItems="center" mt={1}>
              <Assignment sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Descrição: {task.description}
              </Typography>
            </Box>
          )}

          {task.start_date && (
            <Box display="flex" alignItems="center" mt={1}>
              <Event sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Início: {new Date(task.start_date).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          )}

          {task.due_date && (
            <Box display="flex" alignItems="center" mt={1}>
              <Event sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          )}

          {task.end_date && (
            <Box display="flex" alignItems="center" mt={1}>
              <CheckCircle sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Concluído em: {new Date(task.end_date).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          )}

          <Box mt={1}>
            <Box display="flex" alignItems="center">
              <CheckCircle sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2">Status: {task.status || 'Pendente'}</Typography>
            </Box>

            {task.assigned_to && (
              <Box display="flex" alignItems="center" mt={1}>
                <Person sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
                <Typography variant="body2">
                  Responsável: {task.assigned_to.name || task.assigned_to}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </AnimatedCard>

      {/* Modal com detalhes */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Detalhes da Tarefa
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            <Assignment sx={{ fontSize: '1rem', color: 'grey', verticalAlign: 'middle', mr: 1 }} />
            {task.projects?.sales?.customers.name || 'Tarefa'}
          </Typography>

          <Box display="flex" alignItems="center" mt={1}>
            <Business sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
            <Typography variant="body2">
              Contrato: {task.projects?.sales?.contract_number || 'Tarefa'}
            </Typography>
          </Box>

          {task.description && (
            <Box display="flex" alignItems="center" mt={1}>
              <Assignment sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Descrição: {task.description}
              </Typography>
            </Box>
          )}

          {task.start_date && (
            <Box display="flex" alignItems="center" mt={1}>
              <Event sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Início: {new Date(task.start_date).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          )}

          {task.due_date && (
            <Box display="flex" alignItems="center" mt={1}>
              <Event sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          )}

          {task.end_date && (
            <Box display="flex" alignItems="center" mt={1}>
              <CheckCircle sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Concluído em: {new Date(task.end_date).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          )}

          <Box mt={1}>
            <Box display="flex" alignItems="center">
              <CheckCircle sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2">Status: {task.status || 'Pendente'}</Typography>
            </Box>

            {task.assigned_to && (
              <Box display="flex" alignItems="center" mt={1}>
                <Person sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
                <Typography variant="body2">
                  Responsável: {task.assigned_to.name || task.assigned_to}
                </Typography>
              </Box>
            )}
          </Box>

          {task.client && (
            <Box display="flex" alignItems="center" mt={1}>
              <Person sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2">Cliente: {task.client.name}</Typography>
            </Box>
          )}

          {task.project && (
            <Box display="flex" alignItems="center" mt={1}>
              <Assignment sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
              <Typography variant="body2">Projeto: {task.project.title}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
