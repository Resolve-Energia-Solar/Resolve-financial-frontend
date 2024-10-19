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
  Skeleton,
  Backdrop,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
  AddBoxRounded,
  Description as DescriptionIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  ArrowDropDown,
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import saleService from '@/services/saleService';
import clickSignService from '@/services/ClickSign';
import { Box } from '@mui/material';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';

import StatusChip from '../components/DocumentStatusIcon';
import useSendContract from '@/hooks/clicksign/useClickSign';

import DashboardCards from '@/app/components/apps/comercial/sale/components/kpis/DashboardCards';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconEyeglass } from '@tabler/icons-react';
import TableSkeleton from '../components/TableSkeleton';

const SaleList = () => {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const [order, setOrder] = useState('asc');

  console.log('order:', order);

  const [selectedSales, setSelectedSales] = useState([]);

  const [open, setOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await saleService.getSales(order);
        setSalesList(data.results);
      } catch (err) {
        setError('Erro ao carregar Vendas');
        showAlert('Erro ao carregar Vendas', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [order]);

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

  const handleGenerateProposal = async (id) => {
    try {
      await clickSignService.v1.generateProposal(id);
      showAlert('Proposta gerada com sucesso', 'success');
    } catch (err) {
      showAlert('Erro ao gerar a proposta', 'error');
      console.error('Erro ao gerar a proposta:', err);
    }
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

  return (
    <Box>
      <DashboardCards />
      <Typography variant="h6" gutterBottom>
        Lista de Vendas
      </Typography>
      <Button
        variant="outlined"
        startIcon={<AddBoxRounded />}
        sx={{ marginTop: 1, marginBottom: 2 }}
        onClick={handleCreateClick}
      >
        Adicionar Venda
      </Button>

      <TableContainer component={Paper} elevation={10} sx={{ overflowX: 'auto' }}>
        <Table stickyHeader aria-label="sales table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <CustomCheckbox
                  checked={selectedSales.length === salesList.length}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedSales(salesList.map((item) => item.id));
                    } else {
                      setSelectedSales([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Nome contratante</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Número do Contrato
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    <ArrowDropUpIcon
                      sx={{ width: 20, height: 20, cursor: 'pointer' }}
                      onClick={() => setOrder('contract_number')}
                    />
                    <ArrowDropDown
                      sx={{ width: 20, height: 20, cursor: 'pointer' }}
                      onClick={() => setOrder('-contract_number')}
                    />
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                <Box>Valor Total (R$)</Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                  <ArrowDropUpIcon
                    sx={{ width: 20, height: 20, cursor: 'pointer' }}
                    onClick={() => setOrder('total_value')}
                  />
                  <ArrowDropDown
                    sx={{ width: 20, height: 20, cursor: 'pointer' }}
                    onClick={() => setOrder('-total_value')}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Venda
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    <ArrowDropUpIcon
                      sx={{ width: 20, height: 20, cursor: 'pointer' }}
                      onClick={() => setOrder('is_sale')}
                    />
                    <ArrowDropDown
                      sx={{ width: 20, height: 20, cursor: 'pointer' }}
                      onClick={() => setOrder('-is_sale')}
                    />
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>Status</Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                  <ArrowDropUpIcon
                    sx={{ width: 20, height: 20, cursor: 'pointer' }}
                    onClick={() => setOrder('status')}
                  />
                  <ArrowDropDown
                    sx={{ width: 20, height: 20, cursor: 'pointer' }}
                    onClick={() => setOrder('-status')}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Data de Conclusão
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    <ArrowDropUpIcon
                      sx={{ width: 20, height: 20, cursor: 'pointer' }}
                      onClick={() => setOrder('document_completion_date')}
                    />
                    <ArrowDropDown
                      sx={{ width: 20, height: 20, cursor: 'pointer' }}
                      onClick={() => setOrder('-document_completion_date')}
                    />
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Unidade</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton rows={5} columns={9} />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {salesList.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <CustomCheckbox
                      checked={selectedSales.includes(item.id)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedSales([...selectedSales, item.id]);
                        } else {
                          setSelectedSales(selectedSales.filter((id) => id !== item.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.customer.complete_name}</TableCell>
                  <TableCell>{item.contract_number}</TableCell>
                  <TableCell>
                    {Number(item.total_value).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                  <TableCell>{item.is_sale ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>
                    <StatusChip status={item.status} />
                  </TableCell>
                  <TableCell>
                    {item.document_completion_date &&
                      new Date(item.document_completion_date).toLocaleDateString()}
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
                          handleGenerateProposal(item.id);
                          handleMenuClose();
                        }}
                      >
                        <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                        Gerar Proposta
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleSendContract(item);
                          handleMenuClose();
                        }}
                      >
                        <SendIcon fontSize="small" sx={{ mr: 1 }} />
                        Enviar Contrato
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
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
        <DialogTitle>Error ao enviar contrato</DialogTitle>
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
    </Box>
  );
};

export default SaleList;
