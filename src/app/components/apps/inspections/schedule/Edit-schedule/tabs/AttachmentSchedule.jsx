import AttachmentDetails from '@/app/components/shared/AttachmentDetails';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import scheduleService from '@/services/scheduleService';
import AttachmentDetailsSchedule from '../../components/AttachmentDetails';
import { useSelector } from 'react-redux';
import getContentType from '@/utils/getContentType';
import { useSnackbar } from 'notistack';

function AttachmentSchedule({ scheduleId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [attachments, setAttachments] = useState([]);
  const [openModalAddAttachment, setOpenModalAddAttachment] = useState(false);
  const [saleId, setSaleId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [saleContentType, setSaleContentType] = useState(null);
  const [projectContentType, setProjectContentType] = useState(null);

  const userPermissions = useSelector((state) => state.user.permissions);
  const handleOpen = () => setOpenModalAddAttachment(true);
  const handleClose = () => setOpenModalAddAttachment(false);
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => setRefresh(!refresh);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await scheduleService.find(scheduleId);
        setAttachments(response.attachments);
        setSaleId(response?.project?.sale);
        setProjectId(response?.project?.id);
      } catch (error) {
        console.error('Error fetching attachments:', error);
        enqueueSnackbar(`Erro ao buscar anexos: ${error.message}`, { variant: 'error' });
      }
    };
    fetchAttachments();
  }, [scheduleId, refresh, enqueueSnackbar]);

  useEffect(() => {
    async function fetchContentTypes() {
      try {
        const saleType = await getContentType('resolve_crm', 'sale');
        const projectType = await getContentType('resolve_crm', 'project');
        setSaleContentType(saleType);
        setProjectContentType(projectType);
      } catch (error) {
        console.error('Erro ao buscar content types:', error);
        enqueueSnackbar(`Erro ao buscar content types: ${error.message}`, { variant: 'error' });
      }
    }
    fetchContentTypes();
  }, [enqueueSnackbar]);

  return (
    <>
      <Box pt={2}>
        {userPermissions.includes('core.add_attachment_schedule') && (
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Adicionar Anexos
          </Button>
        )}
        {/* Exibe anexos gerais (se houver) */}
        <AttachmentDetailsSchedule objectIds={attachments} />
      </Box>

      <Dialog open={openModalAddAttachment} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Adicionar Anexos</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Anexos da Venda
          </Typography>
          {saleContentType && saleId ? (
            <AttachmentDetailsSchedule
              objectIds={attachments}
              scheduleId={scheduleId}
              contentType={saleContentType}
              objectId={saleId}
              onRefresh={handleRefresh}
            />
          ) : (
            <Typography variant="body2">Carregando anexos da venda...</Typography>
          )}

          <Typography variant="h6" gutterBottom>
            Anexos do Projeto
          </Typography>
          {projectContentType && projectId ? (
            <AttachmentDetailsSchedule
              objectIds={attachments}
              scheduleId={scheduleId}
              contentType={projectContentType}
              objectId={projectId}
              onRefresh={handleRefresh}
            />
          ) : (
            <Typography variant="body2">Carregando anexos do projeto...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AttachmentSchedule;
