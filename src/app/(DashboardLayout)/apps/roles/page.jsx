'use client';
import React, { useState, useEffect } from 'react';
import {
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AddBoxRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import roleService from '@/services/roleService';

const RoleList = () => {
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.index(); // Assumindo que esta função existe no roleService
        console.log(data);
        setRolesList(data.results || []); // Garantindo que seja um array
      } catch (err) {
        setError('Erro ao carregar Funções');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleCreateClick = () => {
    router.push('/apps/roles/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/roles/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setRoleToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setRoleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await roleService.delete(roleToDelete);
      setRolesList(rolesList.filter((item) => item.id !== roleToDelete));
      console.log('Função excluída com sucesso');
    } catch (err) {
      setError('Erro ao excluir a função');
      console.error('Erro ao excluir a função', err);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <PageContainer title="Funções" description="Lista de Funções">
      <BlankCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Funções
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddBoxRounded />}
            sx={{ marginTop: 1, marginBottom: 2 }}
            onClick={handleCreateClick}
          >
            Criar Função
          </Button>
          {loading ? (
            <Typography>Carregando...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table aria-label="table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome da Função</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rolesList.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(item.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(item.id)}
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
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir esta função? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default RoleList;
