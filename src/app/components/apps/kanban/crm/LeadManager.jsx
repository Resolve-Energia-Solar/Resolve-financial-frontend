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
  IconButton,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DescriptionIcon from '@mui/icons-material/Description';
import LeadDetails from './LeadDetails';
import LeadForm from './LeadForm';
import LeadCard from './LeadCard';
import SimpleBar from 'simplebar-react';
import ColumnWithActions from './LeadHeader';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useLeadManager from '@/hooks/boards/useLeadManager';
import SaleManager from './SaleManager';
import ProjectManager from './ProjectManager';
import clickSignService from '@/services/ClickSign';

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

  const [contractError, setContractError] = useState(null);
  const [contractSuccess, setContractSuccess] = useState(null);
  const [isSendingContract, setIsSendingContract] = useState(false);

  const activateEditMode = () => {
    setEditMode(true);
  };

  const handleSendContract = async (sale) => {
    try {
      setIsSendingContract(true);

      const documentData = {
        Address: 'Endereço Fictício',
        Phone: selectedLead?.phone,
      };
      const path = `/Contratos/Contrato-${sale.contract_number}.pdf`;

      const documentoCriado = await clickSignService.v1.createDocumentModel(documentData, path);

      if (!documentoCriado || !documentoCriado.document || !documentoCriado.document.key) {
        throw new Error('Falha na criação do documento');
      }

      const documentKey = documentoCriado.document.key;
      console.log('Documento criado com sucesso:', documentKey);

      const signer = await clickSignService.v1.createSigner(
        selectedLead?.first_document,
        selectedLead?.birth_date,
        selectedLead?.phone,
        selectedLead?.customer?.email || selectedLead?.email,
        selectedLead?.customer?.complete_name,
        'whatsapp',
        { selfie_enabled: false, handwritten_enabled: false },
      );

      if (!signer || !signer.signer || !signer.signer.key) {
        throw new Error('Falha na criação do signatário');
      }

      const signerKey = signer.signer.key;
      console.log('Signatário criado:', signerKey);

      const listaAdicionada = await clickSignService.AddSignerDocument(
        signerKey,
        documentKey,
        'contractor',
        'Por favor, assine o contrato.',
      );

      if (
        !listaAdicionada ||
        !listaAdicionada.list ||
        !listaAdicionada.list.request_signature_key
      ) {
        throw new Error('Falha ao adicionar o signatário ao documento');
      }

      const requestSignatureKey = listaAdicionada.list.request_signature_key;
      console.log('Signatário adicionado ao documento:', listaAdicionada);

      const emailNotificacao = await clickSignService.notification.email(
        requestSignatureKey,
        'Por favor, assine o contrato.',
      );
      console.log('Notificação por e-mail enviada:', emailNotificacao);

      const whatsappNotificacao = await clickSignService.notification.whatsapp(requestSignatureKey);
      console.log('Notificação por WhatsApp enviada:', whatsappNotificacao);

      setContractSuccess('Contrato enviado com sucesso!');
      setIsSendingContract(false);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          'Erro ao processar o contrato:',
          JSON.stringify(error.response.data, null, 2),
        );
        setContractError(`Erro: ${error.response.data.message || 'Erro ao enviar contrato.'}`);
      } else {
        console.error('Erro ao processar o contrato:', error.message);
        setContractError(error.message || 'Erro ao enviar contrato.');
      }
      setIsSendingContract(false);
    }
  };

  const handleGenerateProposal = () => {
    console.log('Gerar proposta');
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

                    <Box display="flex" gap={2}>
                      <Tooltip title="Enviar Contrato">
                        <IconButton
                          color="primary"
                          onClick={handleSendContract}
                          disabled={isSendingContract}
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '8px',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                              backgroundColor: '#e0e0e0',
                            },
                          }}
                        >
                          <SendIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Gerar Proposta">
                        <IconButton
                          color="primary"
                          onClick={handleGenerateProposal}
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '8px',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                              backgroundColor: '#e0e0e0',
                            },
                          }}
                        >
                          <DescriptionIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box mt={2}>
                    {tabIndex === 0 && (
                      <LeadDetails
                        contractSuccess={contractSuccess}
                        contractError={contractError}
                        selectedLead={selectedLead}
                        setContractError={setContractError}
                        setContractSuccess={setContractSuccess}
                      />
                    )}
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
                {tabIndex === 1 && (
                  <>
                    <Button onClick={handleUpdateSale} color="primary" variant="contained">
                      Salvar Venda
                    </Button>
                    <Button onClick={() => setEditMode(false)} color="secondary" variant="outlined">
                      Cancelar
                    </Button>
                  </>
                )}
                {tabIndex === 2 && (
                  <>
                    <Button onClick={handleUpdateSale} color="primary" variant="contained">
                      Salvar Projeto
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
