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
import columnService from '@/services/boardCollunService';

const ColumnWithActions = ({
  columnTitle,
  leads,
  statusId,
  position,
  boardId,
  onAddLead,
  onClearLeads,
  onDeleteStatus,
  onEditStatus
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLeadModal, setOpenLeadModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [columnName, setColumnName] = useState(columnTitle);

  const leadsCount = leads.filter((lead) => lead.column.id === statusId).length;

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

  const handleSaveLead = () => {
    onAddLead({
      name: leadName,
      contact_email: leadEmail,
      phone: leadPhone,
      column: statusId,
    });
    handleCloseLeadModal();
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setColumnName(columnTitle);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedColumnData = {
        name: columnName,
        board: boardId,  
        position: position,
      };
  
      console.log('Dados enviados para API:', updatedColumnData);
      await columnService.updateColumn(statusId, updatedColumnData);
      onEditStatus(statusId, columnName);
      handleCloseEditModal();
    } catch (error) {
      console.error('Erro ao editar status:', error);
    }
  };
  

  const handleDeleteStatus = async () => {
    try {
      await columnService.deleteColumn(statusId);
      onDeleteStatus(statusId);
    } catch (error) {
      console.error('Erro ao excluir status:', error);
    }
  };

  const handleActionClick = (action) => {
    if (action === 'Editar Status') {
      handleOpenEditModal();
    } else if (action === 'Limpar todos os cartões') {
      onClearLeads(statusId);
    } else if (action === 'Excluir Status') {
      handleDeleteStatus();
    }
    handleCloseMenu();
  };

  return (
    <>
      <Box sx={{ padding: '10px', borderRadius: '8px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {columnTitle} (
            <Box
              component="span"
              sx={{
                display: 'inline-block',
              }}
            >
              {leadsCount}
            </Box>
            )
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
              <MenuItem onClick={() => handleActionClick('Editar Status')}>Editar status</MenuItem>
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
        <DialogTitle>Editar Status</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Status"
            fullWidth
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancelar</Button>
          <Button onClick={handleSaveEdit} disabled={!columnName}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ColumnWithActions;
