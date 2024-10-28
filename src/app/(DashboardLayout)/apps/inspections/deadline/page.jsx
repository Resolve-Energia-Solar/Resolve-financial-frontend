'use client';
import React, {
  useState,
  useEffect,
} from "react";
import { useRouter } from 'next/navigation';
import { formatTime } from "@/utils/inspectionFormatDate";

/* material */
import {
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Tooltip,
  IconButton,
  Paper,
} from "@mui/material";
import {
  AddBoxRounded,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

/* components */
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/app/components/shared/BlankCard";

/* services */
import deadlineService from "@/services/deadlineService";

const DeadlineList = () => {
  const [deadlineList, setDeadlineList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [deadlineToDelete, setDeadlineToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const data = await deadlineService.getDeadlines();
        setDeadlineList(data.results);
      } catch (err) {
        setError('Erro ao carregar prazos');
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  const handleCreateClick = () => {
    //router.push('/apps/inspections/deadline/create');
  }

  const handleEditClick = (id) => {
    //router.push(`/apps/inspections/deadline/${id}`);
  }

  const handleDeleteClick = (id) => {
    setDeadlineToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setDeadlineToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deadlineService.deleteDeadline(deadlineToDelete);
      setDeadlineList(deadlineList.filter((deadline) => deadline.id !== deadlineToDelete));
    } catch (err) {
      setError('Erro ao deletar prazo');
    } finally {
      handleCloseModal();
    }
  };

  return (
    <PageContainer
      title={'Prazos'}
      description={'Listagem de prazos'}
    >
      <BlankCard>
        <CardContent>
          <Typography
            variant={'h6'}
            gutterBottom
          >
            Lista de Prazos
          </Typography>
          <Button
            variant={'outlined'}
            startIcon={<AddBoxRounded />}
            sx={{ marginTop: 1, marginBottom: 2 }}
            onClick={handleCreateClick}
          >
            Adicionar Prazo
          </Button>
          {loading ? (
            <Typography>
              Carregando...
            </Typography>
          ) : error ? (
            <Typography color={'error'}>
              {error}
            </Typography>
            ) : (
              <TableContainer component={Paper} elevation={3}>
                <Table aria-label='table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Horas</TableCell>
                      <TableCell>Observação</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deadlineList.map((deadline) => (
                      <TableRow key={deadline.id}>
                        <TableCell>{deadline.id}</TableCell>
                        <TableCell>{deadline.name}</TableCell>
                        <TableCell>{formatTime(deadline.hours)}</TableCell>
                        <TableCell>{deadline.observation}</TableCell>
                        <TableCell>
                          <Tooltip title={'Editar'}>
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleEditClick(deadline.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={'Excluir'}>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteClick(deadline.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </CardContent>
      </BlankCard>

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleCloseModal}
      >
        <DialogTitle 
          id="alert-dialog-title"
        >
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
          >
            Tem certeza de que deseja excluir este prazo? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color="primary"
            onClick={handleCloseModal}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            onClick={handleConfirmDelete}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default DeadlineList;
