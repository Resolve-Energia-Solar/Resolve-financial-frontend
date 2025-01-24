'use client';
import React, { useContext, useState } from 'react';
import {
  IconPencil,
  IconDotsVertical,
  IconTrash,
  IconCalendar,
  IconClock,
} from '@tabler/icons-react';
import EditTaskModal from './TaskModal/EditTaskModal';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import { Draggable } from 'react-beautiful-dnd';
import axios from '@/utils/axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  Avatar,
  Box,
  Card,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Rating,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import BlankCard from '../shared/BlankCard';
import { AccessTime, PunchClock, PunchClockSharp, WbSunny } from '@mui/icons-material';

const TaskData = ({ task, onDeleteTask, index }) => {
  const theme = useTheme();
  const { setError } = useContext(KanbanDataContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [anchorEl, setAnchorEl] = useState(null);
  const taskId = task.id ? task.id.toString() : task.task;

  const handleShowEditModal = () => {
    setShowEditModal(true);
    handleClose();
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => onDeleteTask(task.id);

  const handleSaveEditedTask = async (editedTaskData) => {
    try {
      const response = await axios.put('/api/TodoData/editTask', {
        taskId: editedTaskData.id,
        newData: editedTaskData,
      });
      if (response.status === 200) {
        setEditedTask(editedTaskData);
      } else {
        throw new Error('Failed to edit task');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (selectedDate) => {
    if (!selectedDate) return '';
    const dateObj = new Date(selectedDate);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const backgroundColor =
    editedTask.taskProperty === 'Design'
      ? 'success.main'
      : editedTask.taskProperty === 'Development'
      ? 'warning.main'
      : editedTask.taskProperty === 'Mobile'
      ? 'primary.main'
      : editedTask.taskProperty === 'UX Stage'
      ? 'warning.main'
      : editedTask.taskProperty === 'Research'
      ? 'secondary.main'
      : editedTask.taskProperty === 'Data Science'
      ? 'error.main'
      : editedTask.taskProperty === 'Branding'
      ? 'success.main'
      : 'primary.contrastText';

  return (
    <Draggable draggableId={taskId} index={index}>
      {(provided) => (
        <Box
          mb={3}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <BlankCard>
            <Box px={2} py={1} display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" sx={{ color: 'text.secondary' }}>
                <AccessTime fontSize="10" />
                <Typography variant="body2" sx={{ ml: 0.5, fontSize: 11 }}>
                  {new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  }).format(new Date(editedTask.created_at))}
                </Typography>
              </Box>

              <Box>
                <Box display="flex" justifyContent="flex-end">
                  <Rating
                    name="qualification"
                    value={0}
                    max={5}
                    size="small"
                    readOnly
                    sx={{ ml: 1 }}
                    icon={<WbSunny fontSize="inherit" sx={{ color: theme.palette.warning.main }} />}
                    emptyIcon={
                      <WbSunny fontSize="inherit" sx={{ color: theme.palette.action.disabled }} />
                    }
                  />
                </Box>
              </Box>
            </Box>
            <Box px={2} py={0} display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography fontSize="14px" variant="h6">
                  {editedTask.name} teste
                </Typography>
              </Box>

              <Box>
                <Avatar
                  src={'/images/profile/user-1.jpg'}
                  alt={'ImagemPerfil'}
                  sx={{ borderRadius: '100%', width: 35, height: 35 }}
                />
              </Box>
            </Box>
            <Box>
              {editedTask.taskImage && (
                <img
                  src={editedTask.taskImage}
                  alt="Task Image"
                  className="img-fluid"
                  style={{ width: '100%', height: '106px' }}
                />
              )}
            </Box>
            {editedTask.taskText && (
              <Box px={2} py={1}>
                <Typography variant="body2">{editedTask.taskText}</Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1}>
              <Stack direction="row" gap={1}>
                <IconCalendar size="1rem" />
                <Typography variant="body2">{formatDate(editedTask.date)}</Typography>
              </Stack>
              <Box>
                <Chip
                  size="small"
                  label={editedTask.taskProperty}
                  sx={{
                    backgroundColor,
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 400,
                  }}
                />
              </Box>
            </Box>
          </BlankCard>
        </Box>
      )}
    </Draggable>
  );
};

export default TaskData;
