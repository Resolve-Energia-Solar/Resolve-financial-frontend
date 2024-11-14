'use client';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
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

import LeadDetails from '../../leads/leadDetails/LeadDetails';
import LeadCard from './KanbanCard';
import SimpleBar from 'simplebar-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useLeadManager from '@/hooks/boards/useKanbanForm';
import EditLeadPage from '../../leads/Edit-lead';
import ProposalManager from '../../proposal';
import SaleListCards from '../../comercial/sale/components/salesList/cards';
import { KanbanDataContext } from '@/app/context/kanbancontext';
import ClicksignLogsPage from '../../notifications/clicksign';
import leadService from '@/services/leadService';
import LeadDialog from '../../leads/LeadDialog/LeadDialog';
import ColumnWithActions from './ColumnHeader';

const KanbanManager = ({
  addLead,
  leads,
  statuses,
  board,
  onUpdateLead,
  onAddLead,
  onDeleteLead,
  onUpdateLeadColumn,
  searchTerm,
  loadMoreLeads,
}) => {
  const theme = useTheme();
  const [editLead, setEditLead] = useState(false);
  const [openLeadModal, setOpenLeadModal] = useState(false);
  const { idSaleSuccess, setIdSaleSuccess } = useContext(KanbanDataContext);
  const [leadData, setLeadData] = useState({
    complete_name: '',
    contact_email: '',
    phone: '',
    origin_id: '',
    seller_id: null,
    sdr_id: null,
    addresses_ids: [],
  });

  const observerRef = useRef({});
  const [loadingColumns, setLoadingColumns] = useState({});

  const {
    leadsList,
    statusesList,
    selectedLead,
    openModal,
    setOpenModal,
    snackbarOpen,
    setSnackbarOpen,
    onDragEnd,
    handleLeadClick,
    setTabIndex,
    tabIndex,
    snackbarMessage,
    setSnackbarMessage,
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

  const filteredLeads = leadsList.filter((lead) =>
    (lead.name?.toLowerCase().trim() || '').includes(searchTerm.toLowerCase().trim()),
  );

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
        column_id: statusesList[0].id,
        board_id: board,
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

  const handleLoadMore = useCallback(
    async (statusId) => {
      if (loadingColumns[statusId]) return; // Evita chamadas simultâneas para a mesma coluna

      setLoadingColumns((prev) => ({ ...prev, [statusId]: true }));

      try {
        await loadMoreLeads(statusId);
      } catch (error) {
        console.error(`Erro ao carregar mais leads para a coluna ${statusId}:`, error);
      } finally {
        setLoadingColumns((prev) => ({ ...prev, [statusId]: false }));
      }
    },
    [loadingColumns, loadMoreLeads],
  );

  const createObserver = useCallback(
    (statusId) => {
      return new IntersectionObserver(
        async (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !loadingColumns[statusId]) {
            console.log(`Carregando mais leads para coluna ${statusId}`);
            await handleLoadMore(statusId);
          }
        },
        { root: null, rootMargin: '200px', threshold: 0.1 },
      );
    },
    [handleLoadMore, loadingColumns],
  );

  useEffect(() => {
    statusesList.forEach((status) => {
      if (!observerRef.current[status.id]) {
        observerRef.current[status.id] = createObserver(status.id);
      }
    });

    return () => {
      Object.values(observerRef.current).forEach((observer) => observer.disconnect());
    };
  }, [statusesList, createObserver]);

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
                      maxHeight: '75vh',
                      backgroundColor: statusColors[status.name] || statusColors.default,
                      paddingX: '10px',
                      minHeight: '25vh',
                      overflowY: 'auto',
                      borderRadius: 2,
                      boxShadow: theme.shadows[1],
                      position: 'relative',
                    }}
                  >
                    <ColumnWithActions
                      columnTitle={status.name}
                      statusId={status.id}
                      boardId={board}
                      onUpdateLeadColumn={onUpdateLeadColumn}
                      leads={filteredLeads}
                      onAddLead={onAddLead}
                      addLead={addLead}
                      statusColors={statusColors}
                    />

                    {filteredLeads
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

                    <Box
                      ref={(el) => {
                        if (el && observerRef.current[status.id]) {
                          observerRef.current[status.id].observe(el);
                        }
                      }}
                      sx={{ height: '20px', backgroundColor: 'transparent' }}
                    >
                      {loadingColumns[status.id] && 'Carregando...'}
                    </Box>

                    {filteredLeads.filter((lead) => lead.column.id === status.id).length === 0 && (
                      <Box
                        onClick={() => handleOpenLeadModal(status.id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100px',
                          border: '2px dashed',
                          borderColor: theme.palette.grey[400],
                          borderRadius: 2,
                          cursor: 'pointer',
                          mt: 2,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        + Adicionar Novo Lead
                      </Box>
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ))}
          </Box>
        </DragDropContext>
        <LeadDialog
          openLeadModal={openLeadModal}
          handleCloseLeadModal={handleCloseLeadModal}
          handleSaveLead={handleSaveLead}
          leadData={leadData}
          setLeadData={setLeadData}
        />
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
                    <Tab label="Atividades" />
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
                  {tabIndex === 4 && 'Atividades'}
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

export default KanbanManager;
