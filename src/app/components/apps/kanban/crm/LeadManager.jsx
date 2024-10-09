import React from 'react';
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
import LeadDetails from './LeadDetails';
import LeadForm from './LeadForm';
import LeadCard from './LeadCard';
import SimpleBar from 'simplebar-react';
import ColumnWithActions from './leadHeader';
import GenerateProposalModal from './GenerateProposal';
import GenerateProjectModal from './GenerateProject';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useLeadManager from '@/hooks/boards/useLeadManager';

const LeadManager = ({
  leads,
  statuses,
  board,
  onUpdateLead,
  onAddLead,
  onDeleteLead,
  onUpdateLeadColumn,
}) => {
  const {
    leadsList,
    statusesList,
    leadData,
    setLeadData,
    selectedLead,
    setSelectedLead,
    openModal,
    setOpenModal,
    editMode,
    setEditMode,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
    handleUpdateLead,
    handleUpdateColumnName,
    handleDeleteLead,
    onDragEnd,
    handleLeadClick,
    setTabIndex,
    tabIndex,
    openProposalModal,
    setOpenProposalModal,
    openProjectModal,
    setOpenProjectModal,
    anchorEl,
    setAnchorEl,
  } = useLeadManager(leads, statuses, {
    onUpdateLead,
    onAddLead,
    onDeleteLead,
    onUpdateLeadColumn,
  });

  const activateEditMode = () => {
    setEditMode(true);
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
                    {leadsList
                      .filter((lead) => lead.column.id === status.id)
                      .map((lead, index) => (
                        <Draggable draggableId={lead.id.toString()} index={index} key={lead.id}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              mb={2}
                            >
                              <LeadCard lead={lead} handleLeadClick={handleLeadClick} />
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
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="lg">
          <DialogTitle>{editMode ? 'Editar Lead' : 'Detalhes do Lead'}</DialogTitle>
          <Divider />
          <DialogContent>
            {editMode ? (
              <LeadForm leadData={leadData} setLeadData={setLeadData} />
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Tabs value={tabIndex} onChange={(_e, newValue) => setTabIndex(newValue)}>
                    <Tab label="Lead" />
                    <Tab label="Vendas" />
                    <Tab label="Tarefas" />
                    <Tab label="Atividades" />
                  </Tabs>

                  <Box mt={2}>
                    {tabIndex === 0 && <LeadDetails selectedLead={selectedLead} />}
                    {tabIndex === 1 && (
                      <Typography variant="body1">Conteúdo das Propostas...</Typography>
                    )}
                    {tabIndex === 2 && (
                      <Typography variant="body1">Conteúdo das Tarefas...</Typography>
                    )}
                    {tabIndex === 3 && (
                      <Typography variant="body1">Conteúdo das Atividades...</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
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
              <>
                <Button onClick={() => setOpenModal(false)} color="primary" variant="contained">
                  Fechar
                </Button>
                <Button onClick={activateEditMode} color="primary" variant="outlined">
                  Editar
                </Button>
              </>
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

export default LeadManager;
