'use client';
import React, { useState, useContext, useEffect } from 'react';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import {
  Button,
  Box,
} from '@mui/material';
import DynamicSelect from './components/DynamicSelect';
import boardService from '@/services/boardService';
import AddCategoryModal from './TaskModal/AddCategoryModal';
import AddBoardModal from './TaskModal/AddBoardModal';

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

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <DynamicSelect
          options={boards}
          value={boardId}
          onChange={(selectedOption) => setBoardId(selectedOption)}
          onAdd={() => setShowAddBoardModal(true)}
        />
        <Button variant="contained" onClick={handleShow}>
          Adicionar coluna
        </Button>
      </Box>
      <AddCategoryModal showModal={show} handleCloseModal={handleClose} boardId={boardId} />
      <AddBoardModal showModal={showAddBoardModal} handleCloseModal={() => setShowAddBoardModal(false)} />
    </>
  );
}

export default KanbanHeader;
