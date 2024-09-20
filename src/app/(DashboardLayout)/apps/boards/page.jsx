'use client';
import { useState, useEffect } from 'react';
import BlankCard from '@/app/components/shared/BlankCard';
import {
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress,
  Box,
} from '@mui/material';
import TaskManager from '@/app/components/apps/kanban/TaskManager';
import boardService from '@/services/boardService';
import leadService from '@/services/leadService';

function KanbanPage() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [statuses, setStatuses] = useState([]);

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
    } catch (err) {
      setError(err.message || 'Erro ao buscar os leads do board');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadColumn = async (leadId, newColumnId) => {
    try {
      await leadService.updateLead(leadId, { column: newColumnId });

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === parseInt(leadId) ? { ...lead, column: { id: parseInt(newColumnId) } } : lead
        )
      );
    } catch (err) {
      console.error(err.message || 'Erro ao atualizar o status do lead');
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleBoardChange = (event) => {
    const boardId = event.target.value;
    setSelectedBoard(boardId);
    fetchLeadsAndStatuses(boardId);
  };

  return (
    <BlankCard>
      <CardContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Erro: {error}</Typography>
        ) : (
          <>
            {boards.length > 0 && (
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="select-board-label">Selecionar Board</InputLabel>
                <Select
                  labelId="select-board-label"
                  value={selectedBoard}
                  onChange={handleBoardChange}
                  label="Selecionar Board"
                  sx={{
                    borderRadius: '10px',
                    bgcolor: '#f0f0f0',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: '#e0e0e0',
                    },
                    '& .MuiSelect-select': {
                      padding: '12px 14px',
                    },
                  }}
                >
                  {boards.map((board) => (
                    <MenuItem key={board.id} value={board.id}>
                      {board.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedBoard && leads.length > 0 && statuses.length > 0 ? (
              <>
                <Typography variant="h5" mt={4} mb={2} color="text.primary" fontWeight="bold">
                  Leads do Board Selecionado
                </Typography>
                <Divider />
                <TaskManager leads={leads} statuses={statuses} onUpdateLeadColumn={updateLeadColumn} />
              </>
            ) : (
              <Typography variant="body1" mt={4}>
                Nenhum lead disponível para este board.
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </BlankCard>
  );
}

export default KanbanPage;
