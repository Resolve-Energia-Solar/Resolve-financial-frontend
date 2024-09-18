'use client';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from '@/utils/supabaseClient';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { IconDotsVertical, IconPlus } from '@tabler/icons-react';
import { Star, StarBorder, Email, Phone, AccessTime } from '@mui/icons-material'; // Ícones adicionais para Email, Telefone e Data de Criação
import KanbanHeader from './KanbanHeader';
import SimpleBar from 'simplebar-react';

const moveLead = async (leadId, newCategoryId) => {
  await supabase.from('leads').update({ kanban_category_id: newCategoryId }).eq('id', leadId);
};

const getCategoryColor = (categoryName) => {
  switch (categoryName) {
    case 'Novo Lead':
      return 'primary.light';
    case 'Primeiro Contato':
      return 'secondary.light';
    case 'Segundo Contato':
      return 'warning.light';
    case 'Concluído':
      return 'success.light';
    default:
      return 'grey.300';
  }
};

const TaskManager = () => {
  const [categories, setCategories] = useState([]);
  const [leads, setLeads] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showTaskInput, setShowTaskInput] = useState(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: categoriesData } = await supabase.from('kanban_categories').select('*');
      const { data: leadsData } = await supabase.from('leads').select('*');

      setCategories(categoriesData);
      setLeads(leadsData);
    };

    fetchData();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceCategoryId = parseInt(source.droppableId, 10);
    const destinationCategoryId = parseInt(destination.droppableId, 10);

    if (sourceCategoryId === destinationCategoryId) return;

    await moveLead(draggableId, destinationCategoryId);

    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id.toString() === draggableId
          ? { ...lead, kanban_category_id: destinationCategoryId }
          : lead,
      ),
    );
  };

  const addCategory = async (categoryName) => {
    const { data, error } = await supabase
      .from('kanban_categories')
      .insert([{ name: categoryName }]);

    if (data) {
      setCategories((prevCategories) => [...prevCategories, data[0]]);
    }
  };

  const addLead = async (categoryId, leadName) => {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ name: leadName, kanban_category_id: categoryId }]);

    if (data) {
      setLeads((prevLeads) => [...prevLeads, data[0]]);
    }
    setNewTaskName('');
    setShowTaskInput(null);
  };

  const handleLeadClick = (event, lead) => {
    setAnchorEl(event.currentTarget);
    setSelectedLead(lead);
  };

  const handleCategoryClick = (event, category) => {
    setCategoryAnchorEl(event.currentTarget);
    setSelectedCategory(category);
    setEditedCategoryName(category.name);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCategoryAnchorEl(null);
    setSelectedLead(null);
    setSelectedCategory(null);
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
    setCategoryAnchorEl(null);
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
    setCategoryAnchorEl(null);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setOpenDeleteModal(false);
  };

  const closeMessage = () => {
    setShowMessage(false);
  };

  const handleEditCategory = async () => {
    if (selectedCategory) {
      await supabase
        .from('kanban_categories')
        .update({ name: editedCategoryName })
        .eq('id', selectedCategory.id);

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, name: editedCategoryName } : cat,
        ),
      );
      setMessage(`Coluna "${editedCategoryName}" editada com sucesso!`);
      setShowMessage(true);
      handleCloseModal();
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      await supabase.from('kanban_categories').delete().eq('id', selectedCategory.id);

      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== selectedCategory.id),
      );
      setMessage(`Coluna "${selectedCategory.name}" apagada com sucesso!`);
      setShowMessage(true);
      handleCloseModal();
    }
  };

  const handleDeleteLead = async () => {
    if (selectedLead) {
      await supabase.from('leads').delete().eq('id', selectedLead.id);

      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== selectedLead.id));
      handleClose();
    }
  };

  const handleStarClick = async (leadId, stars) => {
    await supabase.from('leads').update({ stars }).eq('id', leadId);

    setLeads((prevLeads) =>
      prevLeads.map((lead) => (lead.id === leadId ? { ...lead, stars } : lead)),
    );
  };

  return (
    <>
      <KanbanHeader addCategory={addCategory} addLead={addLead} />
      <SimpleBar>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box display="flex" gap={2}>
            {categories.map((category) => (
              <Droppable droppableId={category.id.toString()} key={category.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minWidth: '300px',
                      backgroundColor: getCategoryColor(category.name),
                      p: 2,
                      maxHeight: '80vh',
                      overflowY: 'auto',
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" gutterBottom>
                        {category.name}
                      </Typography>
                      <IconButton onClick={(event) => handleCategoryClick(event, category)}>
                        <IconDotsVertical size="1rem" />
                      </IconButton>
                      <Menu
                        anchorEl={categoryAnchorEl}
                        open={Boolean(categoryAnchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleOpenEditModal}>Editar Coluna</MenuItem>
                        <MenuItem onClick={handleOpenDeleteModal}>Deletar Coluna</MenuItem>
                      </Menu>
                    </Box>

                    {leads
                      .filter((lead) => lead.kanban_category_id === category.id)
                      .map((lead, index) => (
                        <Draggable draggableId={lead.id.toString()} index={index} key={lead.id}>
                          {(provided, snapshot) => (
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                p: 2,
                                mb: 2,
                                backgroundColor: snapshot.isDragging ? '#e0f7fa' : 'white',
                                transition: 'background-color 0.2s ease',
                              }}
                            >
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                              >
                                <Typography variant="h6">{lead.name}</Typography>
                                <Box display="flex" alignItems="center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <IconButton
                                      key={star}
                                      size="small"
                                      onClick={() => handleStarClick(lead.id, star)}
                                    >
                                      {lead.stars >= star ? (
                                        <Star sx={{ color: 'gold', fontSize: '1rem' }} />
                                      ) : (
                                        <StarBorder sx={{ color: 'grey', fontSize: '1rem' }} />
                                      )}
                                    </IconButton>
                                  ))}
                                </Box>
                              </Box>
                              <Box display="flex" alignItems="center" mt={1}>
                                <Email sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
                                <Typography variant="body2">{lead.email}</Typography>
                              </Box>
                              <Box display="flex" alignItems="center" mt={1}>
                                <Phone sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
                                <Typography variant="body2">{lead.phone}</Typography>
                              </Box>
                              <Box display="flex" alignItems="center" mt={1}>
                                <AccessTime sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
                                <Typography variant="caption" color="textSecondary">
                                  Criado em: {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                </Typography>
                              </Box>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ))}
          </Box>
        </DragDropContext>
      </SimpleBar>

      <Dialog open={openEditModal} onClose={handleCloseModal}>
        <DialogTitle>Editar Coluna</DialogTitle>
        <DialogContent>
          <TextField
            value={editedCategoryName}
            onChange={(e) => setEditedCategoryName(e.target.value)}
            fullWidth
          />
          {showMessage && (
            <Alert onClose={closeMessage} severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleEditCategory} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={handleCloseModal}>
        <DialogTitle>Deletar Coluna</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja deletar esta coluna?</Typography>
          {showMessage && (
            <Alert onClose={closeMessage} severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleDeleteCategory} color="error">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskManager;
