'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

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
  TablePagination,
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
import roofTypeService from "@/services/roofTypeService";

const RoofTypeList = () => {
  const [roofTypeList, setRoofTypeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [roofTypeToDelete, setRoofTypeToDelete] = useState(null);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const router = useRouter();

  useEffect(() => {
    const fetchRoofTypes = async () => {
      try {
        const data = await roofTypeService.getRoofTypes();
        setRoofTypeList(data.results);
      } catch (err) {
        setError('Erro ao carregar tipos de telhados');
      } finally {
        setLoading(false);
      }
    };

    fetchRoofTypes();
  }, []);

  const handleCreateClick = () => {
    router.push('/apps/inspections/roof-type/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/roof-type/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setRoofTypeToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setRoofTypeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await roofTypeService.deleteRoofType(roofTypeToDelete);
      setRoofTypeList(roofTypeList.filter(roofType => roofType.id !== roofTypeToDelete));
    } catch (err) {
      setError('Erro ao deletar tipo de telhado');
    } finally {
      handleCloseModal();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <PageContainer title="Tipo de Telhado" description="Lista de tipos de telhados">
      <BlankCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Tipos de Telhados
          </Typography>
          <Button variant="outlined" startIcon={<AddBoxRounded />} sx={{ marginTop: 1, marginBottom: 2 }} onClick={handleCreateClick}>
            Adicionar Tipo de Telhado
          </Button>
          {loading ? (
            <Typography>
              Carregando...
            </Typography>
          ) : error ? (
            <Typography color="error">
              {error}
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table aria-label="table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roofTypeList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                    <TableRow key={item.id}>
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
                        <Tooltip title="Deletar">
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={roofTypeList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </CardContent>
      </BlankCard>
      {/* Modal de confirmação de exclusão */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir este tipo de telhado? Esta ação não pode ser desfeita.
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

export default RoofTypeList;
