import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { MoreVert, Add } from '@mui/icons-material';
import leadService from '@/services/leadService';

const ColumnWithActions = ({ columnTitle, leads, statusId, boardId, onUpdateLeadColumn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLeadModal, setOpenLeadModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [leadData, setLeadData] = useState({
    complete_name: '',
    contact_email: '',
    phone: '',
    first_document: '',
    second_document: '',
    type: '',
    birth_date: '',
    gender: '',
    origin: '',
  });
  const [columnName, setColumnName] = useState(columnTitle);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const leadsCount = leads ? leads.filter((lead) => lead.column.id === statusId).length : 0;

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenLeadModal = () => {
    setOpenLeadModal(true);
  };

  const handleCloseLeadModal = () => {
    setOpenLeadModal(false);
    setLeadData({
      complete_name: '',
      contact_email: '',
      phone: '',
      first_document: '',
      second_document: '',
      type: '',
      birth_date: '',
      gender: '',
      origin: '',
    });
  };

  const handleSaveLead = async () => {
    try {
      const newLeadData = {
        name: leadData.complete_name || '',
        contact_email: leadData.contact_email || '',
        phone: leadData.phone || '',
        first_document: leadData.first_document || null,
        second_document: leadData.second_document || null,
        type: leadData.type || null,
        birth_date: leadData.birth_date || null,
        gender: leadData.gender || null,
        origin: leadData.origin || null,
        seller_id: leadData.seller_id || null,
        sdr_id: leadData.sdr_id || null,
        addresses_ids: leadData.addresses_ids || [],
        column_id: statusId,
        board_id: boardId,
      };

      await leadService.createLead(newLeadData);
      setSnackbarOpen(true);
      setSnackbarMessage('Lead adicionado com sucesso!');
      handleCloseLeadModal();
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      if (error.response && error.response.data) {
        console.error('Detalhes do erro:', error.response.data);
        setSnackbarMessage(`Erro ao adicionar lead: ${JSON.stringify(error.response.data)}`);
      } else {
        setSnackbarMessage('Erro ao adicionar lead. Tente novamente.');
      }
      setSnackbarOpen(true);
    }
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveEditColumn = async () => {
    try {
      await onUpdateLeadColumn(statusId, columnName);
      setOpenEditModal(false);
      setSnackbarMessage('Coluna atualizada com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao editar nome da coluna:', error);
      if (error.response && error.response.data) {
        setSnackbarMessage(`Erro ao atualizar a coluna: ${error.response.data.message}`);
      } else {
        setSnackbarMessage('Erro ao atualizar a coluna. Tente novamente.');
      }
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ padding: '6px', borderRadius: '8px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            {columnTitle}{' '}
            <Typography variant="caption" fontWeight={500}>
              ({leadsCount})
            </Typography>
          </Typography>

          <Box display="flex" alignItems="center">
            <Tooltip title="Novo Lead" arrow>
              <IconButton onClick={handleOpenLeadModal}>
                <Add />
              </IconButton>
            </Tooltip>

            <IconButton onClick={handleOpenMenu}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              disableEnforceFocus
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={() => handleOpenEditModal()}>Editar status</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      <Dialog open={openLeadModal} onClose={handleCloseLeadModal}>
        <DialogTitle>Adicionar Lead</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Lead"
            fullWidth
            value={leadData.complete_name}
            onChange={(e) => setLeadData({ ...leadData, complete_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email do Lead"
            fullWidth
            value={leadData.contact_email}
            onChange={(e) => setLeadData({ ...leadData, contact_email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefone do Lead"
            fullWidth
            value={leadData.phone}
            onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeadModal}>Cancelar</Button>
          <Button
            onClick={handleSaveLead}
            disabled={!leadData.complete_name || !leadData.contact_email || !leadData.phone}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Editar Nome da Coluna</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Coluna"
            fullWidth
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancelar</Button>
          <Button onClick={handleSaveEditColumn} disabled={!columnName}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ColumnWithActions;
