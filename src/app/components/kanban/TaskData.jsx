'use client';
import React, { useContext, useState } from 'react';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import { Draggable } from 'react-beautiful-dnd';
import {
  Avatar,
  Box,
  LinearProgress,
  Rating,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import BlankCard from '../shared/BlankCard';
import {
  AccessTime,
  LocalPhone,
  PersonOutline,
  Start,
  WbSunny,
} from '@mui/icons-material';
import ChipDeadLine from './components/Chipdead-line';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import EditLeadModal from './TaskModal/EditLeadModal';

const TaskData = ({ task, index }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [showEditModal, setShowEditModal] = useState(false);

  const { setError, setLoadingLeadsIds, loadingLeadsIds, updateTask } =
    useContext(KanbanDataContext);
  const [editedTask, setEditedTask] = useState(task);
  const taskId = task.id ? task.id.toString() : task.task;

  const changeQualification = async (event, newValue) => {
    try {
      setLoadingLeadsIds((prev) => [...prev, taskId]);
      const response = await leadService.patchLead(taskId, { qualification: newValue });
      updateTask(task.id, response);
      setEditedTask(response);
      enqueueSnackbar(`Qualificação do lead "${editedTask.name}" foi alterada para: ${newValue}`, { variant: 'success' });
    } catch (error) {
      setError(error.message);
      enqueueSnackbar('Ocorreu um erro ao alterar a qualificação do lead', { variant: 'error' });
    } finally {
      setLoadingLeadsIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  return (
    <Draggable draggableId={taskId} index={index}>
      {(provided) => (
        <>
          <Box
            mb={3}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => setShowEditModal(true)}
            boxShadow={1}
            border= {1}
            borderColor={theme.palette.grey[100]}
          >
            <BlankCard>
              {loadingLeadsIds.includes(taskId) && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                </Box>
              )}
              <Box
                mt={1}
                px={2}
                py={1}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ color: 'text.secondary' }}
                >
                  <ChipDeadLine status={'P'} />

                  <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={0.5}>
                  <AccessTime sx={{ fontSize: "9px", color: "#ADADAD" }} />
                  <Typography variant="body2" sx={{ fontSize: "9px", color: "#ADADAD" }}>
                    {editedTask.created_at
                      ? new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      }).format(new Date(editedTask.created_at))
                      : '-'}
                  </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Box display="flex" justifyContent="flex-end">
                    <Rating
                      name="qualification"
                      value={editedTask.qualification}
                      max={5}
                      size="small"
                      onClick={(event) => event.stopPropagation()}
                      onChange={changeQualification}
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
                    {editedTask.name}
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
              {editedTask?.origin && (
                <Box px={2} py={0} display="flex" alignItems="center" gap={0.5}>
                  <Start fontSize="10" />
                  <Typography variant="body2">Origem: {editedTask?.origin?.name}</Typography>
                </Box>
              )}
              {editedTask?.phone && (
                <Box px={2} py={0.5} display="flex" alignItems="center" gap={0.5}>
                  <LocalPhone fontSize="10" />
                  <Typography variant="body2">{editedTask?.phone}</Typography>
                </Box>
              )}


              <Box
                display="flex"
                alignItems="center"
                px={2}
                py={1}
                mt={1}
                sx={{ backgroundColor: 'grey.100', gap: 0.5 }}
              >
                <PersonOutline fontSize="8" />
                <Typography variant="body2" fontSize="10px">
                  <strong>Responsável:</strong> {editedTask?.seller?.complete_name}
                </Typography>
              </Box>
            </BlankCard>
          </Box>

          
          <EditLeadModal
            showModal={showEditModal}
            onClose={() => setShowEditModal(false)}
            leadId={editedTask.id}
          />
        </>
      )}
    </Draggable>
  );
};

export default TaskData;
