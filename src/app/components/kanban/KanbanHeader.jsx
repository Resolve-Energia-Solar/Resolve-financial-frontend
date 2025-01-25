'use client';
import React, { useState, useContext, useEffect } from 'react';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import axios from '@/utils/axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../forms/theme-elements/CustomFormLabel';
import DynamicSelect from './components/DynamicSelect';
import boardService from '@/services/boardService';
import AddCategoryModal from './TaskModal/AddCategoryModal';

function KanbanHeader() {
  const { addCategory, boardId, setBoardId, setError } = useContext(KanbanDataContext);
  const [show, setShow] = useState(false);
  const [listName, setListName] = useState('');
  const [boards, setBoards] = useState([]);

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <DynamicSelect
          options={boards}
          value={boardId}
          onChange={(selectedOption) => setBoardId(selectedOption)}
        />
        <Button variant="contained" onClick={handleShow}>
          Adicionar coluna
        </Button>
      </Box>
      <AddCategoryModal showModal={show} handleCloseModal={handleClose} boardId={boardId} />
    </>
  );
}

export default KanbanHeader;
