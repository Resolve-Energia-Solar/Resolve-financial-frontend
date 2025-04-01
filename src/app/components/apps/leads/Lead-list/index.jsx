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
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp,
  FlashOn,
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
import { IconActivity, IconEyeglass } from '@tabler/icons-react';
import TableSkeleton from '../components/TableSkeleton';
import DrawerFilters from '../components/DrawerFilters/DrawerFilters';

import { useContext } from 'react';

import { SaleDataContext } from '@/app/context/SaleContext';
import ActionFlash from '../components/flashAction/actionFlash';
import SwipeCard from '../components/tinder';
import StatusPreSale from '../components/StatusPreSale';

const SaleList = () => {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { filters, refresh } = useContext(SaleDataContext);

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
    const fetchSales = async () => {
      try {
        setLoading(true);
        const data = await saleService.index(
          order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : null,
        );
        setSalesList(data.results);
      } catch (err) {
        setError('Erro ao carregar Vendas');
        showAlert('Erro ao carregar Vendas', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [order, orderDirection, filters, refresh]);

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
      await saleService.delete(saleToDelete);
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

  // Função para fechar o diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProposalHTML(''); // Limpa o HTML ao fechar
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

  return (
    <Box>
      <DashboardCards />
      <Typography variant="h6" gutterBottom>
        Lista de Vendas
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          sx={{ marginTop: 1, marginBottom: 2 }}
          onClick={handleCreateClick}
        >
          Adicionar Venda
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SwipeCard />
          {selectedSales.length > 0 && <ActionFlash value={selectedSales} />}
          <DrawerFilters />
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={10} sx={{ overflowX: 'auto' }}>
        <Table stickyHeader aria-label="sales table">
          <TableHead>
            <TableRow>
              <TableCell>
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
                onClick={() => handleSort('is_sale')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Venda
                  <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                    {order === 'is_sale' &&
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
                  <TableCell>
                    <StatusPreSale status={item.is_sale} />
                  </TableCell>
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
                          handleGenerateProposal(item);
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
