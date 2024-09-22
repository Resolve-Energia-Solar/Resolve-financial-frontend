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
  Divider,
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
  Home,
  Badge,
  CalendarToday,
  AccountBox,
  AccountBalance,
  Work,
  Business,
  Tag,
  Description,
  Wc,
  Place,
} from '@mui/icons-material';
import SimpleBar from 'simplebar-react';
import AddressService from '@/services/addressService';

const removeEmptyFields = (data) => {
  return Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== ''));
};

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
  const [leadData, setLeadData] = useState({
    name: '',
    contact_email: '',
    phone: '',
    byname: '',
    first_document: '',
    second_document: '',
    birth_date: '',
    gender: '',
    origin: '',
    type: '',
    seller: '',
    sdr: '',
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [addressData, setAddressData] = useState({
    zip_code: '',
    country: '',
    state: '',
    city: '',
    neighborhood: '',
    street: '',
    number: '',
    complement: '',
  });

  const handleStarClick = (leadId, stars) => {
    setLeadStars((prevStars) => ({
      ...prevStars,
      [leadId]: stars,
    }));
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setLeadData({
      name: lead.name,
      contact_email: lead.contact_email,
      phone: lead.phone,
      byname: lead.byname || '',
      first_document: lead.first_document || '',
      second_document: lead.second_document || '',
      birth_date: lead.birth_date || '',
      gender: lead.gender || '',
      origin: lead.origin || '',
      type: lead.type || '',
      seller: lead.seller?.id || '',
      sdr: lead.sdr?.id || '',
    });
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

  const validateLeadData = (data) => {
    if (!data.name || !data.contact_email || !data.phone) {
      return false;
    }
    return true;
  };

  const handleUpdateLead = async () => {
    if (selectedLead) {
      const updatedLead = {
        ...selectedLead,
        ...leadData,
        column: selectedLead.column.id,
      };

      const cleanedLeadData = removeEmptyFields(updatedLead);

      if (!validateLeadData(cleanedLeadData)) {
        setSnackbarMessage('Preencha todos os campos obrigatórios.');
        setSnackbarOpen(true);
        return;
      }

      try {
        await onUpdateLead(cleanedLeadData);
        setSnackbarMessage('Lead atualizado com sucesso!');
        setSnackbarOpen(true);
        handleCloseModal();
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

  const handleOpenAddressModal = (e) => {
    e.stopPropagation();
    setOpenAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setOpenAddressModal(false);
    setAddressData({
      zip_code: '',
      country: '',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      number: '',
      complement: '',
    });
  };

  const handleAddAddress = async () => {
    if (selectedLead) {
      try {
        const addressPayload = {
          ...addressData,
          lead: selectedLead.id,
        };
        await AddressService.createAddress(addressPayload);
        setSnackbarMessage('Endereço adicionado com sucesso!');
        setSnackbarOpen(true);
        handleCloseAddressModal();
      } catch (error) {
        setSnackbarMessage('Erro ao adicionar endereço.');
        setSnackbarOpen(true);
        console.error('Erro ao adicionar endereço:', error);
      }
    }
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
          <Divider />
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Nome"
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <AccountBox fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="h6">{selectedLead.name}</Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Tipo de Pessoa"
                    select
                    value={leadData.type}
                    onChange={(e) => setLeadData({ ...leadData, type: e.target.value })}
                  >
                    <MenuItem value="PF">Pessoa Física</MenuItem>
                    <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
                  </TextField>
                ) : (
                  <Box display="flex" alignItems="center">
                    <Business fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="body1">
                      Tipo: {selectedLead.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Apelido"
                    value={leadData.byname}
                    onChange={(e) => setLeadData({ ...leadData, byname: e.target.value })}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Tag fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="body1">Apelido: {selectedLead.byname}</Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Documento Principal (CPF/CNPJ)"
                    value={leadData.first_document}
                    onChange={(e) => setLeadData({ ...leadData, first_document: e.target.value })}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Description fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="body1">
                      Documento Principal: {selectedLead.first_document || 'N/A'}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Documento Secundário (RG/IE)"
                    value={leadData.second_document}
                    onChange={(e) => setLeadData({ ...leadData, second_document: e.target.value })}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Badge fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="body1">
                      Documento Secundário: {selectedLead.second_document || 'N/A'}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    type="date"
                    value={leadData.birth_date}
                    onChange={(e) => setLeadData({ ...leadData, birth_date: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <CalendarToday fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="body1">
                      Data de Nascimento: {selectedLead.birth_date || 'N/A'}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Gênero"
                    select
                    value={leadData.gender}
                    onChange={(e) => setLeadData({ ...leadData, gender: e.target.value })}
                  >
                    <MenuItem value="M">Masculino</MenuItem>
                    <MenuItem value="F">Feminino</MenuItem>
                  </TextField>
                ) : (
                  <Box display="flex" alignItems="center">
                    <Wc fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="body1">
                      Gênero: {selectedLead.gender === 'M' ? 'Masculino' : 'Feminino'}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="E-mail"
                    value={leadData.contact_email}
                    onChange={(e) => setLeadData({ ...leadData, contact_email: e.target.value })}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Email fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="body1">E-mail: {selectedLead.contact_email}</Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Phone fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="body1">Telefone: {selectedLead.phone}</Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Origem"
                    value={leadData.origin}
                    onChange={(e) => setLeadData({ ...leadData, origin: e.target.value })}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Place fontSize="small" style={{ marginRight: 8 }} />
                    <Typography variant="body1">Origem: {selectedLead.origin || 'N/A'}</Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <CalendarToday fontSize="small" style={{ marginRight: 8 }} />
                  <Typography variant="body1">
                    Criado em: {new Date(selectedLead.created_at).toLocaleDateString('pt-BR')}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Badge fontSize="small" style={{ marginRight: 8 }} />
                  <Typography variant="body1">Status: {selectedLead.column.name}</Typography>
                </Box>
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
                <Tooltip title="Adicionar Endereço">
                  <IconButton onClick={handleOpenAddressModal}>
                    <Home color="primary" />
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
            <MenuItem onClick={handleDeleteLead}>Excluir Lead</MenuItem>
          </Menu>
        </Dialog>
      )}

      <Dialog open={openAddressModal} onClose={handleCloseAddressModal} fullWidth maxWidth="sm">
        <DialogTitle>Adicionar Endereço</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="CEP"
                fullWidth
                value={addressData.zip_code}
                onChange={(e) => setAddressData({ ...addressData, zip_code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="País"
                fullWidth
                value={addressData.country}
                onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Estado"
                fullWidth
                value={addressData.state}
                onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Cidade"
                fullWidth
                value={addressData.city}
                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Bairro"
                fullWidth
                value={addressData.neighborhood}
                onChange={(e) => setAddressData({ ...addressData, neighborhood: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Rua"
                fullWidth
                value={addressData.street}
                onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Número"
                fullWidth
                value={addressData.number}
                onChange={(e) => setAddressData({ ...addressData, number: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Complemento"
                fullWidth
                value={addressData.complement}
                onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddAddress} color="primary">
            Adicionar
          </Button>
          <Button onClick={handleCloseAddressModal} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

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
