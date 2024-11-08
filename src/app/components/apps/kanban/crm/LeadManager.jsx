import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
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
import useLeadManager from '@/hooks/boards/useKanbanForm';
import EditLeadPage from '../../leads/Edit-lead';
import ProposalManager from '../../proposal';
import SaleListCards from '../../comercial/sale/components/salesList/cards';
import { KanbanDataContext } from '@/app/context/kanbancontext';
import ClicksignLogsPage from '../../notifications/clicksign';

const LeadManager = ({
  addLead,
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

  const { idSaleSuccess, setIdSaleSuccess } = useContext(KanbanDataContext);

  const {
    leadsList,
    statusesList,
    selectedLead,
    openModal,
    setOpenModal,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
    onDragEnd,
    handleLeadClick,
    setTabIndex,
    tabIndex,
  } = useLeadManager(leads, statuses, {
    onUpdateLead,
    onAddLead,
    onDeleteLead,
  });

  useEffect(() => {
    if (idSaleSuccess !== null) {
      setTabIndex(2);
    }
  }, [idSaleSuccess]);

  const statusColors = {
    'Novo Lead': theme.palette.info.light,
    'Primeiro Contato': theme.palette.warning.light,
    'Terceiro Contato': theme.palette.secondary.light,
    'Quarto Contato': theme.palette.success.light,
    default: theme.palette.grey[200],
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
                      backgroundColor: statusColors[status.name] || statusColors.default,
                      paddingX: '10px',
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
                      addLead={addLead}
                      statusColors={statusColors}
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
          <DialogTitle>Detalhes do Lead</DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Tabs
                    value={tabIndex}
                    onChange={(_e, newValue) => setTabIndex(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab label="Lead" />
                    <Tab label="Proposta" />
                    <Tab label="Venda" />
                    <Tab label="Envios" />
                  </Tabs>
                </Box>

                <Box
                  mt={2}
                  sx={{
                    height: { xs: '80vh', md: '60vh' },
                    overflowY: 'auto',
                  }}
                >
                  {tabIndex === 0 && (
                    <>
                      <LeadDetails
                        selectedLead={selectedLead}
                        onUpdateLead={() => setEditLead(true)}
                      />
                    </>
                  )}
                  {tabIndex === 1 && <ProposalManager selectedLead={selectedLead} />}

                  {tabIndex === 2 && <SaleListCards leadId={selectedLead.id} />}
                  {tabIndex === 3 && <ClicksignLogsPage />}
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

      <Dialog open={editLead} onClose={() => setEditLead(false)} fullWidth maxWidth="xl">
        <DialogContent>
          <EditLeadPage leadId={selectedLead?.id} onClosedModal={() => setEditLead(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadManager;
