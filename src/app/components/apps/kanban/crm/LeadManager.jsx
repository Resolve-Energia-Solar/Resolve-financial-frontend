import React, { useState } from 'react';
import {
  Box,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Alert,
  Grid,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';

import LeadDetails from './LeadDetails';
import LeadCard from './LeadCard';
import SimpleBar from 'simplebar-react';
import ColumnWithActions from './LeadHeader';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useLeadManager from '@/hooks/boards/useLeadManager';
import ProposalManager from './ProposalManager';
import EditLeadPage from '../../leads/Edit-lead';

const LeadManager = ({
  leads,
  statuses,
  board,
  onUpdateLead,
  onAddLead,
  onDeleteLead,
  onUpdateLeadColumn,
}) => {
  const theme = useTheme();
  const [editLead, setEditLead] = useState(false);

  const {
    leadsList,
    statusesList,
    leadData,
    setLeadData,
    selectedLead,
    openModal,
    setOpenModal,
    editMode,
    setEditMode,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
    handleUpdateLead,
    onDragEnd,
    handleLeadClick,
    setTabIndex,
    tabIndex,
    sellers,
    sdrs,
    allUsers,
    addresses,
    managers,
    supervisors,
    branches,
    campaigns,
    sales,
    proposals,
  } = useLeadManager(leads, statuses, {
    onUpdateLead,
    onAddLead,
    onDeleteLead,
  });

  const statusColors = {
    'Novo Lead': theme.palette.info.light,
    'Primeiro Contato': theme.palette.warning.light,
    'Terceiro Contato': theme.palette.primary.light,
    'Quarto Contato': theme.palette.success.light,
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
                      backgroundColor: statusColors[status.name] || theme.palette.grey[200],
                      p: 2,
                      maxHeight: '80vh',
                      overflowY: 'auto',
                      borderRadius: 2,
                      boxShadow: theme.shadows[1],
                    }}
                  >
                    <ColumnWithActions
                      columnTitle={status.name}
                      statusId={status.id}
                      boardId={board}
                      onUpdateLeadColumn={onUpdateLeadColumn}
                      leads={leadsList}
                      onAddLead={onAddLead}
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Tabs
                    value={tabIndex}
                    onChange={(_e, newValue) => setTabIndex(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab label="Lead" />
                    <Tab label="Proposta" />
                  </Tabs>
                </Box>

                <Box mt={2}>
                  {tabIndex === 0 && (
                    <>
                      <LeadDetails selectedLead={selectedLead} />
                      <Button variant="contained" color="primary" onClick={() => setEditLead(true)}>
                        Editar
                      </Button>
                    </>
                  )}
                  {tabIndex === 1 && (
                    <ProposalManager
                      proposals={proposals}
                      managers={managers}
                      supervisors={supervisors}
                      sellers={sellers}
                      sdrs={sdrs}
                      allUsers={allUsers}
                      branches={branches}
                      campaigns={campaigns}
                      leadData={leadsList}
                      sales={sales}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
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

      {/* Modal de edição de lead */}
      <Dialog open={editLead} onClose={() => setEditLead(false)} fullWidth maxWidth="xl">
        <DialogContent>
          <EditLeadPage leadId={selectedLead?.id} onClosedModal={() => setEditLead(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadManager;
