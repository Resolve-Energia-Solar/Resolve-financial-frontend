'use client';
import React, { useState, useEffect } from 'react';
import {
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
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
  AddBoxRounded,
  Settings,
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import projectService from '@/services/projectService';

const getStatusChip = (status) => {
  switch (status) {
    case 'P':
      return <Chip label="Pendente" color="warning" icon={<HourglassEmptyIcon />} />;
    case 'CO':
      return <Chip label="Concluido" color="success" icon={<CheckCircleIcon />} />;
    case 'EA':
      return <Chip label="Em Andamento" color="primary" icon={<HourglassEmptyIcon />} />;
    case 'C':
      return <Chip label="Cancelado" color="error" icon={<CancelIcon />} />;
    case 'D':
      return <Chip label="Distrato" color="error" icon={<CancelIcon />} />;
    default:
      return <Chip label={status} />;
  }
};

const getSupplyTypeChip = (type) => {
  switch (type) {
    case 'M':
      return <Chip label="Monofásico" color="info" icon={<Settings />} />;
    case 'B':
      return <Chip label="Bifásico" color="info" icon={<Settings />} />;
    case 'T':
      return <Chip label="Trifásico" color="info" icon={<Settings />} />;
    default:
      return <Chip label={type} />;
  }
};

const ProjectList = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.index();
        console.log(data);
        setProjectsList(data.results);
      } catch (err) {
        setError('Erro ao carregar Projetos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateClick = () => {
    router.push('/apps/project/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/project/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setProjectToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setProjectToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await projectService.delete(projectToDelete);
      setProjectsList(projectsList.filter((item) => item.id !== projectToDelete));
      console.log('Venda excluída com sucesso');
    } catch (err) {
      setError('Erro ao excluir o projeto');
      console.error('Erro ao excluir o projeto', err);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Lista de Projetos
      </Typography>
      <Button
        variant="outlined"
        startIcon={<AddBoxRounded />}
        sx={{ marginTop: 1, marginBottom: 2 }}
        onClick={handleCreateClick}
      >
        Criar Projeto
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
                <TableCell>Nome contratante</TableCell>
                <TableCell>Número do Contrato</TableCell>
                <TableCell>Status do Projeto</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectsList.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={() => handleEditClick(item.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.sale?.customer?.complete_name}</TableCell>
                  <TableCell>{item.sale?.contract_number}</TableCell>
                  <TableCell>{getStatusChip(item.status)}</TableCell>
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
    </>
  );
};

export default ProjectList;
