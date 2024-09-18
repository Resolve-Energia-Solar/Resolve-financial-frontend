import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert } from "@mui/material";

const DeleteCategoryModal = ({ open, onClose, category, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Deletar Coluna</DialogTitle>
      <DialogContent>
        <Typography>Tem certeza que deseja deletar esta coluna?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onDelete} color="error">Deletar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCategoryModal;
