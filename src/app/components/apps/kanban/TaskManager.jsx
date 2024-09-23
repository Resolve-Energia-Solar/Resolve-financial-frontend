import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Edit,
  Timeline,
  AddCircle,
  Store,
  Home,
  MoreVert,
  Business,
  Description,
} from '@mui/icons-material';
import LeadDetails from './LeadDetails';
import LeadForm from './LeadForm';
import LeadCard from './LeadCard';
import SimpleBar from 'simplebar-react';
import ColumnWithActions from './leadHeader';
import leadService from '@/services/leadService';
import userService from '@/services/userService';
import AddressService from '@/services/addressService';
import GenerateProposalModal from './GenerateProposal';
import GenerateProjectModal from './GenerateProject';

const TaskManager = ({
  leads = [],
  statuses = [],
  onUpdateLeadColumn,
  onUpdateLead,
  onDeleteLead,
  board,
}) => {
  const [leadStars, setLeadStars] = useState({});
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
    addresses: [],
    column: {
      name: '',
    },
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [leadsList, setLeadsList] = useState(leads);
  const [statusesList, setStatusesList] = useState(statuses);
  const [sellers, setSellers] = useState([]);
  const [sdrs, setSdrs] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [openProposalModal, setOpenProposalModal] = useState(false);
  const [openProjectModal, setOpenProjectModal] = useState(false);

  useEffect(() => {
    setLeadsList(leads);
    setStatusesList(statuses);
    const initialStars = {};
    leads.forEach((lead) => {
      initialStars[lead.id] = lead.stars || 0;
    });
    setLeadStars(initialStars);
  }, [leads, statuses]);

  const supervisors = [
    { id: 1, complete_name: 'Supervisor 1', email: 'supervisor1@example.com' },
    { id: 2, complete_name: 'Supervisor 2', email: 'supervisor2@example.com' },
  ];

  const managers = [
    { id: 1, complete_name: 'Gerente 1', email: 'gerente1@example.com' },
    { id: 2, complete_name: 'Gerente 2', email: 'gerente2@example.com' },
  ];

  const branches = [
    {
      id: 1,
      name: 'Filial A',
      address: { city: 'São Paulo', state: 'SP', street: 'Rua A', number: 123 },
    },
    {
      id: 2,
      name: 'Filial B',
      address: { city: 'Rio de Janeiro', state: 'RJ', street: 'Rua B', number: 456 },
    },
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Campanha de Verão',
      start_datetime: '2023-06-01',
      end_datetime: '2023-08-31',
      description: 'Desconto especial de verão',
    },
    {
      id: 2,
      name: 'Campanha de Inverno',
      start_datetime: '2023-12-01',
      end_datetime: '2023-12-31',
      description: 'Desconto especial de inverno',
    },
  ];

  useEffect(() => {
    const fetchUsersAndAddresses = async () => {
      try {
        const { results: users } = await userService.getUser();
        const { results: addressData } = await AddressService.getAddress();

        const sellersData = users; /* .filter((user) => user.role === 'seller'); */
        const sdrsData = users; /* .filter((user) => user.role === 'sdr'); */

        setSellers(sellersData);
        setSdrs(sdrsData);
        setAddresses(addressData);
      } catch (error) {
        console.error('Erro ao buscar vendedores, SDRs e endereços:', error);
      }
    };
    fetchUsersAndAddresses();
  }, []);

  const onEditStatus = (statusId, columnName) => {
    setStatusesList((prevStatuses) =>
      prevStatuses.map((status) =>
        status.id === statusId ? { ...status, name: columnName } : status,
      ),
    );
  };

  const onAddLead = async (newLeadData) => {
    try {
      const newLead = await leadService.createLead(newLeadData);
      setLeadsList((prevLeads) => [...prevLeads, newLead]);
      setSnackbarMessage('Lead adicionado com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      setSnackbarMessage('Erro ao adicionar lead.');
      setSnackbarOpen(true);
    }
  };

  const handleStarClick = (leadId, stars) => {
    setLeadStars((prevStars) => ({
      ...prevStars,
      [leadId]: stars,
    }));
  };

  const handleLeadClick = (lead) => {
    setSelectedLead({
      ...lead,
      column: {
        name: lead.column?.name || 'N/A',
      },
    });

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
      addresses: lead.addresses || [],
      column: {
        name: lead.column?.name || 'N/A',
      },
    });

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLead(null);
    setEditMode(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUpdateLead = async () => {
    if (selectedLead) {
      const updatedLead = {
        ...selectedLead,
        ...leadData,
        column: selectedLead.column.id,
        seller: leadData.seller || null,
        sdr: leadData.sdr || null,
        addresses: leadData.addresses || [],
      };

      console.log('Dados limpos enviados para a API:', updatedLead);

      try {
        await onUpdateLead(updatedLead);
        setLeadsList((prevLeads) =>
          prevLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
        );
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

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteLead = async () => {
    if (selectedLead) {
      try {
        await onDeleteLead(selectedLead.id);
        setLeadsList((prevLeads) => prevLeads.filter((lead) => lead.id !== selectedLead.id));
        setSnackbarMessage('Lead excluído com sucesso!');
        setSnackbarOpen(true);
        handleCloseModal();
      } catch (error) {
        setSnackbarMessage('Erro ao excluir lead.');
        setSnackbarOpen(true);
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      setLeadsList((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === parseInt(draggableId)
            ? { ...lead, column: { id: parseInt(destination.droppableId) } }
            : lead,
        ),
      );

      onUpdateLeadColumn(draggableId, destination.droppableId);
    }
  };

  const getLeadsByStatus = (statusId) => {
    return leadsList.filter((lead) => lead.column.id === statusId);
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

  const handleOpenProposalModal = () => {
    setOpenProposalModal(true);
  };

  const handleOpenProjectModal = () => {
    setOpenProjectModal(true);
  };

  const handleCloseProposalModal = () => {
    setOpenProposalModal(false);
  };

  const handleCloseProjectModal = () => {
    setOpenProjectModal(false);
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
                    <ColumnWithActions
                      key={status.id}
                      columnTitle={status.name}
                      statusId={status.id}
                      boardId={board}
                      onEditStatus={onEditStatus}
                      leads={leadsList}
                      onAddLead={onAddLead}
                      position={status.position}
                    />
                    {getLeadsByStatus(status.id).map((lead, index) => (
                      <Draggable draggableId={lead.id.toString()} index={index} key={lead.id}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <LeadCard
                              lead={lead}
                              leadStars={leadStars}
                              handleLeadClick={handleLeadClick}
                              handleStarClick={handleStarClick}
                            />
                          </Box>
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
        <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
          <DialogTitle>{editMode ? 'Editar Lead' : 'Detalhes do Lead'}</DialogTitle>
          <Divider />
          <DialogContent>
            {editMode ? (
              <LeadForm
                leadData={leadData}
                setLeadData={setLeadData}
                sellers={sellers}
                sdrs={sdrs}
                addresses={addresses}
              />
            ) : (
              <LeadDetails selectedLead={selectedLead} />
            )}
            {!editMode && (
              <Box mt={2} display="flex" justifyContent="space-between">
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
                  <IconButton>
                    <Home color="primary" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Gerar Projeto">
                  <IconButton onClick={handleOpenProjectModal}>
                    <Business color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Gerar Proposta">
                  <IconButton onClick={handleOpenProposalModal}>
                    <Description color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ações Rápidas">
                  <IconButton onClick={handleOpenMenu}>
                    <MoreVert />
                  </IconButton>
                </Tooltip>
                <GenerateProposalModal
                  open={openProposalModal}
                  onClose={handleCloseProposalModal}
                  sellers={sellers}
                  supervisors={supervisors}
                  managers={managers}
                  branches={branches}
                  campaigns={campaigns}
                />
                <GenerateProjectModal
                  open={openProjectModal}
                  onClose={handleCloseProjectModal}
                  branches={branches}
                  managers={managers}
                />
              </Box>
            )}
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
