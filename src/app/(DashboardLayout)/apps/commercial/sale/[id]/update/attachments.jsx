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
  CircularProgress, // Importar o CircularProgress para o indicador de loading
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
import { Link } from '@mui/material'; 

export default function FileUpload({ objectId, contentType }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false); // Adicionado estado de loading

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
      return <ImageIcon />;
    } else if (ext === 'pdf') {
      return <PictureAsPdfIcon />;
    } else {
      return <DescriptionIcon />;
    }
  };

  const handleSendFile = async () => {
    setLoading(true); // Ativar loading
    await handleSave();
    if (success) {
      const updatedAttachments = await attachmentService.getAttachments(objectId);
      setAttachments(updatedAttachments.results);
    }
    setLoading(false); // Desativar loading após o envio
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

  const resetForm = () => {
    setSelectedFile(null);
    handleChange('file', null); // Limpar o campo de arquivo
    handleChange('description', ''); // Limpar o campo de descrição
  };

  useEffect(() => {
    if (success) {
      resetForm();

      handleCloseModal();
      const fetchAttachments = async () => {
        const updatedAttachments = await attachmentService.getAttachments(objectId);
        setAttachments(updatedAttachments.results);
      };
      fetchAttachments();
    }
  }, [success]);

  useEffect(() => {
    const fetchAttachments = async () => {
      const updatedAttachments = await attachmentService.getAttachments(objectId);
      setAttachments(updatedAttachments.results);
    };
    fetchAttachments();
  }, [objectId]);

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        <Grid item sm={12} lg={6}>
          <Box
            sx={{
              border: '2px dashed #5D87FF',
              padding: 5,
              textAlign: 'center',
              borderRadius: 1,
              backgroundColor: '#f9f9f9',
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
            <UploadFileIcon sx={{ fontSize: 50, marginBottom: 2, color: '#5D87FF' }} />
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
              bgcolor: 'background.paper',
              border: '2px solid #000',
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
                border: '2px dashed #5D87FF',
                padding: 5,
                textAlign: 'center',
                borderRadius: 1,
                backgroundColor: '#f9f9f9',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <UploadFileIcon sx={{ fontSize: 50, marginBottom: 2, color: '#5D87FF' }} />
              <Typography>Clique para adicionar um arquivo</Typography>
              <input type="file" id="file-upload" hidden onChange={handleFileSelect} />
            </Box>

            {/* Description */}
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

            {/* Show selected file */}
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

            <Button onClick={handleSendFile} sx={{ marginTop: 2 }} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Enviar'}
            </Button>
            <Button
              onClick={handleCloseModal}
              sx={{ marginTop: 2, marginLeft: 1 }}
              variant="outlined"
              disabled={loading} // Desabilitar o botão de fechar enquanto estiver carregando
            >
              Fechar
            </Button>
          </Box>
        </Modal>

        {/* Dialog de confirmação para exclusão */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você tem certeza de que deseja excluir este arquivo?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={handleConfirmDelete} color="primary">Excluir</Button>
          </DialogActions>
        </Dialog>

        <Grid item sm={12} lg={6}>
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
                <IconButton edge="end" aria-label="delete" onClick={() => {
                  setFileToDelete(file);
                  setOpenDeleteDialog(true);
                }}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </Stack>
          </Box>
        </ListItem>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">Nenhum arquivo anexado.</Typography>
    )}
  </List>
</Grid>

      </Grid>
    </Box>
  );
}
