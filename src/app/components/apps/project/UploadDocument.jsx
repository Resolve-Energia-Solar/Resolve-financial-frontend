import React, { useEffect, useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import projectMaterialsService from '@/services/projectMaterialService';
import projectService from '@/services/projectService';

const UploadDocument = ({ projectId }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedAmount, setEditedAmount] = useState('');
  const [materials, setMaterials] = useState([]);
  const [project, setProject] = useState(null);

  console.log('Materiais:', materials);

  const fetchProject = async () => {
    try {
      const response = await projectService.getProjectById(projectId);
      setProject(response);
      setMaterials(response.materials || []);
    } catch (error) {
      console.log('Erro ao carregar projeto:', error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['text/csv'];
      const maxSize = 20 * 1024 * 1024;

      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadStatus('error');
        setErrorMessage('Tipo de arquivo não permitido. Apenas arquivos CSV são permitidos.');
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

      if (project.materials && project.materials.length > 0) {
        setOpenDialog(true);
      } else {
        handleFileUpload();
      }
    }
  };

  const handleFileUpload = async () => {
    setOpenDialog(false);

    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);
    setOpenSnackbar(false);
    setUploadProgress(0);

    const formData = new FormData();

    formData.append('project_id', project.id);
    formData.append('file', file);

    try {
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
      setErrorMessage(error.response?.data?.error || 'Ocorreu um erro no upload do arquivo.');
      setOpenSnackbar(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleEditStart = (id, currentAmount) => {
    setEditingId(id);
    setEditedAmount(currentAmount);
  };

  const handleEditSave = async (id) => {
    try {
      await projectMaterialsService.partialUpdateProjectMaterial(id, { amount: editedAmount });
      const updatedMaterials = materials.map((item) =>
        item.material.id === id ? { ...item, amount: editedAmount } : item,
      );

      fetchProject();
      setMaterials(updatedMaterials);
      setEditingId(null);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Delete a material from the project.
   * @param {number} id The material id to be deleted.
   * @returns {Promise<void>}
   */
  /******  097f8740-3680-4052-b8be-15ac2860cf76  *******/
  const handleDelete = async (id) => {
    try {
      await projectMaterialsService.deleteProjectMaterial(id);
      const updatedMaterials = materials.filter((item) => item.material.id !== id);
      fetchProject();
      setMaterials(updatedMaterials);
    } catch (error) {
      console.error('Erro ao apagar material:', error);
    }
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
            Arraste e solte um arquivo CSV aqui, ou clique para selecionar
          </Typography>
        </Box>

        <input
          accept=".csv"
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

      {materials.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: 4, maxHeight: 400, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nome do Material</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((item) => (
                <TableRow key={item.material.id}>
                  <TableCell>
                    <InventoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {item.material.name}
                  </TableCell>
                  <TableCell>
                    {editingId === item.material.id ? (
                      <TextField
                        value={editedAmount}
                        onChange={(e) => setEditedAmount(e.target.value)}
                        type="number"
                        size="small"
                      />
                    ) : (
                      parseFloat(item.amount).toLocaleString()
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(item.material.price)}</TableCell>
                  <TableCell>
                    {item.is_exit ? (
                      <CheckIcon sx={{ color: 'green' }} />
                    ) : (
                      <CloseIcon sx={{ color: 'red' }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.material.id ? (
                      <>
                        <IconButton onClick={() => handleEditSave(item.id)} color="primary">
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={() => setEditingId(null)} color="secondary">
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleEditStart(item.material.id, item.amount)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item.material.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Já existem materiais adicionados. Deseja adicionar mais materiais?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleFileUpload} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UploadDocument;
