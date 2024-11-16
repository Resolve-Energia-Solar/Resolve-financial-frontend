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
  useTheme,
  Skeleton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { useState } from 'react';

const AttachmentList = ({ attachments, handleDeleteClick, loading }) => {
  const theme = useTheme();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
      return <ImageIcon sx={{ color: theme.palette.primary.main }} />;
    } else if (ext === 'pdf') {
      return <PictureAsPdfIcon sx={{ color: theme.palette.error.main }} />;
    } else {
      return <DescriptionIcon sx={{ color: theme.palette.text.secondary }} />;
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await handleDeleteClick(id);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao deletar o arquivo:', error);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteFile(fileToDelete.id);
  };

  return (
    <Box>
      <Typography variant="h6">Anexos</Typography>
      <List>
        {loading ? (
          Array.from(new Array(3)).map((_, index) => (
            <ListItem key={index} sx={{ borderBottom: `1px dashed ${theme.palette.divider}` }}>
              <Stack direction="row" alignItems="center" spacing={2} width="100%">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="60%" height={20} />
              </Stack>
            </ListItem>
          ))
        ) : Array.isArray(attachments) && attachments.length > 0 ? (
          attachments.map((file, index) => (
            <ListItem key={index} sx={{ borderBottom: `1px dashed ${theme.palette.divider}` }}>
              <Box sx={{ width: '100%' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    {getFileIcon(file.file)}
                    <Link
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ marginLeft: 2, color: theme.palette.primary.main }}
                    >
                      {file.description}
                    </Link>
                  </Stack>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setFileToDelete(file);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon sx={{ color: theme.palette.error.main }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </Stack>
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color={theme.palette.text.secondary}>
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
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: theme.palette.text.primary }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} autoFocus sx={{ color: theme.palette.error.main }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttachmentList;
