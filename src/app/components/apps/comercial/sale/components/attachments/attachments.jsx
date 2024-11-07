import {
  Grid,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  Modal,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Link,
  useTheme,
  Skeleton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import useAttachmentForm from '@/hooks/attachments/useAttachmentsForm';
import attachmentService from '@/services/attachmentService';

export default function FileUpload({ objectId, contentType }) {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAttachments, setLoadingAttachments] = useState(true);

  const { formData, handleChange, handleSave, formErrors, success } = useAttachmentForm(
    null,
    null,
    objectId,
    contentType,
  );

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleChange('file', file);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
  };

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

  const handleSendFile = async () => {
    setLoading(true);
    setLoadingAttachments(true);
    await handleSave();
    if (success) {
      const updatedAttachments = await attachmentService.getAttachments(objectId);
      setAttachments(updatedAttachments.results);
      setLoadingAttachments(false);
      handleCloseModal();
    }
    setLoading(false);
    setLoadingAttachments(false);
  };

  const handleDeleteFile = async (id) => {
    setFileToDelete(attachments.find((attachment) => attachment.id === id));
    setOpenDeleteDialog(true);
    try {
      await attachmentService.deleteAttachment(id);
      const updatedAttachments = await attachmentService.getAttachments(objectId);
      setLoadingAttachments(true);
      setAttachments(updatedAttachments.results);
    } catch (error) {
      console.error('Erro ao deletar o arquivo:', error);
    } finally {
      setLoadingAttachments(false);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteFile(fileToDelete.id);
    setOpenDeleteDialog(false);
    setFileToDelete(null);
  };

  const resetForm = () => {
    setSelectedFile(null);
    handleChange('file', null);
    handleChange('description', '');
  };

  useEffect(() => {
    setLoadingAttachments(true);
    if (success) {
      resetForm();
      handleCloseModal();
      const fetchAttachments = async () => {
        const updatedAttachments = await attachmentService.getAttachmentByIdSale(objectId);
        setAttachments(updatedAttachments.results);
      };
      fetchAttachments();
    }
    setLoadingAttachments(false);
  }, [success]);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        setLoadingAttachments(true);
        const updatedAttachments = await attachmentService.getAttachmentByIdSale(objectId);
        setAttachments(updatedAttachments.results);
      } catch (error) {
        console.error('Erro ao carregar anexos:', error);
      } finally {
        setLoadingAttachments(false);
      }
    };

    fetchAttachments();
  }, [objectId]);

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        <Grid item sm={12} lg={6}>
          <Box
            sx={{
              border: `2px dashed ${theme.palette.primary.main}`,
              padding: 5,
              textAlign: 'center',
              borderRadius: 1,
              backgroundColor: theme.palette.background.default,
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={handleOpenModal}
          >
            <UploadFileIcon
              sx={{ fontSize: 50, marginBottom: 2, color: theme.palette.primary.main }}
            />
            <Typography>Clique para adicionar um arquivo</Typography>
          </Box>
        </Grid>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="file-upload-modal"
          aria-describedby="upload-your-file"
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
            <Typography id="file-upload-modal" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
              Selecione seu arquivo
            </Typography>

            {formErrors.file && <Alert severity="error">{formErrors.file}</Alert>}

            <Box
              sx={{
                border: `2px dashed ${theme.palette.primary.main}`,
                padding: 5,
                textAlign: 'center',
                borderRadius: 1,
                backgroundColor: theme.palette.background.default,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <UploadFileIcon
                sx={{ fontSize: 50, marginBottom: 2, color: theme.palette.primary.main }}
              />
              <Typography>Clique para adicionar um arquivo</Typography>
              <input type="file" id="file-upload" hidden onChange={handleFileSelect} />
            </Box>

            <CustomTextField
              label="Descrição"
              name="description"
              placeholder="Descrição do arquivo"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              sx={{ marginTop: 2 }}
              onChange={(e) => handleChange('description', e.target.value)}
              {...(formErrors.description && { error: true, helperText: formErrors.description })}
            />

            {selectedFile && (
              <List sx={{ marginTop: 2 }}>
                <ListItem>
                  {getFileIcon(selectedFile.name)}
                  <ListItemText primary={selectedFile.name} sx={{ marginLeft: 2 }} />
                  <IconButton edge="end" aria-label="delete" onClick={() => setSelectedFile(null)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              </List>
            )}

            <Button
              onClick={handleSendFile}
              sx={{ marginTop: 2 }}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Enviar'}
            </Button>
            <Button
              onClick={handleCloseModal}
              sx={{ marginTop: 2, marginLeft: 1 }}
              variant="outlined"
              disabled={loading}
            >
              Fechar
            </Button>
          </Box>
        </Modal>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você tem certeza de que deseja excluir este arquivo?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={handleConfirmDelete} color="primary">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        <Grid item sm={12} lg={6}>
          <Typography variant="h6">Anexos</Typography>
          <List>
            {loadingAttachments ? (
              <>
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ marginBottom: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ marginBottom: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ marginBottom: 1 }} />
              </>
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
              <ListItem>
                <Typography variant="body2" color="textSecondary">
                  Nenhum arquivo encontrado
                </Typography>
              </ListItem>
            )}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}
