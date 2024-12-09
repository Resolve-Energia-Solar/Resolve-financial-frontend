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
  LinearProgress,
} from '@mui/material';
import { MoreVert, Add } from '@mui/icons-material';
import leadService from '@/services/leadService';
import LeadDialog from '../../leads/LeadDialog/LeadDialog';
import { useTheme } from '@mui/material/styles';

const ColumnWithActions = ({
  columnTitle,
  leads,
  statusId,
  boardId,
  collumnValue,
  onUpdateLeadColumn,
  addLead,
  statusColors,
  isLeadOverdue,
  status,
}) => {
  const theme = useTheme();

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
    gender: '',
    funnel: '',
    qualification: '',
    kwp: '',
    byname: '',
    first_document: '',
    second_document: '',
    birth_date: '',
  });

  const [columnName, setColumnName] = useState(columnTitle);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const getTimeIconColor = (lead) => {
    if (isLeadOverdue(lead, status)) {
      return theme.palette.error.main;
    }
    if (status === 'Primeiro Contato') {
      return theme.palette.warning.main;
    }
    return theme.palette.text.secondary;
  };

  const leadsCount = leads.filter((lead) => lead.column.id === statusId).length;
  const onTimeLeads = leads.filter(
    (lead) => lead.column.id === statusId && !isLeadOverdue(lead, status),
  ).length;
  const overdueLeads = leadsCount - onTimeLeads;

  const onTimePercentage = leadsCount > 0 ? (onTimeLeads / leadsCount) * 100 : 0;

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenLeadModal = () => setOpenLeadModal(true);
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

  console.log('leads', statusId, boardId);
  const handleSaveLead = async () => {
    try {
      const newLeadData = {
        name: leadData.complete_name || '',
        byname: leadData.byname || '',
        contact_email: leadData.contact_email || '',
        phone: leadData.phone || '',
        gender: leadData.gender || '',
        funnel: leadData.funnel || '',
        qualification: leadData.qualification !== '' ? Number(leadData.qualification) : null,
        kwp: leadData.kwp !== '' ? parseFloat(leadData.kwp) : null,
        first_document: leadData.first_document || '',
        second_document: leadData.second_document || '',
        birth_date: leadData.birth_date || null,
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
      <Box
        sx={{
          width: '100%',
          minHeight: '50px',
          padding: '5px',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          marginTop: '10px',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          backgroundColor: statusColors[status] || statusColors.default,
        }}
      >
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
                <Add sx={{ color: getTimeIconColor({ status }) }} />
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleOpenMenu}>
              <MoreVert sx={{ color: theme.palette.text.secondary }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem onClick={() => setOpenEditModal(true)}>Editar status</MenuItem>
            </Menu>
          </Box>
        </Box>

        <LeadDialog
          openLeadModal={openLeadModal}
          handleCloseLeadModal={handleCloseLeadModal}
          handleSaveLead={handleSaveLead}
          leadData={leadData}
          setLeadData={setLeadData}
        />

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

        <Box mt={1}>
          <LinearProgress
            variant="determinate"
            value={onTimePercentage}
            sx={{
              height: '8px',
              borderRadius: '4px',
              backgroundColor: '#f44336',
              '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' },
            }}
          />
          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" color="success.main">
              No prazo: {onTimeLeads}
            </Typography>
            <Typography variant="caption" color="error.main">
              Atrasados: {overdueLeads}
            </Typography>
          </Box>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle2">
            Valor total de propostas:{' '}
            <strong>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                collumnValue,
              )}
            </strong>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ColumnWithActions;
