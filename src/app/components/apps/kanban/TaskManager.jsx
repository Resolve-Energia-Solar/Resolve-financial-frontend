'use client';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  TextField,
  Alert,
} from '@mui/material';
import {
  Star,
  StarBorder,
  Email,
  Phone,
  AccessTime,
  Edit,
  Delete,
  Store,
  Timeline,
  AddCircle,
  MoreVert,
} from '@mui/icons-material';
import SimpleBar from 'simplebar-react';

const TaskManager = ({
  leads = [],
  statuses = [],
  onUpdateLeadColumn,
  onUpdateLead,
  onDeleteLead,
}) => {
  const [leadStars, setLeadStars] = useState(() => {
    const initialStars = {};
    leads.forEach((lead) => {
      initialStars[lead.id] = lead.stars || 0;
    });
    return initialStars;
  });
  const [selectedLead, setSelectedLead] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleStarClick = (leadId, stars) => {
    setLeadStars((prevStars) => ({
      ...prevStars,
      [leadId]: stars,
    }));
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setLeadName(lead.name);
    setLeadEmail(lead.contact_email);
    setLeadPhone(lead.phone);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLead(null);
    setEditMode(false);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getLeadsByStatus = (statusId) => {
    return leads.filter((lead) => lead.column.id === statusId);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      onUpdateLeadColumn(draggableId, destination.droppableId);
    }
  };

  const getColumnBackgroundColor = (statusName) => {
    switch (statusName.toLowerCase()) {
      case 'lead novo':
        return '#e0f7fa';
      case 'primeiro contato':
        return '#fff3e0';
      case 'segundo contato':
        return '#f1f8e9';
      default:
        return '#f5f5f5';
    }
  };

  const handleUpdateLead = async () => {
    if (selectedLead) {
      const updatedLead = {
        ...selectedLead, 
        name: leadName.trim(),
        contact_email: leadEmail.trim(),
        phone: leadPhone.trim(),
        column: selectedLead.column.id, // Garante que estamos enviando apenas o ID da coluna
      };
  
      console.log('selectedLead:', selectedLead);
      console.log('Dados enviados para a API de atualização:', updatedLead);
  
      try {
        await onUpdateLead(updatedLead); // Função que faz a atualização do lead
        setSnackbarMessage('Lead atualizado com sucesso!');
        setSnackbarOpen(true);
        handleCloseModal(); // Fecha o modal após a atualização
      } catch (error) {
        setSnackbarMessage('Erro ao atualizar lead.');
        setSnackbarOpen(true);
        console.error('Erro ao atualizar lead:', error);
      }
    }
  };
  

  const handleDeleteLead = async () => {
    if (selectedLead) {
      try {
        await onDeleteLead(selectedLead.id);
        setSnackbarMessage('Lead excluído com sucesso!');
        setSnackbarOpen(true);
        handleCloseModal();
      } catch (error) {
        setSnackbarMessage('Erro ao excluir lead.');
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <SimpleBar>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box display="flex" gap={2}>
            {statuses.map((status) => (
              <Droppable droppableId={status.id.toString()} key={status.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minWidth: '300px',
                      backgroundColor: getColumnBackgroundColor(status.name),
                      p: 2,
                      maxHeight: '80vh',
                      overflowY: 'auto',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {status.name}
                    </Typography>

                    {getLeadsByStatus(status.id).map((lead, index) => (
                      <Draggable draggableId={lead.id.toString()} index={index} key={lead.id}>
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 2,
                              mb: 2,
                              backgroundColor: snapshot.isDragging ? '#e0f7fa' : 'white',
                              transition: 'background-color 0.2s ease',
                            }}
                            onClick={() => handleLeadClick(lead)}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="h6">{lead.name}</Typography>
                              <Box display="flex" alignItems="center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <IconButton
                                    key={star}
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStarClick(lead.id, star);
                                    }}
                                  >
                                    {leadStars[lead.id] >= star ? (
                                      <Star sx={{ color: 'gold', fontSize: '1rem' }} />
                                    ) : (
                                      <StarBorder sx={{ color: 'grey', fontSize: '1rem' }} />
                                    )}
                                  </IconButton>
                                ))}
                              </Box>
                            </Box>

                            <Box display="flex" alignItems="center" mt={1}>
                              <Email sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
                              <Typography variant="body2">{lead.contact_email}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mt={1}>
                              <Phone sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
                              <Typography variant="body2">{lead.phone}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mt={1}>
                              <AccessTime sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
                              <Typography variant="caption" color="textSecondary">
                                Criado em: {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                              </Typography>
                            </Box>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ))}
          </Box>
        </DragDropContext>
      </SimpleBar>

      {selectedLead && (
        <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
          <DialogTitle>{editMode ? 'Editar Lead' : 'Detalhes do Lead'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Nome"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                  />
                ) : (
                  <Typography variant="h6">Nome: {selectedLead.name}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                  />
                ) : (
                  <Typography variant="body1">Email: {selectedLead.contact_email}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                  />
                ) : (
                  <Typography variant="body1">Telefone: {selectedLead.phone}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Criado em: {new Date(selectedLead.created_at).toLocaleDateString('pt-BR')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Status: {selectedLead.column.name}</Typography>
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="space-between">
                <Tooltip title="Editar Lead">
                  <IconButton onClick={() => setEditMode(true)}>
                    <Edit color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Fluxo Atual">
                  <IconButton>
                    <Timeline color="action" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Atividades">
                  <IconButton>
                    <AddCircle color="secondary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Loja">
                  <IconButton>
                    <Store color="success" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ações Rápidas">
                  <IconButton onClick={handleOpenMenu}>
                    <MoreVert />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {editMode ? (
              <>
                <Button onClick={handleUpdateLead} color="primary">
                  Salvar
                </Button>
                <Button onClick={() => setEditMode(false)} color="secondary">
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={handleCloseModal} color="primary">
                Fechar
              </Button>
            )}
          </DialogActions>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={() => console.log('Enviar Email')}>Enviar Email</MenuItem>
            <MenuItem onClick={() => console.log('Adicionar Nota')}>Adicionar Nota</MenuItem>
          </Menu>
        </Dialog>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes('Erro') ? 'error' : 'success'}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TaskManager;
