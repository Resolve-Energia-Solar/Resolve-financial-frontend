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
  TablePagination,
  Chip,
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
import useSendContract from '@/hooks/clicksign/useClickSign';
import TableSkeleton from '../components/TableSkeleton';
import DrawerFilters from '../components/DrawerFilters/DrawerFilters';
import { SaleDataContext } from '@/app/context/SaleContext';
import ActionFlash from '../components/flashAction/actionFlash';
import StatusPreSale from '../components/StatusPreSale';
import OnboardingCreateSale from '../Add-sale/onboarding';
import { useSelector } from 'react-redux';
import useSale from '@/hooks/sales/useSale';
import EditSaleTabs from '../Edit-sale';
import SideDrawer from '@/app/components/shared/SideDrawer';
import InforCards from '../../../inforCards/InforCards';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatusChip from '@/utils/status/DocumentStatusIcon';
import ChipSigned from '@/utils/status/ChipSigned';

const SaleList = () => {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [openCreateSale, setOpenCreateSale] = useState(false);
  const [indicators, setIndicators] = useState({});

  const { handleRowClick, openDrawer, rowSelected, toggleDrawerClosed } = useSale();

  const { filters, setFilters, refresh } = useContext(SaleDataContext);

  const user = useSelector((state) => state?.user?.user);

  console.log('user', user);

  const userRole = {
    user: user?.id,
    role: user?.is_superusers ? 'Superuser' : user?.employee?.role?.name,
    branch: user?.employee?.branch?.id,
  };

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

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const router = useRouter();

  useEffect(() => {
    setPage(0);
    setSalesList([]);
  }, [order, orderDirection, filters, refresh]);

  console.log('filters', filters);

  useEffect(() => {
    const fetchSales = async () => {
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
      try {
        setLoading(true);

        const data = await saleService.getSales({
          userRole: userRole,
          ordering: orderingParam,
          limit: rowsPerPage,
          page: page + 1,
          ...filters,
        });

        setIndicators(data?.results?.indicators);
        setSalesList(data?.results?.results);
        setTotalRows(data.count);
      } catch (err) {
        setError('Erro ao carregar Vendas');
        showAlert('Erro ao carregar Vendas', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [page, rowsPerPage, order, orderDirection, filters, refresh]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  console.log('salesList', salesList);

  return (
    <Box>
      <Accordion defaultExpanded sx={{ marginBottom: 4 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="sale-cards-content"
          id="sale-cards-header"
        >
          <Typography variant="h6">
            Status
            <Chip
              sx={{ marginLeft: 1 }}
              label={Number(indicators?.total_value_sum || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            />
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <InforCards
            cardsData={[
              {
                backgroundColor: 'primary.light',
                iconColor: 'primary.main',
                IconComponent: IconListDetails,
                title: 'Em andamento',
                onClick: () => setFilters({ ...filters, status__in: 'EA' }),
                value: indicators?.in_progress?.total_value || 0,
                count: indicators?.in_progress?.count || '-',
              },
              {
                backgroundColor: 'success.light',
                iconColor: 'success.main',
                IconComponent: IconListDetails,
                title: 'Finalizado',
                onClick: () => setFilters({ ...filters, status__in: 'F' }),
                value: indicators?.finalized?.total_value || 0,
                count: indicators?.finalized?.count || '-',
              },
              {
                backgroundColor: 'secondary.light',
                iconColor: 'secondary.main',
                IconComponent: IconPaperclip,
                title: 'Pendente',
                onClick: () => setFilters({ ...filters, status__in: 'P' }),
                value: indicators?.pending?.total_value || 0,
                count: indicators?.pending?.count || '-',
              },
              {
                backgroundColor: 'warning.light',
                iconColor: 'warning.main',
                IconComponent: IconSortAscending,
                title: 'Cancelado',
                onClick: () => setFilters({ status__in: 'C' }),
                value: indicators?.canceled?.total_value || 0,
                count: indicators?.canceled?.count || '-',
              },
              {
                backgroundColor: 'warning.light',
                iconColor: 'warning.main',
                IconComponent: IconSortAscending,
                title: 'Distrato',
                onClick: () => setFilters({ status__in: 'D' }),
                value: indicators?.terminated?.total_value || 0,
                count: indicators?.terminated?.count || '-',
              },
            ]}
          />
        </AccordionDetails>
      </Accordion>

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

      <Box>
        <TableContainer component={Paper} elevation={10} sx={{ overflowX: 'auto' }}>
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
                  onClick={() => handleSort('signature_date')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Data de Assinatura
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'signature_date' &&
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
                  onClick={() => handleSort('signature_date')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Assinatura
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'signature_date' &&
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
                  onClick={() => handleSort('final_service_opinion')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    P.F Vistoria
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'final_service_opinion' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>

                <TableCell
                  sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('created_at')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Data de Criação
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 1 }}>
                      {order === 'created_at' &&
                        (orderDirection === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>Unidade</TableCell>
                {/* <TableCell>Ações</TableCell> */}
              </TableRow>
            </TableHead>
            {loading ? (
              <TableSkeleton rows={rowsPerPage} cols={9} />
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
                    <TableCell>
                      {item?.signature_date
                        ? new Date(item.signature_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        : '\u2014'}
                    </TableCell>
                    <TableCell>
                      {Number(item.total_value).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                    <TableCell>
                      {<ChipSigned status={item?.signature_status} />}
                    </TableCell>
                    <TableCell>
                      <StatusPreSale status={item.is_pre_sale} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={item.status} />
                    </TableCell>
                    <TableCell>
                      {item.final_service_opinion[0] ? (
                        <Chip
                          label={item.final_service_opinion[0]}
                          color={item.final_service_opinion[0] === 'Aprovado' ? 'success' : 'default'}
                        />
                      ) : (
                        <Chip label="Sem P.F" color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      {item?.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}
                    </TableCell>
                    <TableCell>{item.branch.name}</TableCell>
                    {/* <TableCell>
                      <Tooltip title="Ações">
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleMenuClick(event, item.id);
                          }}
                        >
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
                    </TableCell> */}
                  </TableRow>
                ))}
                {loading && page > 1 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows} 
          rowsPerPage={rowsPerPage} 
          page={page} 
          onPageChange={handlePageChange} 
          onRowsPerPageChange={handleRowsPerPageChange} 
          labelRowsPerPage="Linhas por página"
        />
      </Box>

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
      <SideDrawer
        open={openDrawer}
        onClose={() => toggleDrawerClosed(false)}
        title="Detalhamento da Venda"
      >
        <EditSaleTabs saleId={rowSelected?.id} />
      </SideDrawer>
    </Box>
  );
};

export default SaleList;
