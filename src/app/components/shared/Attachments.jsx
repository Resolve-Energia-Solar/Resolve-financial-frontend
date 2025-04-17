'use client';
import {
  Grid,
  Typography,
  List,
  ListItem,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  Link,
  Box,
  Modal,
  Chip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import attachmentService from '@/services/attachmentService';
import { Add, Image, UploadFile } from '@mui/icons-material';
import AttachmentsSkeleton from './AttachmentsSkeleton';
import useAttachmentForm from '@/hooks/attachments/useAttachmentsForm';
import FormSelect from '../forms/form-custom/FormSelect';
import HasPermission from '../permissions/HasPermissions';
import { useSelector } from 'react-redux';

export default function Attachments({ objectId, contentType, documentTypes, canEdit = true }) {
  console.log('contentTypeAttachment: ', contentType);
  const theme = useTheme();
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [loading, setLoading] = useState(true);

  const options_document_types = documentTypes.map((docType) => ({
    value: docType.id,
    label: docType.name,
  }));

  const userPermissions = useSelector((state) => state.user.permissions);

  const statusDoc = [
    { value: 'EA', label: 'Em Análise', color: theme.palette.info.main },
    { value: 'A', label: 'Aprovado', color: theme.palette.success.main },
    { value: 'R', label: 'Reprovado', color: theme.palette.error.main },
  ];

  const {
    formData,
    clearForm,
    handleChange,
    handleSave,
    formErrors,
    setFormErrors,
    loading: formLoading,
    refreshSuccess,
  } = useAttachmentForm(
    selectedAttachment || null,
    selectedAttachment?.id || null,
    objectId,
    contentType,
  );

  formData.status ? formData.status : (formData.status = 'EA');

  const [attachments, setAttachments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOpenModal = (attachment, documentType) => {
    setOpenModal(true);
    if (documentType) handleChange('document_type', parseInt(documentType));
    if (attachment)
      setSelectedAttachment({
        ...attachment,
        content_type: attachment?.content_type,
        document_type: attachment?.document_type,
      });
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
      const timestamp = Date.now();
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      const extension = file.name.split('.').pop();
      const uniqueFileName = `${fileNameWithoutExt}_${timestamp}.${extension}`;

      const renamedFile = new File([file], uniqueFileName, { type: file.type });

      setSelectedFile(renamedFile);
      handleChange('file', renamedFile);
    }
  };

  useEffect(() => {
    if (selectedAttachment) {
      handleChange('description', selectedAttachment.description || "");
      handleChange('status', selectedAttachment.status || "EA");
      handleChange('document_type', selectedAttachment.document_type?.id || "");
      handleChange('content_type', selectedAttachment.content_type?.id || "");
      handleChange('object_id', selectedAttachment.object_id || objectId);
    } else {
      handleChange('description', "");
      handleChange('status', "EA");
      handleChange('document_type', "");
      handleChange('content_type', "");
      handleChange('object_id', objectId);
    }
  }, [selectedAttachment]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await attachmentService.index({
          expand: 'document_type,content_type',
          fields: 'id,file,document_type.name,document_type.id,status,content_type.id,description',
          object_id: objectId,
          content_type: contentType,
          limit: 30,
        });
        setAttachments(response.results);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
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
    if (['jpg', 'jpeg', 'png'].includes(extension)) return <Image />;
    return <DescriptionIcon />;
  };

  if (loading) {
    return <AttachmentsSkeleton />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {attachments.map((attachment) => (
          <Grid item xs={3} key={attachment.id}>
            <Box
              sx={{
                border: `2px solid ${
                  statusDoc?.find((s) => s.value === attachment.status)?.color ||
                  statusDoc?.find((s) => s.value === 'EA')?.color ||
                  theme.palette.primary.main
                }`,
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
              <Typography variant="caption" sx={{ marginTop: 0.3 }}>
                <Chip
                  label={
                    statusDoc?.find((s) => s.value === attachment?.status)
                      ? statusDoc?.find((s) => s.value === attachment?.status)?.label
                      : statusDoc?.find((s) => s.value === 'EA')?.label || 'EA'
                  }
                />
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}></Box>
            </Box>
          </Grid>
        ))}

        {documentTypes
          .filter(
            (doc) => !attachments.some((att) => att?.document_type?.id === parseInt(doc.id, 10)),
          )
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

        <Grid item xs={3}>
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
            onClick={() => handleOpenModal(null, null)}
          >
            <Add sx={{ fontSize: 30 }} />
            <Typography variant="caption" sx={{ marginTop: 1 }}>
              Adicionar Mais
            </Typography>
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
              <UploadFile
                sx={{ fontSize: 50, marginBottom: 2, color: theme.palette.primary.main }}
              />
              <Typography>Clique para adicionar um arquivo</Typography>
              <input type="file" id="file-upload" hidden onChange={handleFileSelect} />
            </Box>

            <FormSelect
              label="Tipo de Documento"
              options={options_document_types}
              value={formData.document_type}
              onChange={(e) => handleChange('document_type', e.target.value)}
            />

            <HasPermission
              permissions={['core.change_status_attachment_field']}
              userPermissions={userPermissions}
            >
              <FormSelect
                label="Status do Documento"
                options={statusDoc}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              />
            </HasPermission>

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

            {canEdit && (
              <Button
                onClick={handleSave}
                sx={{ marginTop: 2 }}
                variant="contained"
                disabled={formLoading}
              >
                {formLoading ? <CircularProgress size={24} /> : 'Enviar'}
              </Button>
            )}
            <Button
              onClick={handleCloseModal}
              sx={{ marginTop: 2, marginLeft: 1 }}
              variant="outlined"
              disabled={formLoading}
            >
              Fechar
            </Button>
          </Box>
        </Modal>
      </Grid>
    </Box>
  );
}
