'use client';
import React, { useState, useContext, useEffect } from 'react';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import {
  Button,
  Box,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import DynamicSelect from './components/DynamicSelect';
import boardService from '@/services/boardService';
import AddCategoryModal from './TaskModal/AddCategoryModal';
import AddBoardModal from './TaskModal/AddBoardModal';
import FilterSelect from "./Leads/components/FiltersSelection";


function KanbanHeader() {
  const { boardId, setBoardId } = useContext(KanbanDataContext);
  const [show, setShow] = useState(false);
  const [boards, setBoards] = useState([]);
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await boardService.getBoards({
          params: { fields: 'id,title', is_deleted: 'false' },
        });
        console.log(response);
        const boards = response.results.map((board) => ({ value: board.id, label: board.title }));
        setBoards(boards);
        if (boards.length > 0) {
          setBoardId(boards[0].value);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  // Closes the modal
  const handleClose = () => setShow(false);
  // Opens the modal
  const handleShow = () => setShow(true);

  const [filters, setFilters] = useState({
    status: '',
    responsavel: '',
    squad: '',
  });

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <DynamicSelect
          options={boards}
          value={boardId}
          onChange={(selectedOption) => setBoardId(selectedOption)}
          onAdd={() => setShowAddBoardModal(true)}
        />

        {/* finters@@@ and create button!!!@*/}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: "center" }}>

          <FilterSelect
            label="Tipo de Projeto"
            value={filters.status || ""}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { label: "Novo Lead", value: "new" },
              { label: "1º Contato", value: "first" },
            ]}
          />

          <FilterSelect
            label="Etapa"
            value={filters.responsavel || ""}
            onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
            options={[
              { label: "Manuela", value: "manu" },
              { label: "Sandra", value: "sandra" },
            ]}
          />

          <FilterSelect
            label="Squad"
            value={filters.squad || ""}
            onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
            options={[
              { label: "Squad 1", value: "squad1" },
              { label: "Squad 2", value: "squad2" },
            ]}
          />

          <FilterSelect
            label="Responsável"
            value={filters.squad || ""}
            onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
            options={[
              { label: "Squad 1", value: "squad1" },
              { label: "Squad 2", value: "squad2" },
            ]}
          />

          <FilterSelect
            label="Campanha"
            value={filters.squad || ""}
            onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
            options={[
              { label: "Squad 1", value: "squad1" },
              { label: "Squad 2", value: "squad2" },
            ]}
          />

          <FilterSelect
            label="Período"
            value={filters.squad || ""}
            onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
            options={[
              { label: "Squad 1", value: "squad1" },
              { label: "Squad 2", value: "squad2" },
            ]}
          />

          <Button
            startIcon={<Add />}
            onClick={handleShow}
            sx={{
              width: 74,
              height: 28,
              fontSize: '0.75rem',
              p: '4px 8px',
              minWidth: 'unset',
              borderRadius: '4px',
              variant: "contained",
              backgroundColor: '#FFB800',
              color: '#000',
            }}
          >
            Criar

          </Button>
        </Box>
      </Box>
      <AddCategoryModal showModal={show} handleCloseModal={handleClose} boardId={boardId} />
      <AddBoardModal showModal={showAddBoardModal} handleCloseModal={() => setShowAddBoardModal(false)} />
    </>
  );
}

export default KanbanHeader;
