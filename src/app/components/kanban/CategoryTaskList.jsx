'use client';
import { useContext, useEffect, useState } from 'react';
import { IconPlus, IconDotsVertical } from '@tabler/icons-react';
import TaskData from './TaskData';
import EditCategoryModal from './TaskModal/EditCategoryModal';
import AddNewTaskModal from './TaskModal/AddNewTaskModal';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import axios from '@/utils/axios';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import leadService from '@/services/leadService';
import { Add } from '@mui/icons-material';
import TaskDataSkeleton from './components/TaskDataSkeleton';

function CategoryTaskList({ id }) {
  const { todoCategories, setTodoCategories, deleteCategory, clearAllTasks, deleteTodo } =
    useContext(KanbanDataContext);

  const category = todoCategories.find((cat) => cat.id === id);

  const [allTasks, setAllTasks] = useState(category ? category.child : []);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category.name);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showContainer, setShowContainer] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await leadService.getLeadByColumnId(id);
        if (!response) {
          throw new Error('Failed to fetch leads');
        }
        setTodoCategories((prevCategories) => {
          const category = prevCategories.find((cat) => cat.id === id);
          if (category) {
            return prevCategories.map((cat) =>
              cat.id === id ? { ...cat, child: response.results || [] } : cat,
            );
          }
          return prevCategories;
        });
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Find the category and update tasks
  useEffect(() => {
    const category = todoCategories.find((cat) => cat.id === id);
    if (category) {
      setAllTasks(category.child);
    }
  }, [todoCategories, id]);

  const [newTaskData, setNewTaskData] = useState({
    task: '',
    taskText: '',
    taskProperty: '',
    date: new Date().toISOString().split('T')[0],
    imageURL: null,
  });

  //Shows the modal for adding a new task.
  const handleShowModal = () => {
    setShowModal(true);
  };
  // Closes the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };
  //  Shows the modal for editing a category.
  const handleShowEditCategoryModal = () => {
    setShowEditCategoryModal(true);
    handleClose();
  };
  //Closes the modal for editing a category.
  const handleCloseEditCategoryModal = () => setShowEditCategoryModal(false);

  //Updates the category name
  const handleUpdateCategory = async (updatedName) => {
    try {
      const response = await axios.post('/api/TodoData/updateCategory', {
        categoryId: id,
        categoryName: updatedName,
      });
      if (response.status === 200) {
        setNewCategoryName(updatedName);
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  //Adds a new task to the category.
  const handleAddTask = async () => {
    try {
      const response = await axios.post('/api/TodoData/addTask', {
        categoryId: id,
        newTaskData: {
          ...newTaskData,
          id: Math.random(),
          taskImage: newTaskData.imageURL,
        },
      });
      if (response.status === 200) {
        setNewTaskData({
          taskText: '',
          taskProperty: '',
          date: newTaskData.date,
          imageURL: '',
        });
        handleCloseModal();
        setNewTaskData('Task added successfully');
        console.log('Task added successfully:', response.data);
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Clears all tasks from the current category.
  const handleClearAll = () => {
    clearAllTasks(id);
    setAllTasks([]);
  };
  // Deletes a specific task.
  const handleDeleteTask = (taskId) => {
    deleteTodo(taskId);
    setAllTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };
  //Handles the deletion of the current category.
  const handleDeleteClick = () => {
    setShowContainer(false);
    deleteCategory(id);
  };

  return (
    <>
      <Box width="350px" boxShadow={4}>
        {showContainer && category && (
          <Box px={3} py={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="column" spacing={0.5}>
                <Typography variant="caption" className="fw-semibold">
                  Etapa
                </Typography>
                <Typography variant="h6" className="fw-semibold">
                  {newCategoryName}
                </Typography>
              </Stack>


              <Stack direction="row">
                <Box>
                  {category.name === 'Todo' && (
                    <>
                      <Tooltip title="Add Task">
                        <IconButton onClick={handleShowModal}>
                          <IconPlus size="1rem" />
                        </IconButton>
                      </Tooltip>
                      <AddNewTaskModal
                        show={showModal}
                        onHide={handleCloseModal}
                        onSave={handleAddTask}
                        newTaskData={newTaskData}
                        setNewTaskData={setNewTaskData}
                        updateTasks={() => setAllTasks([...allTasks, newTaskData])}
                      />
                    </>
                  )}
                  <EditCategoryModal
                    showModal={showEditCategoryModal}
                    handleCloseModal={handleCloseEditCategoryModal}
                    initialCategoryName={newCategoryName}
                    handleUpdateCategory={handleUpdateCategory}
                  />
                </Box>

                <Stack direction="row" spacing={0}>
                  <Tooltip title="Add Task">
                    <IconButton onClick={handleShowModal}>
                      <Add fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Menu">
                    <IconButton onClick={handleClick}>
                      <IconDotsVertical size="1rem" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={handleShowEditCategoryModal}>Edit</MenuItem>
                  <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                  <MenuItem onClick={handleClearAll}>Clear All</MenuItem>
                </Menu>
              </Stack>
            </Box>
            {loading ? (
              <Stack spacing={2}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TaskDataSkeleton key={i} />
                ))}
              </Stack>
            ) : allTasks && allTasks.length > 0 ? (
              allTasks.map((task, index) => (
                <TaskData
                  key={task.id}
                  task={task}
                  onDeleteTask={() => handleDeleteTask(task.id)}
                  index={index}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" mt={5}>
                Não há leads nesta etapa.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}
export default CategoryTaskList;
