import AttachmentDetails from '@/app/components/shared/AttachmentDetails';
import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import scheduleService from '@/services/scheduleService';
import AttachmentDetailsSchedule from '../../components/AttachmentDetails';
import { useSelector } from 'react-redux';

const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;
const CONTEXT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;

function AttachmentSchedule({ scheduleId }) {
  const [attachments, setAttachments] = useState([]);
  const [openModalAddAttachment, setOpenModalAddAttachment] = useState(false);
  const [saleId, setSaleId] = useState(null);
  const [projectId, setProjectId] = useState(null);

  const userPermissions = useSelector((state) => state.user.permissions);


  const handleOpen = () => setOpenModalAddAttachment(true);
  const handleClose = () => setOpenModalAddAttachment(false);

  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await scheduleService.getScheduleByIdAttachments(scheduleId);
        setAttachments(response.attachments);
        setSaleId(response?.project?.sale?.id);
        setProjectId(response?.project?.id);
      } catch (error) {
        console.error('Error fetching attachments:', error);
      }
    };
    fetchAttachments();
  }, [scheduleId, refresh]);

  return (
    <>
      <Box pt={2}>
        {userPermissions.includes('core.add_attachment_schedule') && (
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Adicionar Anexos
          </Button>
        )}

        <AttachmentDetailsSchedule objectIds={attachments} />
      </Box>

      <Dialog open={openModalAddAttachment} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Adicionar Anexos</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Anexos da Venda
          </Typography>
          <AttachmentDetailsSchedule
            objectIds={attachments}
            scheduleId={scheduleId}
            contentType={CONTEXT_TYPE_SALE_ID}
            objectId={saleId}
            onRefresh={handleRefresh}
          />

          <Typography variant="h6" gutterBottom>
            Anexos do Projeto
          </Typography>
          <AttachmentDetailsSchedule
            objectIds={attachments}
            scheduleId={scheduleId}
            contentType={CONTEXT_TYPE_PROJECT_ID}
            objectId={projectId}
            onRefresh={handleRefresh}
          />
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
