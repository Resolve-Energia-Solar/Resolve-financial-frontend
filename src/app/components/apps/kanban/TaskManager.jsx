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
  Menu,
  MenuItem,
  Alert,
  Grid,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { Edit, Business, Description } from '@mui/icons-material';
import LeadDetails from './LeadDetails';
import LeadForm from './LeadForm';
import LeadCard from './LeadCard';
import SimpleBar from 'simplebar-react';
import ColumnWithActions from './leadHeader';
import { supabase } from '@/utils/supabaseClient';
import GenerateProposalModal from './GenerateProposal';
import GenerateProjectModal from './GenerateProject';
import TaskCard from './TaskCard';

const TaskManager = ({ leads = [], statuses = [], onUpdateLeadColumn, board }) => {
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
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchLeadsAndStatuses = async () => {
      try {
        let leadsData;
  
        // Define a tabela com base no tipo de board
        const table = board === 1 ? 'leads' : 'project_tasks';
  
        // Busca os dados dos leads ou project_tasks
        const { data: leadsTableData, error: leadsTableError } = await supabase
          .from(table)
          .select('*')
          .eq('board_id', board);
        if (leadsTableError) throw leadsTableError;
  
        leadsData = leadsTableData;
  
        // Busca os dados das colunas
        const { data: columnsData, error: columnsError } = await supabase
          .from('columns')
          .select('*')
          .eq('board_id', board);
        if (columnsError) throw columnsError;
  
        // Ordena as colunas pela posição
        const sortedColumns = columnsData.sort((a, b) => a.position - b.position);
  
        // Atualiza os estados com os leads e as colunas ordenadas
        setLeadsList(leadsData);
        setStatusesList(sortedColumns);
      } catch (error) {
        console.error('Erro ao buscar leads e colunas:', error);
      }
    };
  
    // Chama a função ao carregar o componente ou quando 'board' mudar
    fetchLeadsAndStatuses();
  }, [board]);
  

  useEffect(() => {
    const fetchUsersAndAddresses = async () => {
      try {
        const { data: users } = await supabase.from('users').select('*');
        const { data: addressData } = await supabase.from('addresses').select('*');

        setSellers(users.filter((user) => user.role === 'seller'));
        setSdrs(users.filter((user) => user.role === 'sdr'));
        setAddresses(addressData);
      } catch (error) {
        console.error('Erro ao buscar vendedores, SDRs e endereços:', error);
      }
    };
    fetchUsersAndAddresses();
  }, []);

  const onAddLead = async (newLeadData) => {
    try {
      const { data: newLead, error } = await supabase.from('leads').insert([newLeadData]).select();

      if (error) throw error;

      if (newLead && newLead.length > 0) {
        setLeadsList((prevLeads) => [...prevLeads, newLead[0]]);
        setSnackbarMessage('Lead adicionado com sucesso!');
      } else {
        throw new Error('Nenhum dado foi retornado após a inserção do lead.');
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      setSnackbarMessage('Erro ao adicionar lead.');
      setSnackbarOpen(true);
    }
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

      try {
        const { error } = await supabase
          .from('leads')
          .update(updatedLead)
          .eq('id', selectedLead.id);

        if (error) throw error;

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

  const handleUpdateColumnName = async (statusId, newColumnName) => {
    try {
      const { error } = await supabase
        .from('columns')
        .update({ name: newColumnName })
        .eq('id', statusId);

      if (error) throw error;

      setStatusesList((prevStatuses) =>
        prevStatuses.map((status) =>
          status.id === statusId ? { ...status, name: newColumnName } : status,
        ),
      );

      setSnackbarMessage('Coluna atualizada com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao atualizar a coluna:', error);
      setSnackbarMessage('Erro ao atualizar a coluna.');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteLead = async () => {
    if (selectedLead) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', selectedLead.id);
        if (error) throw error;

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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      try {
        const { error } = await supabase
          .from('leads')
          .update({ columns: destination.droppableId })
          .eq('id', draggableId);
        if (error) throw error;

        setLeadsList((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === parseInt(draggableId)
              ? { ...lead, columns: parseInt(destination.droppableId) }
              : lead,
          ),
        );
        setSnackbarMessage('Lead movido com sucesso!');
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage('Erro ao mover o lead.');
        setSnackbarOpen(true);
      }
    }
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
      addresses: lead.addresses || [],
      column: {
        name: lead.column?.name || 'N/A',
      },
    });

    setTabIndex(0);
    setOpenModal(true);
  };

  const getLeadsByStatus = (statusId) => {
    return leadsList.filter((lead) => lead.columns === statusId);
  };

  const handleTabChange = (newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <SimpleBar>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box display="flex" gap={2}>
            {statusesList.map((status) => (
              <Droppable droppableId={status.id.toString()} key={status.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minWidth: '300px',
                      backgroundColor: '#f5f5f5',
                      p: 2,
                      maxHeight: '80vh',
                      overflowY: 'auto',
                      borderRadius: 2,
                    }}
                  >
                    <ColumnWithActions
                      key={status.id}
                      columnTitle={status.name}
                      statusId={status.id}
                      boardId={board}
                      onEditStatus={handleUpdateColumnName}
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
                            mb={2}
                          >
                            {board === 1 ? (
                              <LeadCard
                                lead={lead}
                                leadStars={leadStars}
                                handleLeadClick={handleLeadClick}
                              />
                            ) : (
                              <TaskCard task={lead} />
                            )}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ))}
          </Box>
        </DragDropContext>
      </SimpleBar>

      {selectedLead && (
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="lg">
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
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="Lead" />
                    <Tab label="Vendas" />
                    <Tab label="Tarefas" />
                    <Tab label="Atividades" />
                  </Tabs>
                  <Divider />
                  <Box mt={2}>
                    {tabIndex === 0 && <LeadDetails selectedLead={selectedLead} />}
                    {tabIndex === 1 && (
                      <Typography variant="body1">Conteúdo das Proposta...</Typography>
                    )}
                    {tabIndex === 2 && (
                      <Typography variant="body1">Conteúdo das Tarefas...</Typography>
                    )}
                    {tabIndex === 3 && (
                      <Typography variant="body1">Conteúdo das Atividades...</Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ position: 'sticky', top: 20 }}>
                    <Typography variant="h6" gutterBottom>
                      Ações Rápidas
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => setEditMode(true)}
                      >
                        Editar Lead
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Business />}
                        onClick={() => setOpenProjectModal(true)}
                      >
                        Gerar Projeto
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Description />}
                        onClick={() => setOpenProposalModal(true)}
                      >
                        Gerar Venda
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <Divider />
          <DialogActions>
            {editMode ? (
              <>
                <Button onClick={handleUpdateLead} color="primary" variant="contained">
                  Salvar
                </Button>
                <Button onClick={() => setEditMode(false)} color="secondary" variant="outlined">
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setOpenModal(false)} color="primary" variant="contained">
                Fechar
              </Button>
            )}
          </DialogActions>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => console.log('Enviar Email')}>Enviar Email</MenuItem>
            <MenuItem onClick={() => console.log('Adicionar Nota')}>Adicionar Nota</MenuItem>
            <MenuItem onClick={handleDeleteLead}>Excluir Lead</MenuItem>
          </Menu>
        </Dialog>
      )}

      <GenerateProposalModal
        open={openProposalModal}
        onClose={() => setOpenProposalModal(false)}
        sellers={sellers}
        lead={selectedLead}
      />
      <GenerateProjectModal
        open={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
        lead={selectedLead}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarMessage.includes('Erro') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TaskManager;
