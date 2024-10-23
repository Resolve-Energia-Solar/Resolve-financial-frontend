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
} from '@mui/material';

import LeadDetails from './LeadDetails';
import LeadForm from './LeadForm';
import LeadCard from './LeadCard';
import SimpleBar from 'simplebar-react';
import ColumnWithActions from './LeadHeader';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useLeadManager from '@/hooks/boards/useLeadManager';
import SaleManager from './SaleManager';
import ProjectManager from './ProjectManager';

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
    designers,
    managers,
    supervisors,
    branches,
    campaigns,
    sales,
  } = useLeadManager(leads, statuses, {
    onUpdateLead,
    onAddLead,
    onDeleteLead,
  });

  const activateEditMode = () => {
    setEditMode(true);
  };

  const statusColors = {
    'Novo Lead': '#ecf2ff',
    'Primeiro Contato': '#fef5e5',
    'Terceiro Contato': '#e8f7ff',
    'Quarto Contato': '#e6fffa',
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
                      backgroundColor: statusColors[status.name] || '#f5f5f5',

                      p: 2,
                      maxHeight: '80vh',
                      overflowY: 'auto',
                      borderRadius: 2,
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
            {editMode ? (
              <LeadForm
                leadData={leadData}
                setLeadData={setLeadData}
                sellers={sellers}
                sdrs={sdrs}
                addresses={addresses.results}
                snackbarMessage={snackbarMessage}
                snackbarOpen={snackbarOpen}
                setSnackbarOpen={setSnackbarOpen}
              />
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Tabs value={tabIndex} onChange={(_e, newValue) => setTabIndex(newValue)}>
                      <Tab label="Lead" />
                      <Tab label="Vendas" />
                      <Tab label="Projetos" />
                    </Tabs>
                  </Box>

                  <Box mt={2}>
                    {tabIndex === 0 && <LeadDetails selectedLead={selectedLead} />}
                    {tabIndex === 1 && (
                      <SaleManager
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
                    {tabIndex === 2 && (
                      <ProjectManager
                        designers={designers}
                        managers={managers}
                        sellers={sellers}
                        supervisors={supervisors}
                        addresses={addresses.results}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            {editMode ? (
              <>
                {tabIndex === 0 && (
                  <>
                    <Button onClick={handleUpdateLead} color="primary" variant="contained">
                      Salvar
                    </Button>
                    <Button onClick={() => setEditMode(false)} color="secondary" variant="outlined">
                      Cancelar
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                {tabIndex === 0 ? (
                  <>
                    <Button onClick={activateEditMode} color="primary" variant="outlined">
                      Editar
                    </Button>
                    <Button onClick={() => setOpenModal(false)} color="primary" variant="contained">
                      Fechar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setOpenModal(false)} color="primary" variant="contained">
                    Fechar
                  </Button>
                )}
              </>
            )}
          </DialogActions>
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
    </>
  );
};

export default LeadManager;
