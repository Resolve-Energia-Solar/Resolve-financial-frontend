'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Components
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
  Box,
} from '@mui/material';
import {
  AddBoxRounded,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@mui/icons-material';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';

// Services and utils
import categoryService from '@/services/categoryService';
import {
  CategoryDataContext,
  CategoryDataContextProvider,
} from '@/app/context/Inspection/CategoryContext';
import capitalizeFirstWord from '@/utils/capitalizeFirstWord';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CategoryDrawerFilters from '../CategoryDrawerFilters';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';

const CategoryList = () => {
  const router = useRouter();

  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { filters, refresh } = useContext(CategoryDataContext);
  const [order, setOrder] = useState('asc');
  const [orderDirection, setOrderDirection] = useState('asc');

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setCategoriesList([]);
  }, [order, orderDirection, filters, refresh]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
      try {
        const queryParams = new URLSearchParams(filters[1]).toString();
        const data = await categoryService.getCategories({
          ordering: orderingParam,
          params: queryParams,
          nextPage: page,
        });
        if (page === 1) {
          setCategoriesList(data.results);
        } else {
          setCategoriesList((prevCategoryList) => {
            const newItems = data.results.filter(
              (item) => !prevSalesList.some((existingItem) => existingItem.id === item.id),
            );
            return [...prevCategoryList, ...newItems];
          });
        }
        if (data.next) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        setError('Erro ao carregar Categorias: ', error);
        showAlert('Erro ao carregar Categorias', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, order, orderDirection, filters, refresh]);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleCreateClick = () => {
    router.push('/apps/inspections/category/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/category/${id}/update`);
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setIsDialogOpen(true);
  };

  const handleCloseModal = () => {
    setIsDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await categoryService.deleteCategory(categoryToDelete);
      setCategoriesList(categoriesList.filter((item) => item.id !== categoryToDelete));
      showAlert('Categoria excluída com sucesso', 'success');
    } catch (err) {
      setError(`Erro ao excluir ${pageName}`);
      showAlert('Erro ao excluir Categoria', 'error');
      console.error('Erro ao excluir Categoria:', err);
    } finally {
      handleCloseModal();
    }
  };

  const handleSort = (field) => {
    if (order === field) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrder(field);
      setOrderDirection('asc');
    }
  };

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Lista de Categorias
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          sx={{ marginTop: 1, marginBottom: 2 }}
          onClick={handleCreateClick}
        >
          Adicionar Categoria
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CategoryDrawerFilters />
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        elevation={10}
        sx={{ overflowX: 'auto', maxHeight: '50vh' }}
        onScroll={handleScroll}
      >
        <Table stickyHeader aria-label="category table">
          <TableHead>
            <TableRow>
              {/* ID */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('id')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  ID
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'id' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Name */}
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('name')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Nome
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'name' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              {/* Actions */}
              <TableCell align="right" sx={{ paddingRight: 3 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          {loading && page === 1 ? (
            <TableSkeleton rows={5} columns={3} />
          ) : error && page === 1 ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {categoriesList.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>{category.id}</TableCell>
                  <TableCell sx={{ flex: 2 }}>{category.name}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(category.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(category.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {loading && page > 1 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
              {!hasMore && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2">Você viu tudo!</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CategoryList;
