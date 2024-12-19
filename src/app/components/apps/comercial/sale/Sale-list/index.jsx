'use client';
import React, { useState, useEffect, useContext } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Box,
  Drawer,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddBoxRounded,
  Description as DescriptionIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import saleService from '@/services/saleService';
import StatusChip from '../../../../../../utils/status/DocumentStatusIcon';
import useSendContract from '@/hooks/clicksign/useClickSign';
import TableSkeleton from '../components/TableSkeleton';
import DrawerFilters from '../components/DrawerFilters/DrawerFilters';
import { SaleDataContext } from '@/app/context/SaleContext';
import ActionFlash from '../components/flashAction/actionFlash';
import StatusPreSale from '../components/StatusPreSale';
import { IconEyeglass } from '@tabler/icons-react';
import OnboardingCreateSale from '../Add-sale/onboarding';
import { useSelector } from 'react-redux';
import useSale from '@/hooks/sales/useSale';
import EditDrawer from '../../Drawer/Form';
import EditSalePage from '../Edit-sale';
import ParentCard from '@/app/components/shared/ParentCard';
import SaleCards from '../../../inforCards/SaleCard';
const SaleList = () => {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [openCreateSale, setOpenCreateSale] = useState(false);

  const { handleRowClick, openDrawer, rowSelected, toggleDrawerClosed } = useSale();

  const { filters, refresh } = useContext(SaleDataContext);

  const user = useSelector((state) => state?.user?.user);

  const userRole = {
    user: user?.id,
    role: user?.is_superuser ? 'Superuser' : user?.employee?.role?.name,
  };

  console.log('userRole', userRole);

  const {
    isSendingContract,
    loading: loadingContract,
    error: errorContract,
    setError: setErrorContract,
    success: successContract,
    setSuccess: setSuccessContract,
    sendContract,
  } = useSendContract();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);

  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);

  const [proposalHTML, setProposalHTML] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderDirection, setOrderDirection] = useState('asc');

  const [selectedSales, setSelectedSales] = useState([]);

  const [open, setOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setSalesList([]);
  }, [order, orderDirection, filters, refresh]);

  useEffect(() => {
    const fetchSales = async () => {
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(filters[1]).toString();
        const data = await saleService.getSales({
          userRole: userRole,
          ordering: orderingParam,
          params: queryParams,
          nextPage: page,
        });
        if (page === 1) {
          setSalesList(data.results);
        } else {
          setSalesList((prevSalesList) => {
            const newItems = data.results.filter(
              (item) => !prevSalesList.some((existingItem) => existingItem.id === item.id),
            );
            return [...prevSalesList, ...newItems];
          });
        }
        if (data.next) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError('Erro ao carregar Vendas');
        showAlert('Erro ao carregar Vendas', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
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
    router.push('/apps/commercial/sale/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/commercial/sale/${id}/update`);
  };

  const handleViewClick = (id) => {
    router.push(`/apps/commercial/sale/${id}/view`);
  };

  const handleDeleteClick = (id) => {
    setSaleToDelete(id);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSaleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await saleService.deleteSale(saleToDelete);
      setSalesList(salesList.filter((item) => item.id !== saleToDelete));
      showAlert('Venda excluída com sucesso', 'success');
    } catch (err) {
      setError('Erro ao excluir a venda');
      showAlert('Erro ao excluir a venda', 'error');
      console.error('Erro ao excluir a venda:', err);
    } finally {
      handleCloseModal();
    }
  };

  const handleGenerateProposal = async (item) => {
    try {
      const response = await fetch('/api/proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: item?.customer?.complete_name,
          total_value: Number(item.total_value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
        }),
      });

      const data = await response.text();
      setProposalHTML(data);
      setDialogOpen(true);
    } catch (err) {
      setError('Erro ao gerar proposta');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProposalHTML('');
  };

  const handleSendContract = async (sale) => {
    sendContract(sale);
  };

  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
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
      {/* <DashboardCards /> */}
      <SaleCards />
      <Typography variant="h6" gutterBottom>
        Lista de Vendas
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          sx={{ marginTop: 1, marginBottom: 2 }}
          onClick={() => setOpenCreateSale(true)}
        >
          Adicionar Venda
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {selectedSales.length > 0 && <ActionFlash value={selectedSales} />}
          <DrawerFilters />
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={10}
        sx={{ overflowX: 'auto', maxHeight: '50vh' }}
        onScroll={handleScroll}
      >
        <Table stickyHeader aria-label="sales table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('customer.complete_name')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Nome contratante
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'customer.complete_name' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('contract_number')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Número do Contrato
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'contract_number' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('total_value')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Valor Total (R$)
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'total_value' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('is_pre_sale')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Venda
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'is_pre_sale' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('status')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Status
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'status' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              <TableCell
                sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('document_completion_date')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Data de Conclusão
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'document_completion_date' &&
                      (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  </Box>
                </Box>
              </TableCell>

              <TableCell>Unidade</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          {loading && page === 1 ? (
            <TableSkeleton rows={5} columns={8} />
          ) : error && page === 1 ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {salesList.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  hover
                  sx={{ backgroundColor: rowSelected?.id === item.id && '#ECF2FF' }}
                >
                  <TableCell>{item.customer.complete_name}</TableCell>
                  <TableCell>{item.contract_number}</TableCell>
                  <TableCell>
                    {Number(item.total_value).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell>
                    <StatusPreSale status={item.is_pre_sale} />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={item.status} />
                  </TableCell>
                  <TableCell>
                    {item?.document_completion_date &&
                      new Date(item?.document_completion_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.branch.name}</TableCell>
                  <TableCell>
                    <Tooltip title="Ações">
                      <IconButton size="small" onClick={(event) => handleMenuClick(event, item.id)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={menuAnchorEl}
                      open={menuOpenRowId === item.id}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleEditClick(item.id);
                          handleMenuClose();
                        }}
                      >
                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                        Editar
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleViewClick(item.id);
                          handleMenuClose();
                        }}
                      >
                        <IconEyeglass fontSize="small" sx={{ mr: 1 }} />
                        Visualizar
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDeleteClick(item.id);
                          handleMenuClose();
                        }}
                      >
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Excluir
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleGenerateProposal(item);
                          handleMenuClose();
                        }}
                      >
                        <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                        Gerar Proposta
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
              {loading && page > 1 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
              {!hasMore && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2">Você viu tudo!</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja excluir esta venda? Esta ação não pode ser desfeita.
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

      <Dialog open={errorContract !== null} onClose={() => setErrorContract(null)}>
        <DialogTitle>Erro ao enviar contrato</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorContract}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorContract(null)} color="success">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successContract !== null} onClose={() => setSuccessContract(null)}>
        <DialogTitle>Contrato</DialogTitle>
        <DialogContent>
          <DialogContentText>O contrato foi enviado com sucesso.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessContract(null)} color="success">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Proposta Gerada</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: proposalHTML }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCreateSale}
        onClose={() => setOpenCreateSale(false)}
        fullWidth
        maxWidth="lg"
      >
        <OnboardingCreateSale onClose={() => setOpenCreateSale(false)} onEdit={handleEditClick} />
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSendingContract}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Enviando Contrato...
        </Typography>
      </Backdrop>
      <Drawer anchor="right" open={openDrawer} onClose={() => toggleDrawerClosed(false)}>
        <ParentCard title="Editar Venda">
          <CardContent>
            <EditSalePage saleId={rowSelected?.id} sx={{ maxWidth: '40vw', minWidth: '40vw' }} />
          </CardContent>
        </ParentCard>
      </Drawer>
    </Box>
  );
};

export default SaleList;
