"use client"

import { useState, useEffect } from 'react';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent, Typography, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
import TaskManager from '@/app/components/apps/kanban/TaskManager';
import KanbanHeader from '@/app/components/apps/kanban/KanbanHeader';
import { supabase } from '@/utils/supabaseClient';

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
      const { data, error } = await supabase.from('boards').select('*');
      if (error) throw error;
      setBoards(data);

      if (data.length > 0) {
        const firstBoardId = data[0].id;
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
      const { data: columnsData, error: columnsError } = await supabase
        .from('columns')
        .select('*, leads(*)') 
        .eq('board_id', boardId);
      if (columnsError) throw columnsError;

      setLeads(columnsData.flatMap((column) => column.leads));
      setStatuses(columnsData.map((column) => ({ id: column.id, name: column.name, position: column.position })));
      setColumns(columnsData);
    } catch (err) {
      setError(err.message || 'Erro ao buscar os leads do board');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadColumn = async (leadId, newColumnId) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ column_id: newColumnId })
        .eq('id', leadId);
      if (error) throw error;

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === parseInt(leadId) ? { ...lead, column_id: newColumnId } : lead,
        ),
      );
    } catch (err) {
      console.error('Erro ao atualizar o status do lead:', err.message || err);
    }
  };

  // Função para deletar um lead
  const handleDeleteLead = async (leadId) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);
      if (error) throw error;

      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
      setSnackbarMessage('Lead excluído com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      setSnackbarMessage('Erro ao excluir lead.');
      setSnackbarOpen(true);
    }
  };

  // Função para atualizar um lead
  const handleUpdateLead = async (updatedLead) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(updatedLead)
        .eq('id', updatedLead.id);
      if (error) throw error;

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === updatedLead.id ? updatedLead : lead,
        ),
      );
      setSnackbarMessage('Lead atualizado com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      setSnackbarMessage('Erro ao atualizar lead.');
      setSnackbarOpen(true);
    }
  };

  // Carrega os boards na inicialização
  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <BlankCard>
      <CardContent>
        <KanbanHeader
          boards={boards}
          selectedBoard={selectedBoard}
          onBoardChange={(e) => setSelectedBoard(e.target.value)}
          leads={leads}
          columns={columns}
          setColumns={setColumns}
          setLeads={setLeads}
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
                board={selectedBoard}
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
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarMessage.includes('Erro') ? 'error' : 'success'}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </CardContent>
    </BlankCard>
  );
}

export default KanbanPage;
