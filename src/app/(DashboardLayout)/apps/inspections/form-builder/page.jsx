'use client';
import React, {
  useState,
  useEffect,
} from "react";
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
  Box,
  TablePagination,
} from "@mui/material";
import {
  AddBoxRounded,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { 
  IconEyeglass
} from '@tabler/icons-react';

/* components */
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/app/components/shared/BlankCard";

/* services */
import formBuilderService from "@/services/formBuilderService";

const FormBuilderList = () => {
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await formBuilderService.getForms();
        setFormList(data.results);
      } catch (err) {
        setError('Erro ao carregar formulários');
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleCreateClick = () => {
    router.push('/apps/inspections/form-builder/create');
  }

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/form-builder/${id}/update`);
  }

  const handleViewClick = (id) => {
    router.push(`/apps/inspections/form-builder/${id}/view`);
  }

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setFormToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await formBuilderService.deleteForm(formToDelete.id);
      setFormList(formList.filter(form => form.id !== formToDelete.id));

    } catch (err) {
      setError('Erro ao deletar formulário');
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
    <PageContainer
      title={'Formulários'}
      description={'Listagem de formulários'}
    >
      <BlankCard>
        <CardContent>
          <Typography
            variant={'h6'}
            gutterBottom
          >
            Lista de Formulários
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddBoxRounded />}
            sx={{ marginTop: 1, marginBottom: 2 }}
            onClick={handleCreateClick}
          >
            Criar Formulário
          </Button>
          {loading ? (
            <Typography>
              Carregando formulários...
            </Typography>
          ) : error ? (
            <Typography>
              {error}
            </Typography>
          ) : (
            <TableContainer
              component={Paper}
              elevation={10}
              sx={{ overflowX: 'auto' }}
            >
              <Table
                stickyHeader
                aria-label="forms table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        ID
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        Nome
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        Serviço
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ whiteSpace: 'nowrap' }}
                      align="center"
                    >
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        {form.id}
                      </TableCell>
                      <TableCell>
                        {form.name}
                      </TableCell>
                      <TableCell>
                        {form.service.name}
                      </TableCell>
                      <TableCell
                        align="center"
                      >
                        <Tooltip title={'Editar'}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(form.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={'Visualizar'}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleViewClick(form.id)}
                          >
                            <IconEyeglass />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={'Excluir'}>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(form)}
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
                count={formList.length}
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
            Tem certeza que deseja excluir o formulário? Esta ação não pode ser desfeita.
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

export default FormBuilderList;
