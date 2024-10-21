'use client';
import {
  Box,
  List,
  ListItem,
  Link,
  Stack,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

import { useState } from 'react';

const AttachmentList = ({ attachments, handleDeleteClick }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
      return <ImageIcon />;
    } else if (ext === 'pdf') {
      return <PictureAsPdfIcon />;
    } else {
      return <DescriptionIcon />;
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await attachmentService.deleteAttachment(id);
      const updatedAttachments = await attachmentService.getAttachments(objectId);
      setAttachments(updatedAttachments.results);
    } catch (error) {
      console.error('Erro ao deletar o arquivo:', error);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteFile(fileToDelete.id);
    setOpenDeleteDialog(false);
    setFileToDelete(null);
  };

  return (
    <Box>
      <Typography variant="h6">Anexos</Typography>
      <List>
        {Array.isArray(attachments) && attachments.length > 0 ? (
          attachments.map((file, index) => (
            <ListItem key={index} sx={{ borderBottom: '1px dashed #ccc' }}>
              <Box sx={{ width: '100%' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    {getFileIcon(file.file)}
                    <Link
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ marginLeft: 2 }}
                    >
                      {file.description}
                    </Link>
                  </Stack>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(file)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </Stack>
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            Nenhum arquivo anexado.
          </Typography>
        )}
      </List>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Deletar Anexo</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja deletar este arquivo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttachmentList;
