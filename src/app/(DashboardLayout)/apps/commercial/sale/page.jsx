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
  Menu,
  MenuItem,
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
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import saleService from '@/services/saleService';
import clickSignService from '@/services/ClickSign';

const getStatusChip = (status) => {
  switch (status) {
    case 'F':
      return <Chip label="Finalizado" color="success" icon={<CheckCircleIcon />} />;
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

const SaleList = () => {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para controlar o menu de ações
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);

  const [open, setOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await saleService.getSales();
        setSalesList(data.results);
      } catch (err) {
        setError('Erro ao carregar Vendas');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const handleCreateClick = () => {
    router.push('/apps/commercial/sale/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/commercial/sale/${id}/update`);
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
      console.log('Venda excluída com sucesso');
    } catch (err) {
      setError('Erro ao excluir a venda');
      console.error('Erro ao excluir a venda:', err);
    } finally {
      handleCloseModal();
    }
  };

  const handleGenerateProposal = async (id) => {
    try {
      await clickSignService.v1.generateProposal(id); // Certifique-se de que este método existe
      console.log('Proposta gerada com sucesso');
    } catch (err) {
      setError('Erro ao gerar a proposta');
      console.error('Erro ao gerar a proposta:', err);
    }
  };

  const handleSendContract = async (sale) => {
    try {
      const documentData = {
        'Company Name': 'Henrique Marques',
        Address: 'Endereço Fictício',
        Phone: '91984751123',
      };
      const path = `/Contratos/Contrato-${sale.contract_number}.pdf`;

      // Criação do modelo de documento
      const documentoCriado = await clickSignService.v1.createDocumentModel(documentData, path);

      if (!documentoCriado || !documentoCriado.document || !documentoCriado.document.key) {
        throw new Error('Falha na criação do documento');
      }

      const documentKey = documentoCriado.document.key;
      console.log('Documento criado com sucesso:', documentKey);

      // Criação do signatário
      const signer = await clickSignService.v1.createSigner(
        '70007103220',
        '30/01/1995',
        '91984751123',
        'hmdev132@gmail.com',
        'Henrique Marques',
        'whatsapp',
        { selfie_enabled: false, handwritten_enabled: false },
      );
      console.log('Signatário criado:', signer);

      const signerKey = signer.signer.key;

      // Adicionar o signatário ao documento
      const listaAdicionada = await clickSignService.AddSignerDocument(
        signerKey,
        documentKey,
        'contractor', // sign_as (ajuste conforme a sua necessidade)
        'Por favor, assine o contrato.',
      );
      console.log('Signatário adicionado ao documento:', listaAdicionada);

      // Enviar notificação por e-mail
      const emailNotificacao = await clickSignService.notification.email(
        listaAdicionada.list.request_signature_key,
        'Por favor, assine o contrato.',
      );
      console.log('Notificação por e-mail enviada:', emailNotificacao);

      // Enviar notificação por WhatsApp
      const whatsappNotificacao = await clickSignService.notification.whatsapp(
        listaAdicionada.list.request_signature_key,
      );
      console.log('Notificação por WhatsApp enviada:', whatsappNotificacao);

      // Enviar notificação por SMS (opcional)
      const smsNotificacao = await clickSignService.notification.sms(
        listaAdicionada.list.request_signature_key,
        'Por favor, assine o contrato.',
      );
      console.log('Notificação por SMS enviada:', smsNotificacao);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          'Erro ao processar o contrato:',
          JSON.stringify(error.response.data, null, 2),
        );
      } else {
        console.error('Erro ao processar o contrato:', error.message);
      }
    }
  };

  // Funções para controlar o menu
  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
  };

  return (
    <PageContainer title="Vendas" description="Lista de Vendas">
      <BlankCard>
        <CardContent>
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
          {loading ? (
            <Typography>Carregando...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table aria-label="sales table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome contratante</TableCell>
                    <TableCell>Número do Contrato</TableCell>
                    <TableCell>Valor Total (R$)</TableCell>
                    <TableCell>Venda</TableCell>
                    <TableCell>Data de Assinatura</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data de Conclusão</TableCell>
                    <TableCell>Unidade</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesList.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.id}</TableCell>
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
                        {new Date(item.signature_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusChip(item.status)}</TableCell>
                      <TableCell>
                        {new Date(item.document_completion_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item.branch.name}</TableCell>
                      <TableCell>
                        <Tooltip title="Ações">
                          <IconButton
                            size="small"
                            onClick={(event) => handleMenuClick(event, item.id)}
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
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </BlankCard>

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
    </PageContainer>
  );
};

export default SaleList;

