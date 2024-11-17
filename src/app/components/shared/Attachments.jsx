'use client';
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
  Input,
} from '@mui/material';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import useAttachmentForm from '@/hooks/attachments/useAttachmentsForm';
import attachmentService from '@/services/attachmentService';
import { DocumentScanner, UploadFile } from '@mui/icons-material';


export default function Attachments({ objectId, contentType, documentTypes }) {
  const theme = useTheme();
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const {
    formData,
    clearForm,
    handleChange,
    handleSave,
    formErrors,
    setFormErrors,
    success,
    refreshSuccess,
    loading,
  } = useAttachmentForm(
    selectedAttachment || null,
    selectedAttachment?.id || null,
    selectedAttachment?.object_id || objectId,
    selectedAttachment?.content_type?.id || parseInt(contentType),
  );

  console.log('formData: ', formData);

  const [attachments, setAttachments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOpenModal = (attachment, documentType) => {
    setOpenModal(true);
    if (documentType) handleChange('document_type_id', parseInt(documentType));
    if (attachment)
      setSelectedAttachment({ ...attachment, content_type_id: attachment?.content_type?.id, document_type_id: attachment?.document_type?.id });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAttachment(null);
    setSelectedFile(null);
    setFormErrors({});
    clearForm();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleChange('file', file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await attachmentService.getAttanchmentByIdProject(objectId);
        setAttachments(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    fetchData();
  }, [objectId, contentType, refreshSuccess]);

  useEffect(() => {
    handleCloseModal();
  }, [refreshSuccess]);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop();
    if (['pdf'].includes(extension)) return <PictureAsPdfIcon />;
    if (['jpg', 'jpeg', 'png'].includes(extension)) return <ImageIcon />;
    return <DescriptionIcon />;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {attachments.map((attachment) => (
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
                {attachment?.document_type?.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}></Box>
            </Box>
          </Grid>
        ))}

        {documentTypes
          .filter((doc) => !attachments.some((att) => att?.document_type?.id === parseInt(doc.id, 10)))
          .map((doc) => (
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
                onClick={() => handleOpenModal(null, doc.id)}
              >
              <DescriptionIcon />
              <Typography variant="caption" sx={{ marginTop: 1 }}>
                  {doc.name}
                </Typography>
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
              <UploadFile
                sx={{ fontSize: 50, marginBottom: 2, color: theme.palette.primary.main }}
              />
              <Typography>Clique para adicionar um arquivo</Typography>
              <input type="file" id="file-upload" hidden onChange={handleFileSelect} />
            </Box>

            <CustomTextField
              label="Descrição"
              name="description"
              placeholder="Descrição do arquivo"
              fullWidth
              multiline
              rows={4}
              sx={{ marginTop: 2 }}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              {...(formErrors.description && { error: true, helperText: formErrors.description })}
            />

            {selectedFile && (
              <List
                sx={{
                  marginTop: 2,
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: 1,
                }}
              >
                <ListItem>
                  {getFileIcon(selectedFile.name)}
                  <Link
                    href={URL.createObjectURL(selectedFile)}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ marginLeft: 2 }}
                  >
                    {selectedFile.name.length > 30
                      ? `${selectedFile.name.slice(0, 30)}...`
                      : selectedFile.name}
                  </Link>
                </ListItem>
              </List>
            )}

            {formData.file?.length > 0 && !selectedFile && (
              <List
                sx={{
                  marginTop: 2,
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: 1,
                }}
              >
                <ListItem>
                  {getFileIcon('file')}
                  <Link href={formData.file} target="_blank" rel="noopener noreferrer">
                    {formData.file?.length > 30
                      ? `${formData.file.slice(0, 30)}...`
                      : formData.file}
                  </Link>
                </ListItem>
              </List>
            )}

            <Button
              onClick={handleSave}
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