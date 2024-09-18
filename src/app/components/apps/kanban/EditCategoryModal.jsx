import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Alert } from "@mui/material";

const EditCategoryModal = ({ open, onClose, category, onSave }) => {
  const [editedName, setEditedName] = useState(category?.name || "");
  const [showMessage, setShowMessage] = useState(false);

  const handleSave = () => {
    onSave(editedName);
    setShowMessage(true);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Coluna</DialogTitle>
      <DialogContent>
        <TextField
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          fullWidth
        />
        {showMessage && <Alert severity="success" sx={{ mt: 2 }}>Coluna editada com sucesso!</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoryModal;
