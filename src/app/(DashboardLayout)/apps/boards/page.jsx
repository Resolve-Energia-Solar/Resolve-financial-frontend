'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/app/components/shared/BlankCard";
import {
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress
} from "@mui/material";
import TaskManager from "@/app/components/apps/kanban/TaskManager";

const BCrumb = [
  { to: "/", title: "Home" },
  { title: "Kanban" },
];

function KanbanPage() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const response = await fetch('https://crm.resolvenergiasolar.com/api/boards/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log('oi')
        throw new Error('Erro ao buscar os boards');

      }

      const data = await response.json();
      setBoards(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadsAndStatuses = async (boardId) => {
    
    setLoading(true);
    try {
      const token = Cookies.get('access_token');
      const response = await fetch(`https://crm.resolvenergiasolar.com/api/boards/${boardId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar os leads do board');
      }

      const data = await response.json();
      setLeads(data.columns.flatMap(column => column.leads));
      setStatuses(data.columns.map(column => ({ id: column.id, name: column.name })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadColumn = async (leadId, newColumnId) => {

    try {
      const token = Cookies.get('access_token');
      const response = await fetch(`https://crm.resolvenergiasolar.com/api/leads/${leadId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ column: newColumnId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar o status do lead');
      }


      setLeads((prevLeads) =>
        prevLeads.map(lead =>
          lead.id === parseInt(leadId) ? { ...lead, column: { id: parseInt(newColumnId) } } : lead
        )
      );
    } catch (err) {
      console.error(err.message);
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
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Erro: {error}</Typography>
        ) : (
          <>
            <FormControl fullWidth variant="outlined" sx={{ mb: 0 }}>
              <InputLabel id="select-board-label">Selecionar Board</InputLabel>
              <Select
                labelId="select-board-label"
                value={selectedBoard}
                onChange={handleBoardChange}
                label="Selecionar Board"
                sx={{
                  borderRadius: "10px",
                  bgcolor: "#f0f0f0",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: "#e0e0e0",
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

            {selectedBoard && leads.length > 0 && statuses.length > 0 && (
              <>
                <Typography variant="h5" mt={4} mb={2} color="text.primary" fontWeight="bold">
                  Leads do Board Selecionado
                </Typography>
                <Divider />
                <TaskManager leads={leads} statuses={statuses} onUpdateLeadColumn={updateLeadColumn} />
              </>
            )}
          </>
        )}
      </CardContent>
    </BlankCard>

  );
}

export default KanbanPage;
