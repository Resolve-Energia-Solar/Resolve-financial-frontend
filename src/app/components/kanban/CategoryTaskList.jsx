import { useContext, useEffect, useState } from 'react';
import { IconPlus, IconDotsVertical } from '@tabler/icons-react';
import TaskData from './TaskData';
import EditCategoryModal from './TaskModal/EditCategoryModal';
import AddNewTaskModal from './TaskModal/AddNewTaskModal';
import ChipDeadLine from './components/Chipdead-line';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import { Box, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';

import leadService from '@/services/leadService';
import TaskDataSkeleton from './components/TaskDataSkeleton';
import DeleteCategoryModal from './TaskModal/DeleteCategoryModal';
import { debounce } from 'lodash';

import { Chip } from '@mui/material';
import { format, isBefore } from 'date-fns';
import SimpleBar from 'simplebar-react';

function CategoryTaskList({ id }) {
  const theme = useTheme();
  const { todoCategories, setCount, insertChildren } = useContext(KanbanDataContext);

  const category = todoCategories.find((cat) => cat.id === id);

  const [allTasks, setAllTasks] = useState(category ? category.child : []);
  const [showModal, setShowModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
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

  const refresh = () => {
    setReload((prev) => !prev);
  };

  const handleScroll = debounce((event) => {
    if (loading) return;

    const { scrollTop, scrollHeight, clientHeight } = event.target;
    const scrollPosition = scrollTop + clientHeight;

    const isNearTop = scrollPosition <= 0.35 * scrollHeight && page > 1;

    const isNearBottom = scrollPosition >= 0.75 * scrollHeight && hasNext;

    console.log('scrollPosition:', scrollPosition);
    console.log('scrollHeight:', scrollHeight);
    console.log('isNearBottom:', scrollPosition >= 0.75 * scrollHeight);

    console.log('isNearTop:', isNearTop);
    console.log('page:', page);

    if (isNearTop && !loading) {
      setPage(1);
    }

    if (isNearBottom) {
      console.log('nextPage');
      nextPage();
    }
  }, 700);

  useEffect(() => {
    const debouncedEffect = debounce(() => {
      const percentageBase = Math.ceil(perPage * 0.7);
      if (category?.child?.length <= percentageBase && hasNext) {
        setPage(1);
        refresh();
      }
    }, 700);

    debouncedEffect();
    return () => debouncedEffect.cancel();
  }, [category?.child?.length, hasNext]);

  useEffect(() => {
    const fetchData = async () => {
      if (page > 1 && !hasNext) return;
      setLoading(true);
      try {
        const response = await leadService.index({
          fields: 'id,name,phone,created_at,qualification,origin',
          column: id,
          ordering: '-created_at',
          page: page,
          limit: perPage,
        });

        response?.meta.pagination.next ? setHasNext(true) : setHasNext(false);
        setCount(id, response?.count);
        if (!response) {
          throw new Error('Failed to fetch leads');
        }
        insertChildren(id, response.results, page === 1);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    console.log('task data: ', allTasks);
    console.log('status count:', getStatusCount(allTasks || []));
  }, [id, page, reload]);

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

  const getDeadlineStatus = (task) => {
    if (!task?.due_date) return null;

    const today = new Date();
    const dueDate = new Date(task.due_date);

    return dueDate < today ? 'A' : 'P';
  };

  const getStatusCount = (tasks = []) => {
    return tasks.reduce((acc, task) => {
      const status = getDeadlineStatus(task) || 'P';
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status] += 1;
      return acc;
    }, {});
  };

  // const totalAmount = allTasks.reduce((sum, task) => sum + (task?.value || 0), 0); // does tasks have a "value" field???

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
                <Stack direction="column">
                  <Box display="flex" alignItems="center" sx={{ gap: 7 }}>
                    <Box sx={{ fontSize: '9px', fontWeight: '400', display: 'flex' }} xs={4}>
                      {Object.entries(getStatusCount(allTasks || [])).map(([status, count]) => (
                        <ChipDeadLine
                          key={status}
                          status={status}
                          count={count}
                          sx={{ fontSize: '9px', fontWeight: '400', padding: '2px 6px' }}
                        ></ChipDeadLine>
                      ))}
                    </Box>
                    <Box xs={8}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: '400', fontSize: '12px', color: '#828282' }}
                      >
                        {/* Valor total <strong>R${totalAmount.toLocaleString()}</strong> */}
                        {/* Valor total: {task?.value ? `R$ ${task.value}` : "Sem valor"} */}
                        Valor total:
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography
                      variant="caption"
                      className="fw-semibold"
                      sx={{ fontWeight: '400', fontSize: '9px', color: '#303030' }}
                    >
                      Etapa
                    </Typography>
                    <Typography
                      variant="h6"
                      className="fw-semibold"
                      sx={{ fontWeight: '400', fontSize: '14px', color: '#303030' }}
                    >
                      {category.name}
                      <Typography
                        variant="body1"
                        component="span"
                        color="text.secondary"
                        ml={0.2}
                        sx={{ fontWeight: '400', fontSize: '14px', color: '#828282' }}
                      >
                        {category.count ? ` (${category.count})` : ''}
                      </Typography>
                    </Typography>
                  </Box>
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
              onScroll={handleScroll}
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
