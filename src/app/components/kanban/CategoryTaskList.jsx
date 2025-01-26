import { useContext, useEffect, useState } from 'react';
import { IconPlus, IconDotsVertical } from '@tabler/icons-react';
import TaskData from './TaskData';
import EditCategoryModal from './TaskModal/EditCategoryModal';
import AddNewTaskModal from './TaskModal/AddNewTaskModal';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';

import leadService from '@/services/leadService';
import TaskDataSkeleton from './components/TaskDataSkeleton';
import DeleteCategoryModal from './TaskModal/DeleteCategoryModal';
import { debounce } from 'lodash';

function CategoryTaskList({ id }) {
  const theme = useTheme();
  const { todoCategories, setTodoCategories } = useContext(KanbanDataContext);

  const category = todoCategories.find((cat) => cat.id === id);

  const [allTasks, setAllTasks] = useState(category ? category.child : []);
  const [showModal, setShowModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [hasNext, setHasNext] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const nextPage = () => {
    if (hasNext) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleScroll = debounce((event) => {
    if (loading) return;
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;
    const scrollPosition = scrollTop + clientHeight;

    if (scrollPosition >= 0.75 * scrollHeight && hasNext) {
      nextPage();
    }
  }, 700);

  useEffect(() => {
    const debouncedEffect = debounce(() => {
      if (category?.child?.length <= 9 && hasNext) {
        console.log('Loading next page because there are exactly 7 items');
        nextPage();
      }
    }, 500);
    
    debouncedEffect();
    return () => debouncedEffect.cancel();
  }, [category?.child?.length, hasNext]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (page > 1 && !hasNext) return;
      setLoading(true);
      try {
        const response = await leadService.getLeads({
          params: {
            fields: 'id,name,phone,created_at,qualification',
            column: id,
            ordering: '-created_at',
            page: page,
            limit: perPage,
          },
        });
        setCount(response.count);
        response?.next ? setHasNext(true) : setHasNext(false);

        if (!response) {
          throw new Error('Failed to fetch leads');
        }
        setTodoCategories((prevCategories) => {
          const category = prevCategories.find((cat) => cat.id === id);
          if (category) {
            return prevCategories.map((cat) =>
              cat.id === id
                ? {
                    ...cat,
                    child: [...(category.child || []), ...(response.results || [])],
                  }
                : cat,
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
  }, [id, page]);

  useEffect(() => {
    const category = todoCategories.find((cat) => cat.id === id);
    if (category) {
      setAllTasks(category.child);
    }
  }, [todoCategories, page, id]);

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

  const handleShowDeleteCategoryModal = () => {
    setShowDeleteCategoryModal(true);
    handleClose();
  };

  const handleCloseEditCategoryModal = () => setShowEditCategoryModal(false);
  const handleCloseDeleteCategoryModal = () => setShowDeleteCategoryModal(false);

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
            <Box px={3} py={2} position="sticky" top={0} zIndex={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Stack direction="column" spacing={0.5}>
                  <Typography variant="caption" className="fw-semibold">
                    Etapa
                  </Typography>
                  <Typography variant="h6" className="fw-semibold">
                    <Typography variant="h6">{category.name}</Typography>
                  </Typography>
                </Stack>

                <Stack direction="row">
                  <Box>
                    {category.column_type === 'B' && (
                      <>
                        <Tooltip title="Add Task">
                          <IconButton onClick={handleShowModal}>
                            <IconPlus size="1rem" />
                          </IconButton>
                        </Tooltip>
                        <AddNewTaskModal show={showModal} onHide={handleCloseModal} columnId={id} />
                      </>
                    )}
                    <EditCategoryModal
                      showModal={showEditCategoryModal}
                      handleCloseModal={handleCloseEditCategoryModal}
                      column={category}
                    />

                    <DeleteCategoryModal
                      showModal={showDeleteCategoryModal}
                      handleCloseModal={handleCloseDeleteCategoryModal}
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
                    <MenuItem onClick={handleShowDeleteCategoryModal}>Deletar</MenuItem>
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
              onScroll={handleScroll} // Adiciona o evento de rolagem
            >
              {loading && page === 1 ? (
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
              {loading && page > 1 && (
                <Stack spacing={2}>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <TaskDataSkeleton key={i} />
                  ))}
                </Stack>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

export default CategoryTaskList;
