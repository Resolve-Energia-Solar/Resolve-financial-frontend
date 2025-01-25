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
              cat.id === id ? { ...cat, child: response.results || [] } : cat
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

  useEffect(() => {
    const category = todoCategories.find((cat) => cat.id === id);
    if (category) {
      setAllTasks(category.child);
    }
  }, [todoCategories, id]);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowEditCategoryModal = () => {
    setShowEditCategoryModal(true);
    handleClose();
  };

  const handleCloseEditCategoryModal = () => setShowEditCategoryModal(false);

  return (
    <>
      <Box
        width="350px"
        boxShadow={4}
        display="flex"
        flexDirection="column"
        sx={{
          borderTop: (theme) => `7px solid ${category?.color}`,
          maxHeight: '100%',
          minHeight: allTasks?.length === 0 ? '150px' : undefined,
        }}
      >
        {category && (
          <>
            {/* Header fixo */}
            <Box
              px={3}
              py={2}
              position="sticky"
              top={0}
              zIndex={1}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
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

                  <Tooltip title="Menu">
                    <IconButton onClick={handleClick}>
                      <IconDotsVertical size="1rem" />
                    </IconButton>
                  </Tooltip>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem onClick={handleShowEditCategoryModal}>Editar</MenuItem>
                  </Menu>
                </Stack>
              </Box>
            </Box>

            {/* Conteúdo com scroll */}
            <Box
              flex={1}
              overflow="auto"
              px={3}
              py={2}
              maxHeight="calc(100vh - 160px)"
            >
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
          </>
        )}
      </Box>
    </>
  );
}

export default CategoryTaskList;
