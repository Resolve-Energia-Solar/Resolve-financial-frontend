"use client";
import { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { KanbanDataContext } from "@/app/context/kanbancontext";
import columnService from "@/services/boardColumnService";
import { useSnackbar } from "notistack";

function DeleteCategoryModal({ showModal, handleCloseModal, column }) {
  const { refresh } = useContext(KanbanDataContext);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await columnService.deleteColumn(column.id);
      enqueueSnackbar(`Coluna "${column.name}" deletada com sucesso`, {
        variant: "success",
      });
      refresh();
      handleCloseModal();
    } catch (error) {
      console.error(`Erro ao deletar a coluna "${column.name}":`, error.message);
      enqueueSnackbar(`Erro ao deletar a coluna "${column.name}"`, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={showModal}
      onClose={handleCloseModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ ".MuiDialog-paper": { width: "400px" } }}
    >
      <DialogTitle id="alert-dialog-title">Deletar Coluna</DialogTitle>
      <DialogContent>
        Tem certeza de que deseja deletar a coluna "{column.name}"?
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleCloseModal}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Deletando..." : "Deletar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteCategoryModal;
