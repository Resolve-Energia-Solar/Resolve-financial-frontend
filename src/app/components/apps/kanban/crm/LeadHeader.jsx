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
} from '@mui/material';
import { MoreVert, Add } from '@mui/icons-material';

const ColumnWithActions = ({ columnTitle, leads, statusId, boardId, onAddLead, onEditStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLeadModal, setOpenLeadModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [columnName, setColumnName] = useState(columnTitle);

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
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
  };

  const handleSaveLead = async () => {
    try {
      const newLeadData = {
        name: leadName,
        contact_email: leadEmail,
        phone: leadPhone,
        column: statusId,
        board_id: boardId,
      };

      await onAddLead(newLeadData);
      handleCloseLeadModal();
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
    }
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setColumnName(columnTitle);
  };

  const handleSaveEditColumn = async () => {
    await onEditStatus(statusId, columnName);
    setOpenEditModal(false);
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
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
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
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email do Lead"
            fullWidth
            value={leadEmail}
            onChange={(e) => setLeadEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Telefone do Lead"
            fullWidth
            value={leadPhone}
            onChange={(e) => setLeadPhone(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeadModal}>Cancelar</Button>
          <Button onClick={handleSaveLead} disabled={!leadName || !leadEmail || !leadPhone}>
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
