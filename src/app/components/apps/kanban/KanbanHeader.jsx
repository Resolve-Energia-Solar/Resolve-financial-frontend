'use client';
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function KanbanHeader({ boards, selectedBoard, columns, onBoardChange, onAddCategory, onAddLead }) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

  const handleShowCategoryModal = () => setShowCategoryModal(true);
  const handleCloseCategoryModal = () => setShowCategoryModal(false);

  const handleShowLeadModal = () => setShowLeadModal(true);
  const handleCloseLeadModal = () => setShowLeadModal(false);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleSaveCategory = () => {
    onAddCategory(categoryName);
    setCategoryName('');
    setShowCategoryModal(false);

    // Exibir feedback de sucesso ao adicionar uma coluna
    setSnackbarMessage('Coluna adicionada com sucesso!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleSaveLead = () => {
    onAddLead({
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      column: selectedColumn, // Passa a coluna selecionada ao criar o lead
    });
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
    setSelectedColumn('');
    setShowLeadModal(false);

    // Exibir feedback de sucesso ao adicionar um lead
    setSnackbarMessage('Lead adicionado com sucesso!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      <Box display="flex" alignItems="center" gap={2}>
        {/* Select de Quadros */}
        <FormControl variant="outlined">
          <InputLabel id="select-board-label">Selecionar Quadro</InputLabel>
          <Select
            labelId="select-board-label"
            value={selectedBoard}
            onChange={onBoardChange}
            label="Selecionar Quadro"
            sx={{
              minWidth: '200px',
              bgcolor: '#f0f0f0',
              borderRadius: '10px',
              '&:hover': {
                bgcolor: '#e0e0e0',
              },
            }}
          >
            {boards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Ocultar botões se nenhum quadro for selecionado */}
      {selectedBoard && (
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={handleShowLeadModal}
            startIcon={<AddIcon />}
          >
            Adicionar Lead
          </Button>
          <Button
            variant="contained"
            onClick={handleShowCategoryModal}
            startIcon={<AddIcon />}
          >
            Adicionar Coluna
          </Button>
        </Box>
      )}

      {/* Modal para adicionar coluna */}
      <Dialog open={showCategoryModal} onClose={handleCloseCategoryModal}>
        <DialogTitle>Adicionar Coluna</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Coluna"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryModal}>Cancelar</Button>
          <Button onClick={handleSaveCategory} disabled={!categoryName}>Adicionar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal para adicionar lead */}
      <Dialog open={showLeadModal} onClose={handleCloseLeadModal}>
        <DialogTitle>Adicionar Lead</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Lead"
            fullWidth
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email do Lead"
            fullWidth
            value={leadEmail}
            onChange={(e) => setLeadEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Telefone do Lead"
            fullWidth
            value={leadPhone}
            onChange={(e) => setLeadPhone(e.target.value)}
          />

          {/* Select para selecionar a coluna do Lead */}
          <FormControl fullWidth margin="dense">
            <InputLabel id="select-column-label">Selecionar Coluna</InputLabel>
            <Select
              labelId="select-column-label"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              label="Selecionar Coluna"
            >
              {columns.map((column) => (
                <MenuItem key={column.id} value={column.id}>
                  {column.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeadModal}>Cancelar</Button>
          <Button onClick={handleSaveLead} disabled={!leadName || !leadEmail || !leadPhone || !selectedColumn}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default KanbanHeader;
