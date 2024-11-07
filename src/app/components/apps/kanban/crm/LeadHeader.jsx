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
  Grid,
} from '@mui/material';
import { MoreVert, Add } from '@mui/icons-material';
import leadService from '@/services/leadService';
import AutoCompleteOrigin from '../../leads/auto-input-origin';
import AutoCompleteUser from '../../comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteAddresses from '../../comercial/sale/components/auto-complete/Auto-Input-Addresses';

const ColumnWithActions = ({
  columnTitle,
  leads,
  statusId,
  boardId,
  onUpdateLeadColumn,
  addLead,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLeadModal, setOpenLeadModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [leadData, setLeadData] = useState({
    complete_name: '',
    contact_email: '',
    phone: '',
    origin_id: '',
    seller_id: null,
    sdr_id: null,
    addresses_ids: [],
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
      origin_id: '',
      seller_id: null,
      sdr_id: null,
      addresses_ids: [],
    });
  };

  const handleSaveLead = async () => {
    try {
      const newLeadData = {
        name: leadData.complete_name || '',
        contact_email: leadData.contact_email || '',
        phone: leadData.phone || '',
        origin_id: leadData.origin_id || null,
        column_id: statusId,
        board_id: boardId,
        seller_id: typeof leadData.seller_id === 'number' ? leadData.seller_id : null,
        sdr_id: typeof leadData.sdr_id === 'number' ? leadData.sdr_id : null,
        addresses_ids: Array.isArray(leadData.addresses_ids) ? leadData.addresses_ids : [],
      };

      console.log('Enviando dados do lead:', newLeadData);

      const createdLead = await leadService.createLead(newLeadData);
      addLead(createdLead);

      setSnackbarMessage('Lead adicionado com sucesso!');
      setSnackbarOpen(true);
      handleCloseLeadModal();
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      setSnackbarMessage('Erro ao adicionar lead. Tente novamente.');
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
      setSnackbarMessage('Coluna atualizada com sucesso!');
      setSnackbarOpen(true);
      setOpenEditModal(false);
    } catch (error) {
      console.error('Erro ao editar nome da coluna:', error);
      setSnackbarMessage('Erro ao atualizar a coluna. Tente novamente.');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
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
              <MenuItem onClick={handleOpenEditModal}>Editar status</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      <Dialog open={openLeadModal} onClose={handleCloseLeadModal}>
        <DialogTitle sx={{ mb: 1 }}>Adicionar Lead</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                autoFocus
                label="Nome do Lead"
                fullWidth
                value={leadData.complete_name}
                onChange={(e) => setLeadData({ ...leadData, complete_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email do Lead"
                fullWidth
                value={leadData.contact_email}
                onChange={(e) => setLeadData({ ...leadData, contact_email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Telefone do Lead"
                fullWidth
                value={leadData.phone}
                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <AutoCompleteOrigin
                labeltitle="Origem do Lead"
                value={leadData.origin_id}
                onChange={(id) => setLeadData({ ...leadData, origin_id: id })}
                error={!!leadData.originError}
              />
            </Grid>
            <Grid item xs={12}>
              <AutoCompleteUser
                labeltitle="Vendedor"
                value={leadData.seller_id}
                onChange={(id) => setLeadData({ ...leadData, seller_id: id })}
              />
            </Grid>
            <Grid item xs={12}>
              <AutoCompleteUser
                labeltitle="SDR"
                value={leadData.sdr_id}
                onChange={(id) => setLeadData({ ...leadData, sdr_id: id })}
              />
            </Grid>
            <Grid item xs={12}>
              <AutoCompleteAddresses
                labeltitle="Endereço"
                value={leadData.addresses_ids}
                onChange={(ids) => setLeadData({ ...leadData, addresses_ids: ids })}
              />
            </Grid>
          </Grid>
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarMessage.includes('sucesso') ? 'success' : 'error'}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ColumnWithActions;
