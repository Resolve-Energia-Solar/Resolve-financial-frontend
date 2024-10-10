import { useState, useEffect } from 'react';
import boardService from '@/services/boardService';
import columnService from '@/services/boardCollunService';

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

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const data = await boardService.getBoards();
      setBoards(data);

      if (data.results && data.results.length > 0) {
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
      let columnsData = await columnService.getCollumn(boardId);
  
      columnsData = Array.isArray(columnsData) ? columnsData : [];
  
      const sortedColumns = columnsData.sort((a, b) => a.position - b.position);
  
      setLeads(sortedColumns.flatMap((column) => column.leads));
      setStatuses(
        sortedColumns.map((column) => ({
          id: column.id,
          name: column.name,
          position: column.position,
        })),
      );
      setColumns(sortedColumns);
    } catch (err) {
      setError(err.message || 'Erro ao buscar os leads do board');
    } finally {
      setLoading(false);
    }
  };
  

  const updateLeadColumn = async (leadId, newColumnId) => {
    try {
      await columnService.updateColumn(leadId, { column_id: newColumnId });
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
      await columnService.deleteColumn(leadId);
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
      await columnService.updateColumn(updatedLead.id, updatedLead);
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

  useEffect(() => {
    fetchBoards();
  }, []);

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
