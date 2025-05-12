import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import DocumentTypeSelect from '@/app/components/apps/attachment/documentTypeSelect';
import attachmentService from '@/services/attachmentService';
import { useTheme } from '@emotion/react';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';

const EditAttachmentModal = ({
  open,
  onClose,
  attachmentId,
  appLabel,
  hideStatus = true,
  showFields = { description: true },
  onUpdateAttachment,
}) => {
  const [attachment, setAttachment] = useState(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  useEffect(() => {
    const fetchAttachment = async () => {
      if (!attachmentId) return;
      try {
        const response = await attachmentService.find(attachmentId);
        setAttachment(response);
      } catch (error) {
        console.error('Erro ao buscar anexo:', error);
        enqueueSnackbar('Erro ao buscar dados do anexo.', { variant: 'error' });
      }
    };
    fetchAttachment();
  }, [attachmentId]);

  const handleAttachmentChange = (key, value) => {
    setAttachment((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      setFile(newFile);
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
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleSave = async () => {
    if (!attachment?.document_type) {
      enqueueSnackbar('O tipo de documento é obrigatório.', { variant: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('description', attachment.description || '');
      formData.append('document_type', attachment.document_type);
      formData.append('document_subtype', attachment.document_subtype || '');
      if (!hideStatus) {
        formData.append('status', attachment.status || 'EA');
      }
      if (file) {
        formData.append('file', file);
      }

      const response = await attachmentService.update(attachmentId, formData);
      enqueueSnackbar('Anexo atualizado com sucesso.', { variant: 'success' });
      onUpdateAttachment?.(response);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar anexo:', error);
      enqueueSnackbar('Erro ao atualizar anexo.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const statusDoc = [
    { value: 'EA', label: 'Em Análise', color: theme.palette.info.main },
    { value: 'P', label: 'Parcial', color: theme.palette.info.main },
    { value: 'A', label: 'Aprovado', color: theme.palette.success.main },
    { value: 'R', label: 'Reprovado', color: theme.palette.error.main },
  ];

  if (!attachment) return null;

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
        <Typography variant="h6" mb={2}>Editar Anexo</Typography>

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
            Arraste e solte ou clique para substituir o arquivo
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*,application/pdf"
          />
        </Paper>

        {file && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Novo arquivo selecionado: {file.name}
          </Typography>
        )}

        <DocumentTypeSelect
          appLabel={appLabel}
          documentType={attachment.document_type}
          documentSubtype={attachment.document_subtype}
          handleChange={handleAttachmentChange}
        />

        {!hideStatus && (
          <FormSelect
            value={attachment.status || ''}
            onChange={(e) => handleAttachmentChange('status', e.target.value)}
            options={statusDoc}
            sx={{ mt: 2 }}
          />
        )}

        {showFields.description && (
          <TextField
            fullWidth
            label="Descrição"
            value={attachment.description || ''}
            onChange={(e) => handleAttachmentChange('description', e.target.value)}
            margin="normal"
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditAttachmentModal;
