'use client';
import { useState, useEffect } from 'react';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent, Typography, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
import TaskManager from '@/app/components/apps/kanban/TaskManager';
import boardService from '@/services/boardService';
import leadService from '@/services/leadService';
import KanbanHeader from '@/app/components/apps/kanban/KanbanHeader';

function KanbanPage() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [columns, setColumns] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); 

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const data = await boardService.getBoards();
      setBoards(data.results);

      if (data.results.length > 0) {
        const firstBoardId = data.results[0].id;
        setSelectedBoard(firstBoardId);
        fetchLeadsAndStatuses(firstBoardId);
      }
    } catch (err) {
      setError(err.message || 'Erro ao buscar os boards');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadsAndStatuses = async (boardId) => {
    setLoading(true);
    try {
      const data = await boardService.getBoardDetails(boardId);
      setLeads(data.columns.flatMap((column) => column.leads));
      setStatuses(data.columns.map((column) => ({ id: column.id, name: column.name })));
      setColumns(data.columns);
    } catch (err) {
      setError(err.message || 'Erro ao buscar os leads do board');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadColumn = async (leadId, newColumnId) => {
    try {
      const leadToUpdate = leads.find((lead) => lead.id === parseInt(leadId));
      const leadData = {
        name: leadToUpdate.name,
        contact_email: leadToUpdate.contact_email,
        phone: leadToUpdate.phone,
        column: newColumnId,
      };
      await leadService.updateLead(leadId, leadData);
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === parseInt(leadId) ? { ...lead, column: { id: parseInt(newColumnId) } } : lead
        )
      );
    } catch (err) {
      console.error('Erro ao atualizar o status do lead:', err.message || err);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await leadService.deleteLead(leadId);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
      setSnackbarMessage('Lead excluído com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      setSnackbarMessage('Erro ao excluir lead.');
      setSnackbarOpen(true);
    }
  };

  const handleUpdateLead = async (updatedLead) => {
    try {
      await leadService.updateLead(updatedLead.id, updatedLead);
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === updatedLead.id ? updatedLead : lead
        )
      );
      setSnackbarMessage('Lead atualizado com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      setSnackbarMessage('Erro ao atualizar lead.');
      setSnackbarOpen(true);
    }
  };

  const handleBoardChange = (event) => {
    const boardId = event.target.value;
    setSelectedBoard(boardId);
    fetchLeadsAndStatuses(boardId);
  };

  const handleAddCategory = async (categoryName) => {
    try {
      const newCategory = await boardService.createCategory(categoryName, selectedBoard);
      setColumns((prevColumns) => [...prevColumns, newCategory]);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  };

  const handleAddLead = async (leadData) => {
    try {
      const createdLead = await leadService.createLead(leadData);
      setLeads((prevLeads) => [...prevLeads, createdLead]);
      fetchLeadsAndStatuses(selectedBoard);
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <BlankCard>
      <CardContent>
        <KanbanHeader
          boards={boards}
          selectedBoard={selectedBoard}
          onBoardChange={handleBoardChange}
          leads={leads}
          columns={columns}
          setColumns={setColumns}
          setLeads={setLeads}
          onAddCategory={handleAddCategory}
          onAddLead={handleAddLead}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Erro: {error}</Typography>
        ) : (
          <>
            {selectedBoard && leads.length > 0 && statuses.length > 0 ? (
              <TaskManager
                leads={leads}
                statuses={statuses}
                onUpdateLeadColumn={updateLeadColumn}
                onUpdateLead={handleUpdateLead}
                onDeleteLead={handleDeleteLead}
              />
            ) : (
              <Typography variant="body1" mt={4}>
                Nenhum lead disponível para este quadro.
              </Typography>
            )}
          </>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes('Erro') ? 'error' : 'success'}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </CardContent>
    </BlankCard>
  );
}

export default KanbanPage;
