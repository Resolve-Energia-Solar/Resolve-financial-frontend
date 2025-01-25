'use client';
import { useContext, useEffect, useState } from 'react';
import { IconPlus, IconDotsVertical } from '@tabler/icons-react';
import TaskData from './TaskData';
import EditCategoryModal from './TaskModal/EditCategoryModal';
import AddNewTaskModal from './TaskModal/AddNewTaskModal';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import leadService from '@/services/leadService';
import TaskDataSkeleton from './components/TaskDataSkeleton';

function CategoryTaskList({ id }) {
  const { todoCategories, setTodoCategories } = useContext(KanbanDataContext);

  const category = todoCategories.find((cat) => cat.id === id);

  const [allTasks, setAllTasks] = useState(category ? category.child : []);
  const [showModal, setShowModal] = useState(false);
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

  return (
    <>
      <Box
        width="350px"
        boxShadow={4}
        sx={{
          borderTop: (theme) => `7px solid ${category.color}`,
        }}
      >
        {showContainer && category && (
          <Box px={3} py={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="column" spacing={0.5}>
                <Typography variant="caption" className="fw-semibold">
                  Etapa
                </Typography>
                <Typography variant="h6" className="fw-semibold">
                  {category.name}
                </Typography>
              </Stack>

              <Stack direction="row">
                <Box>
                  <>
                    <Tooltip title="Add Task">
                      <IconButton onClick={handleShowModal}>
                        <IconPlus size="1rem" />
                      </IconButton>
                    </Tooltip>
                    <AddNewTaskModal show={showModal} onHide={handleCloseModal} columnId={id} />
                  </>
                  <EditCategoryModal
                    showModal={showEditCategoryModal}
                    handleCloseModal={handleCloseEditCategoryModal}
                    column={category}
                  />
                </Box>

                <Stack direction="row" spacing={0}>
                  <Tooltip title="Menu">
                    <IconButton onClick={handleClick}>
                      <IconDotsVertical size="1rem" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={handleShowEditCategoryModal}>Editar</MenuItem>
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
            ) : !loading ? (
              <Typography variant="body2" color="text.secondary" align="center" mt={5}>
                Não há leads nesta etapa.
              </Typography>
            ) : null}
          </Box>
        )}
      </Box>
    </>
  );
}
export default CategoryTaskList;
