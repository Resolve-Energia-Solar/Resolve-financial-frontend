import { useState, useEffect } from 'react';
import boardService from '@/services/boardService';

const useKanban = () => {
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

  // Fetch all boards when the component mounts
  const fetchBoards = async () => {
    setLoading(true);
    try {
      const data = await boardService.getBoards();
      setBoards(data);

      // Automatically select the first board if no board is selected
      if (data.results && data.results.length > 0 && !selectedBoard) {
        setSelectedBoard(data.results[0].id);
      }
    } catch (err) {
      setError(err.message || 'Erro ao buscar os boards');
    } finally {
      setLoading(false);
    }
  };

  // Fetch leads, statuses, and columns when a board is selected
  const fetchBoardDetails = async (boardId) => {
    if (!boardId) return;

    setLoading(true);
    try {
      const board = boards.results.find((b) => b.id === boardId);

      if (board) {
        setColumns(board.columns || []);
        
        const sortedColumns = board.columns.sort((a, b) => a.position - b.position);
        setLeads(sortedColumns.flatMap((column) => column.leads || []));
        setStatuses(
          sortedColumns.map((column) => ({
            id: column.id,
            name: column.name,
            position: column.position,
          })),
        );
      }
    } catch (err) {
      setError('Erro ao buscar detalhes do board selecionado');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetching of board details whenever a new board is selected
  useEffect(() => {
    fetchBoardDetails(selectedBoard);
  }, [selectedBoard, boards]);

  // Fetch all boards when the component mounts
  useEffect(() => {
    fetchBoards();
  }, []);

  const updateLeadColumn = async (leadId, newColumnId) => {
    try {
      await boardService.updateLead(leadId, { column_id: newColumnId });
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === parseInt(leadId) ? { ...lead, column_id: newColumnId } : lead,
        ),
      );
    } catch (err) {
      console.error('Erro ao atualizar o status do lead:', err.message || err);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await boardService.deleteLead(leadId);
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
      await boardService.updateLead(updatedLead.id, updatedLead);
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
      );
      setSnackbarMessage('Lead atualizado com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      setSnackbarMessage('Erro ao atualizar lead.');
      setSnackbarOpen(true);
    }
  };

  return {
    boards,
    selectedBoard,
    setSelectedBoard,
    loading,
    error,
    leads,
    statuses,
    columns,
    setColumns,
    setLeads,
    snackbarMessage,
    snackbarOpen,
    handleSnackbarClose,
    updateLeadColumn,
    handleDeleteLead,
    handleUpdateLead,
  };
};

export default useKanban;
