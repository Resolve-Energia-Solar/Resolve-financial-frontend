import React, { useState, useRef } from 'react';
import { Modal, Box, Typography, TextField, Button, Paper, CircularProgress } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import DocumentTypeSelect from '@/app/components/apps/attachment/documentTypeSelect';
import attachmentService from '@/services/attachmentService';

const AddAttachmentModal = ({
  appLabel,
  open,
  onClose,
  objectId,
  contentType,
  onAddAttachment,
  showFields = { description: true },
}) => {
  const [newAttachment, setNewAttachment] = useState({
    file: null,
    description: '',
    document_type: '',
    document_subtype: ''
  });
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAttachment((prev) => ({ ...prev, file }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setNewAttachment((prev) => ({ ...prev, file }));
    }
  };

  const handleDescriptionChange = (e) => {
    setNewAttachment((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleSaveAttachment = async () => {
    if (!newAttachment.file || !newAttachment.document_type) {
      enqueueSnackbar('O tipo de documento e o arquivo são obrigatórios.', { variant: 'warning' });
      return;
    }
    if (newAttachment.file) {
      setLoading(true);
      if (objectId) {
        const formData = new FormData();
        formData.append('file', newAttachment.file);
        formData.append('description', newAttachment.description);
        formData.append('object_id', objectId);
        formData.append('content_type', contentType);
        formData.append('document_type', newAttachment.document_type);
        formData.append('document_subtype', newAttachment.document_subtype);
        formData.append('status', '');
        try {
          const response = await attachmentService.create(formData);
          onAddAttachment(response);
        } catch (error) {
          console.error('Erro ao salvar anexo:', error);
          enqueueSnackbar('Erro ao salvar anexo: ', error.message, { variant: 'error' });
        }
      } else {
        onAddAttachment(newAttachment);
      }
      setLoading(false);
      onClose();
      setNewAttachment({ file: null, description: '' });
    }
  };

  const handleAttachmentChange = (key, value) => {
    setNewAttachment((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" mb={2}>
          Novo Anexo
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            textAlign: 'center',
            borderColor: dragOver ? 'primary.main' : 'grey.400',
            backgroundColor: dragOver ? 'grey.100' : 'inherit',
            cursor: 'pointer',
            mb: 2,
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <UploadFile sx={{ fontSize: 40, color: 'grey.600' }} />
          <Typography variant="body2">
            Arraste e solte ou clique para selecionar um arquivo
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*,application/pdf"
          />
        </Paper>
        {newAttachment.file && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Arquivo selecionado: {newAttachment.file.name}
          </Typography>
        )}
        <DocumentTypeSelect
          appLabel={appLabel}
          documentType={newAttachment.document_type}
          documentSubtype={newAttachment.document_subtype}
          handleChange={handleAttachmentChange}
        />
        {showFields.description && (
          <TextField
            fullWidth
            label="Descrição"
            value={newAttachment.description}
            onChange={handleDescriptionChange}
            margin="normal"
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={handleSaveAttachment} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddAttachmentModal;
