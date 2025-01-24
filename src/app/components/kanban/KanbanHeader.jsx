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

function KanbanHeader() {
  const { addCategory, setBoardId, setError } = useContext(KanbanDataContext);
  const [show, setShow] = useState(false);
  const [listName, setListName] = useState('');
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await boardService.getBoards({ params: { fields: 'id,title', is_deleted: 'false' } });
        console.log(response);
        const boards = response.results.map((board) => ({ value: board.id, label: board.title }));
        setBoards(boards);
      } catch (error) {
        handleError(error.message);
      }
    };
    fetchData();
  }, []);

  // Closes the modal
  const handleClose = () => setShow(false);
  // Opens the modal
  const handleShow = () => setShow(true);

  // Handles adding a new category.
  const handleSave = async () => {
    try {
      const response = await axios.post('/api/TodoData/addCategory', { categoryName: listName });
      addCategory(response.data.name);
      setListName('');
      setShow(false);
    } catch (error) {
      setError(error.message);
    }
  };
  const isAddButtonDisabled = listName.trim().length === 0;

  // const options = [
  //     { value: 10, label: 'Ten' },
  //     { value: 20, label: 'Twenty' },
  //     { value: 30, label: 'Thirty' },
  //   ];

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <DynamicSelect options={boards}  onChange={(selectedOption) => setBoardId(selectedOption)}  />
        <Button variant="contained" onClick={handleShow}>
          Add List
        </Button>
      </Box>
      <Dialog
        open={show}
        onClose={handleClose}
        maxWidth="lg"
        sx={{ '.MuiDialog-paper': { width: '600px' } }}
      >
        <DialogTitle>Add List</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <CustomFormLabel htmlFor="default-value">List Name</CustomFormLabel>
              <CustomTextField
                autoFocus
                id="default-value"
                variant="outlined"
                value={listName}
                fullWidth
                onChange={(e) => setListName(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            color="primary"
            disabled={isAddButtonDisabled}
          >
            Add List
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default KanbanHeader;
