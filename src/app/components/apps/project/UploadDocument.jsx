// UploadDocument.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import projectService from '@/services/projectService';

const UploadDocument = ({ projectId }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'text/csv'];
      const maxSize = 20 * 1024 * 1024; // 20MB

      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadStatus('error');
        setErrorMessage('Tipo de arquivo não permitido. Apenas arquivos PDF e CSV são permitidos.');
        setOpenSnackbar(true);
        return;
      }

      if (selectedFile.size > maxSize) {
        setUploadStatus('error');
        setErrorMessage(
          `O arquivo excede o tamanho máximo permitido de ${maxSize / (1024 * 1024)}MB.`,
        );
        setOpenSnackbar(true);
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setUploadStatus(null);
      setErrorMessage('');
      setOpenSnackbar(false);
      setUploadProgress(0);
      console.log('Arquivo selecionado:', selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);
    setOpenSnackbar(false);
    setUploadProgress(0);

    const formData = new FormData();

    if (typeof projectId === 'object' && projectId !== null) {
      formData.append('project_id', projectId.id); 
    } else {
      formData.append('project_id', projectId);
    }

    formData.append('file', file);

    try {
      console.log('Conteúdo do FormData:');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await projectService.insertMaterial(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      setUploadStatus('success');
      setOpenSnackbar(true);
      console.log('Arquivo enviado com sucesso:', response);

      setFile(null);
      setFileName('');
      setUploadProgress(0);
    } catch (error) {
      setUploadStatus('error');
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Ocorreu um erro no upload do arquivo.');
      }
      setOpenSnackbar(true);
      console.error('Erro ao enviar o arquivo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, marginTop: 2 }}>
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          <CloudUploadIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Subir Lista de Materiais
        </Typography>

        <Box
          role="button"
          tabIndex={0}
          aria-label="Upload de arquivo"
          onClick={() => document.getElementById('upload-button-file').click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              document.getElementById('upload-button-file').click();
            }
          }}
          sx={{
            width: '100%',
            padding: 2,
            border: '2px dashed #ccc',
            borderRadius: 2,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9',
            '&:hover': {
              backgroundColor: '#f1f1f1',
            },
          }}
        >
          <CloudUploadIcon color="action" sx={{ fontSize: 40 }} />
          <Typography variant="body1" color="textSecondary">
            Arraste e solte um arquivo CSV ou PDF aqui, ou clique para selecionar
          </Typography>
        </Box>

        <input
          accept=".csv,.pdf"
          style={{ display: 'none' }}
          id="upload-button-file"
          type="file"
          onChange={handleUpload}
        />

        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}

        {fileName && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">Arquivo selecionado: {fileName}</Typography>
            {uploadStatus === 'success' ? (
              <CheckCircleIcon color="success" />
            ) : uploadStatus === 'error' ? (
              <ErrorIcon color="error" />
            ) : null}
          </Stack>
        )}

        {file && (
          <>
            {isUploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Progresso do Upload: {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFileUpload}
              startIcon={<CloudUploadIcon />}
              sx={{ marginTop: '16px' }}
              disabled={isUploading}
            >
              {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
            </Button>
          </>
        )}
      </Stack>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {uploadStatus === 'success' ? (
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Arquivo enviado com sucesso!
          </Alert>
        ) : uploadStatus === 'error' ? (
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {errorMessage || 'Ocorreu um erro no upload do arquivo.'}
          </Alert>
        ) : null}
      </Snackbar>
    </Paper>
  );
};

export default UploadDocument;
