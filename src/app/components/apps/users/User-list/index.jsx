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
  Chip,
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
import userService from '@/services/userService';

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUser();
        console.log(data);
        setUserList(data.results);
      } catch (err) {
        setError('Erro ao carregar Usuários');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateClick = () => {
    router.push('/apps/users/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/users/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await userService.deleteUser(userToDelete);
      setUserList(userList.filter((item) => item.id !== userToDelete));
      console.log('Usuário excluído com sucesso');
    } catch (err) {
      setError('Erro ao excluir o usuário');
      console.error('Erro ao excluir o usuário', err);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddBoxRounded />}
        sx={{ marginTop: 1, marginBottom: 2 }}
        onClick={handleCreateClick}
      >
        Criar Usuário
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
                <TableCell>Usuário</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Função</TableCell>
                <TableCell>Permissões</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>{item?.username}</TableCell>
                  <TableCell>{item?.email}</TableCell>
                  <TableCell>{item?.department?.name || 'N/A'}</TableCell>
                  <TableCell>{item?.role?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip label={`${item?.user_permissions?.length} permissões`} />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(item?.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(item?.id)}
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

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.
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
    </>
  );
};

export default UserList;
