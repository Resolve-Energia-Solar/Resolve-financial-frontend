import { useState, useEffect } from 'react'
import boardService from '@/services/boardService'
import leadService from '@/services/leadService'
import columnService from '@/services/boardColumnService'

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
  const [searchTerm, setSearchTerm] = useState('');

  const addLead = newLead => {
    setLeads(prevLeads => [...prevLeads, newLead]);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const data = await boardService.getBoards();
      setBoards(data);

      if (data.results && data.results.length > 0) {
        const defaultBoardId = data.results[0].id;
        console.log("Definindo selectedBoard:", defaultBoardId);
        setSelectedBoard(defaultBoardId);
      }
    } catch (err) {
      setError(err.message || 'Erro ao buscar os boards');
    } finally {
      setLoading(false);
    }
  };

  const fetchBoardDetails = async (boardId, page = 1, pageSize = 40) => {
    if (!boardId) {
      console.error("Erro: boardId está indefinido");
      return;
    }

    setLoading(true);
    console.log("Buscando detalhes do board:", boardId);

    try {
      const board = boards?.results?.find((b) => b.id === boardId);
      if (!board) {
        console.error("Erro: Board não encontrado", boardId);
        setError('Board não encontrado');
        return;
      }

      setColumns(board.columns || []);
      const sortedColumns = board.columns.sort((a, b) => a.position - b.position);
      console.log("Colunas do board:", sortedColumns);

      const allLeads = await Promise.all(
        sortedColumns.map(async (column) => {
          const leads = await leadService.getLeadsByColumn(
            boardId,
            column.id,
            page,
            pageSize,
            searchTerm
          );
          return leads.map((lead) => ({ ...lead, column_id: column.id }));
        })
      );

      setLeads(allLeads.flat());
      setStatuses(
        sortedColumns.map((column) => ({
          id: column.id,
          name: column.name,
          position: column.position,
          proposals_value: column.proposals_value,
          
        }))
      );
    } catch (err) {
      console.error('Erro ao buscar detalhes do board selecionado:', err);
      setError('Erro ao buscar detalhes do board selecionado');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchLeads = async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      const results = await Promise.all(
        columns.map(async column => {
          const leads = await leadService.getLeadsByColumn(
            selectedBoard,
            column.id,
            1,
            20,
            searchTerm,
          );
          return leads.map(lead => ({ ...lead, column_id: column.id }));
        })
      );
      setLeads(results.flat());
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      setSnackbarMessage('Erro ao buscar leads.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBoard) {
      console.log('Buscando detalhes do board:', selectedBoard);
      fetchBoardDetails(selectedBoard);
    }
  }, [selectedBoard]);

  useEffect(() => {
    if (searchTerm && selectedBoard) {
      handleSearchLeads();
    } else if (selectedBoard) {
      fetchBoardDetails(selectedBoard);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const reloadBoardDetails = async () => {
    await fetchBoardDetails(selectedBoard);
  };

  const loadMoreLeads = async (statusId, page = 1, pageSize = 20) => {
    if (!selectedBoard || loading) return;
  
    setLoading(true);
    try {
      const nextPage = Math.ceil(leads.length / pageSize) + 1;
      console.log(`Carregando mais leads para a coluna ${statusId}, página ${nextPage}`);
      
      const newLeads = await leadService.getLeadsByColumn(
        selectedBoard,
        statusId,
        nextPage,
        pageSize,
        searchTerm
      );
  
      if (newLeads.length > 0) {
        setLeads((prevLeads) => [...prevLeads, ...newLeads]);
      }
    } catch (err) {
      console.error('Erro ao carregar mais leads:', err);
    } finally {
      setLoading(false);
    }
  };
  

  const updateLeadColumn = async (leadId, newColumnId) => {
    try {
      await leadService.patchLead(leadId, { column_id: newColumnId });

      setLeads(prevLeads => {
        const updatedLeads = prevLeads.map(lead => {
          if (lead.id === leadId) {
            return { ...lead, column_id: newColumnId };
          }
          return lead;
        });
        return updatedLeads;
      });

      await reloadBoardDetails();
    } catch (err) {
      console.error('Erro ao atualizar o status do lead:', err.message || err);
    }
  };

  const handleDeleteLead = async leadId => {
    try {
      await boardService.deleteLead(leadId);
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
      setSnackbarMessage('Lead excluído com sucesso!');
      setSnackbarOpen(true);

      await reloadBoardDetails();
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      setSnackbarMessage('Erro ao excluir lead.');
      setSnackbarOpen(true);
    }
  };

  const handleUpdateLead = async updatedLead => {
    try {
      await leadService.patchLead(updatedLead.id, updatedLead);
      setLeads(prevLeads =>
        prevLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead)),
      );
      setSnackbarMessage('Lead atualizado com sucesso!');
      setSnackbarOpen(true);

      await reloadBoardDetails();
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      setSnackbarMessage('Erro ao atualizar lead.');
      setSnackbarOpen(true);
    }
  };

  const updateColumnName = async (columnId, newName) => {
    try {
      await columnService.updateColumnPatch(columnId, { name: newName });

      setStatuses(prevStatuses =>
        prevStatuses.map(status =>
          status.id === columnId ? { ...status, name: newName } : status,
        )
      );

      setSnackbarMessage('Nome da coluna atualizado com sucesso!');
      setSnackbarOpen(true);

      await reloadBoardDetails();
    } catch (error) {
      console.error('Erro ao atualizar o nome da coluna:', error);
      setSnackbarMessage('Erro ao atualizar o nome da coluna.');
      setSnackbarOpen(true);
    }
  };

  return {
    addLead,
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
    updateColumnName,
    fetchBoardDetails,
    searchTerm,
    setSearchTerm,
    loadMoreLeads,
  };
};

export default useKanban;
