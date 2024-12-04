import {
  Grid,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Modal,
  CircularProgress,
  Alert,
  useTheme,
  Link,
} from '@mui/material';
import { useState } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import useAttachmentForm from '@/hooks/attachments/useAttachmentsForm';

export default function FileUpload({ objectId, contentType }) {
  const theme = useTheme();
  const { formErrors, handleChange, handleSendFile, selectedFile, setSelectedFile, loading } =
    useAttachmentForm();

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop();
    if (['pdf'].includes(extension)) return <PictureAsPdfIcon />;
    if (['jpg', 'jpeg', 'png'].includes(extension)) return <ImageIcon />;
    return <DescriptionIcon />;
  };

  const documentTypes = [
    { label: 'CPF', icon: <ImageIcon />, id: 'image-upload' },
    { label: 'Conta de Luz', icon: <PictureAsPdfIcon />, id: 'pdf-upload' },
    { label: 'Documento', icon: <DescriptionIcon />, id: 'doc-upload' },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {documentTypes.map((doc) => (
          <Grid item xs={3} key={doc.id}>
            <Box
              sx={{
                border: `2px dashed ${theme.palette.primary.main}`,
                padding: 2,
                textAlign: 'center',
                borderRadius: 1,
                backgroundColor: theme.palette.background.default,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
              onClick={() => document.getElementById('file-upload').click()} // Abre o upload ao clicar
            >
              {doc.icon}
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                {doc.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                <Link
                  href="https://example.com/document-url" // substitua pela URL do documento
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  onClick={(e) => e.stopPropagation()} // Evita que o clique no link abra o modal
                >
                  <Typography variant="subtitle2" color="primary">
                    Abrir Documento
                  </Typography>
                  <OpenInNewIcon fontSize="small" sx={{ marginLeft: 0.5 }} />
                </Link>
              </Box>
              <input type="file" id="file-upload" hidden onChange={handleFileSelect} />
            </Box>
          </Grid>
        ))}

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
            <Typography id="file-upload-modal" variant="h6" sx={{ marginBottom: 2 }}>
              Selecione seu arquivo
            </Typography>

            {formErrors.file && <Alert severity="error">{formErrors.file}</Alert>}

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
      </Grid>
    </Box>
  );
}
