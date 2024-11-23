'use client';
import React, { useState, useEffect } from "react";
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/app/components/shared/BlankCard";
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
  TableSortLabel,
} from "@mui/material";
import {
  AddBoxRounded,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import { useRouter } from 'next/navigation';
import serviceCatalogService from "@/services/serviceCatalogService";
import capitalizeFirstWord from "@/utils/capitalizeFirstWord";

const ServiceCatalogList = () => {
  const pageName = 'serviço';
  const pageNamePlural = 'serviços';
  const pageDescription = `Lista de ${capitalizeFirstWord(pageNamePlural)}`;

  const [serviceCatalogList, setServicesCatalogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [serviceCatalogToDelete, setServiceCatalogToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id'); // Ordenação padrão

  const router = useRouter();

  useEffect(() => {
    const fetchServicesCatalog = async () => {
      try {
        const data = await serviceCatalogService.getServicesCatalog();
        setServicesCatalogList(data.results);
      } catch (err) {
        setError(`Erro ao carregar ${pageNamePlural}`);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesCatalog();
  }, []);

  const handleCreateClick = () => {
    router.push(`/apps/inspections/service-catalog/create`);
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/service-catalog/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setServiceCatalogToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setServiceCatalogToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await serviceCatalogService.deleteServiceCatalog(serviceCatalogToDelete);
      setServicesCatalogList(serviceCatalogList.filter((item) => item.id !== serviceCatalogToDelete));
    } catch (err) {
      setError(`Erro ao excluir ${pageName}`);
    } finally {
      handleCloseModal();
    }
  };

  // Funções da Paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset para a primeira página
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Função de comparação para ordenação
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => {
          if (orderBy === 'category') {
            return (b.category.name < a.category.name ? -1 : 1);
          }
          if (orderBy === 'deadline') {
            return (b.deadline.name < a.deadline.name ? -1 : 1);
          }
          return (b[orderBy] < a[orderBy] ? -1 : 1);
        }
      : (a, b) => {
          if (orderBy === 'category') {
            return (a.category.name < b.category.name ? -1 : 1);
          }
          if (orderBy === 'deadline') {
            return (a.deadline.name < b.deadline.name ? -1 : 1);
          }
          return (a[orderBy] < b[orderBy] ? -1 : 1);
        };
  };

  // Aplicar ordenação aos dados
  const sortedServiceCatalogList = serviceCatalogList.sort(getComparator(order, orderBy));

  return (
    <PageContainer title={capitalizeFirstWord(pageName)} description={pageDescription}>
      <BlankCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de {capitalizeFirstWord(pageNamePlural)}
          </Typography>
          <Button variant="outlined" startIcon={<AddBoxRounded />} sx={{ marginTop: 1, marginBottom: 2 }} onClick={handleCreateClick}>
            Adicionar {capitalizeFirstWord(pageName)}
          </Button>
          {loading ? (
            <Typography>
              Carregando...
            </Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table aria-label="table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'id'}
                        direction={orderBy === 'id' ? order : 'asc'}
                        onClick={() => handleRequestSort('id')}
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'name'}
                        direction={orderBy === 'name' ? order : 'asc'}
                        onClick={() => handleRequestSort('name')}
                      >
                        Nome
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'description'}
                        direction={orderBy === 'description' ? order : 'asc'}
                        onClick={() => handleRequestSort('description')}
                      >
                        Descrição
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'category'}
                        direction={orderBy === 'category' ? order : 'asc'}
                        onClick={() => handleRequestSort('category')}
                      >
                        Categoria
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'deadline'}
                        direction={orderBy === 'deadline' ? order : 'asc'}
                        onClick={() => handleRequestSort('deadline')}
                      >
                        Prazo
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedServiceCatalogList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.category.name}</TableCell>
                      <TableCell>{item.deadline.name}</TableCell>
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={serviceCatalogList.length}
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
            Tem certeza de que deseja excluir esta {pageName}? Esta ação não pode ser desfeita.
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

export default ServiceCatalogList;
