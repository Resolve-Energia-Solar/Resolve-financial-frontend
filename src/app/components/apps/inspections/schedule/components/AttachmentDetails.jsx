'use client';
import {
  Grid,
  Typography,
  Box,
  Modal,
  List,
  ListItem,
  Link,
  useTheme,
  Button,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import attachmentService from '@/services/attachmentService';
import AttachmentsSkeleton from '@/app/components/shared/AttachmentsSkeleton';
import scheduleService from '@/services/scheduleService';
import { useSnackbar } from 'notistack';

export default function AttachmentDetailsSchedule({
  objectId,
  scheduleId,
  contentType,
  objectIds,
  onRefresh,
}) {
  const theme = useTheme();
  const [attachments, setAttachments] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attaching, setAttaching] = useState(false);
  const [attachmentIds, setAttachmentIds] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);

    if (!objectId && !contentType) {
      setAttachments([...objectIds]);
    }

    if (objectIds) {
      setAttachmentIds(objectIds.map((obj) => obj.id));
    }

    const fetchData = async () => {
      try {
        const response = await attachmentService.index({
          object_id: objectId,
          content_type: contentType,
          limit: 30,
        });
        setAttachments([...attachments, ...response.results]);
      } catch (error) {
        console.error('Error fetching attachments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [objectId, contentType, objectIds]);

  const handleOpenModal = (attachment) => {
    setSelectedAttachment(attachment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAttachment(null);
  };

  const handleToggleAttachment = async (attachment) => {
    setAttaching(true);
    const isAttached = attachmentIds.includes(attachment.id);
    const newAttachmentIds = isAttached
      ? attachmentIds.filter((id) => id !== attachment.id)
      : [...attachmentIds, attachment.id];

    try {
      await scheduleService.patchSchedule(scheduleId, {
        attachments_id: newAttachmentIds,
      });
      setAttachmentIds(newAttachmentIds);
      onRefresh();
      enqueueSnackbar(
        isAttached ? 'Anexo removido com sucesso!' : 'Anexo adicionado com sucesso!',
        { variant: 'success' },
      );
    } catch (error) {
      console.error('Error toggling attachment:', error);

      if (error?.response?.data && Object.keys(error.response.data).length) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          enqueueSnackbar(`${key}: ${value.join(' ')}`, { variant: 'error' });
        });
      }
    } finally {
      setAttaching(false);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop();
    if (['pdf'].includes(extension)) return <PictureAsPdfIcon />;
    if (['jpg', 'jpeg', 'png'].includes(extension)) return <ImageIcon />;
    return <DescriptionIcon />;
  };

  if (loading) {
    return <AttachmentsSkeleton />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {attachments.length ? (
          attachments.map((attachment) => (
            <Grid item xs={3} key={attachment.id}>
              <Box
                sx={{
                  border: `2px solid ${theme.palette.primary.main}`,
                  padding: 2,
                  textAlign: 'center',
                  borderRadius: 1,
                  backgroundColor: theme.palette.background.default,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  cursor: 'pointer',
                }}
                onClick={() => handleOpenModal(attachment)}
              >
                {getFileIcon(attachment.file)}
                <Typography variant="caption" sx={{ marginTop: 1 }}>
                  {attachment?.document_type?.name || 'Sem Tipo'}
                </Typography>
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2" align="center">
              Nenhum anexo cadastrado
            </Typography>
          </Grid>
        )}
      </Grid>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="attachment-details-modal"
        aria-describedby="view-attachment-details"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: theme.palette.background.paper,
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="attachment-details-modal"
            variant="h6"
            component="h2"
            sx={{ marginBottom: 2 }}
          >
            Detalhes do Anexo
          </Typography>
          {selectedAttachment ? (
            <List>
              <ListItem>
                <Typography variant="subtitle1">Nome:</Typography>
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  {selectedAttachment.name || 'Não especificado'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="subtitle1">Tipo de Documento:</Typography>
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  {selectedAttachment?.document_type?.name || 'Não especificado'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography variant="subtitle1">Arquivo:</Typography>
                <Link
                  href={selectedAttachment.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    marginLeft: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedAttachment.file?.split('/').pop()}
                </Link>
              </ListItem>
              <ListItem>
                <Typography variant="subtitle1">Descrição:</Typography>
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  {selectedAttachment.description || 'Sem descrição'}
                </Typography>
              </ListItem>
              {scheduleId && (
                <ListItem>
                  <Button
                    variant="contained"
                    color={attachmentIds.includes(selectedAttachment.id) ? 'error' : 'primary'}
                    sx={{ marginLeft: 1 }}
                    onClick={() => handleToggleAttachment(selectedAttachment)}
                    disabled={attaching}
                  >
                    {attaching ? (
                      <CircularProgress size={24} />
                    ) : attachmentIds.includes(selectedAttachment.id) ? (
                      'Desanexar'
                    ) : (
                      'Anexar'
                    )}
                  </Button>
                </ListItem>
              )}
            </List>
          ) : (
            <Typography variant="body2">Nenhum detalhe disponível.</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
