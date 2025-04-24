'use client';
import React, { useState, useEffect } from 'react';
import {
  Chip,
  Drawer,
  Box,
  Typography,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Link,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Comment from '../comment';
import AttachmentTable from '../attachment/attachmentTable';
import { useSelector } from 'react-redux';
import financialRecordService from '@/services/financialRecordService';
import { IconEdit, IconPdf } from '@tabler/icons-react';
import { formatDate } from '@/utils/dateUtils';
import { useSnackbar } from 'notistack';
import UserCard from '../users/userCard';
import { useRouter } from 'next/navigation';

const statusMap = {
  S: <Chip label="Solicitada" color="warning" size="small" />,
  E: <Chip label="Em Andamento" color="success" size="small" />,
  P: <Chip label="Paga" color="success" size="small" />,
  C: <Chip label="Cancelada" color="error" size="small" />,
};

const paymentStatusMap = {
  P: <Chip label="Pendente" color="warning" size="small" />,
  PG: <Chip label="Pago" color="success" size="small" />,
  C: <Chip label="Cancelado" color="error" size="small" />,
};

const responsibleStatusMap = {
  P: <Chip label="Pendente" color="warning" size="small" />,
  A: <Chip label="Aprovado" color="success" size="small" />,
  R: <Chip label="Reprovado" color="error" size="small" />,
};

const FinancialRecordDetailDrawer = ({ open, onClose, record }) => {
  const user = useSelector((state) => state.user?.user);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentRecord, setCurrentRecord] = useState(record);
  const [tourActive, setTourActive] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    setCurrentRecord(record);
  }, [record]);

  const handlePaymentStatusChange = async (status) => {
    try {
      const newStatus = status === 'PG' ? 'P' : status === 'C' ? 'C' : currentRecord.status;
      await financialRecordService.update(currentRecord.id, {
        payment_status: status,
        status: newStatus,
        paid_at: new Date().toISOString(),
      });
      setCurrentRecord((prev) => ({ ...prev, payment_status: status, status: newStatus }));
    } catch (error) {
      console.error(error);
      const errorMessages = error.response?.data
        ? Object.values(error.response.data).flat()
        : [error.message];
      errorMessages.forEach((msg) =>
        enqueueSnackbar(`Erro ao atualizar status de pagamento: ${msg}`, { variant: 'error' }),
      );
    }
  };

  const handleResponsibleStatusChange = async (status) => {
    try {
      const newStatus = status === 'A' ? 'E' : status === 'R' ? 'C' : currentRecord.status;
      await financialRecordService.update(currentRecord.id, {
        responsible_status: status,
        responsible_response_date: new Date().toISOString(),
        status: newStatus,
      });
      setCurrentRecord((prev) => ({
        ...prev,
        responsible_status: status,
        status: newStatus,
      }));
    } catch (error) {
      console.error(error);
      const errorMessages = error.response?.data
        ? Object.values(error.response.data).flat()
        : [error.message];
      errorMessages.forEach((msg) =>
        enqueueSnackbar(`Erro ao atualizar status do gestor: ${msg}`, { variant: 'error' }),
      );
    }
  };

  const handlePDFBtnClick = async () => {
    try {
      const response = await financialRecordService.find(currentRecord.id, { generate_pdf: true });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `solicitacao_${currentRecord.protocol}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
      alert(`Erro ao gerar PDF: ${error.message}`);
    }
  };

  useEffect(() => {
    if (record?.responsible_status === 'P' && record?.payment_status === 'P') {
      setTourActive(true);
    } else {
      setTourActive(false);
    }
    if (localStorage.getItem('tourEditShown')) {
      setTourActive(false);
    }
  }, [record?.responsible_status, record?.payment_status]);

  const handleEditClick = () => {
    if (tourActive) {
      localStorage.setItem('tourEditShown', 'true');
      setTourActive(false);
    }
    router.push(`/apps/financial-record/${record.protocol}/update`);
  };

  if (!currentRecord) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ position: 'relative' }}>
      {tourActive && (
        <div
          onClick={() => setTourActive(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
          }}
        />
      )}
      <Box
        sx={{
          width: '55vw',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          ml: 2,
          position: 'relative'
        }}
      >
        {/* Cabeçalho e demais conteúdos */}
        <Box display="flex" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Solicitação nº {record?.protocol}
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Botão PDF */}
            <IconButton onClick={handlePDFBtnClick}>
              <IconPdf size={24} />
            </IconButton>
            {record?.responsible_status === 'P' && record?.payment_status === 'P' && (
              <Tooltip title="Novo botão de editar!" open={tourActive}>
                <IconButton
                  onClick={handleEditClick}
                  sx={{
                    border: tourActive ? '2px dashed #1976d2' : 'none',
                    position: 'relative',
                    backgroundColor: 'white',
                    zIndex: 1001,
                  }}
                >
                  <IconEdit size={24} />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Tabs value={tabIndex} onChange={(event, newIndex) => setTabIndex(newIndex)}>
          <Tab label="Geral" />
          <Tab label="Comentários" />
          <Tab label="Anexos" />
        </Tabs>
        {tabIndex === 0 && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Protocolo:</strong> {currentRecord.protocol}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Categoria:</strong> {currentRecord.category_name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Beneficiário:</strong> {currentRecord.client_supplier_name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Valor:</strong> R${' '}
                  {parseFloat(currentRecord.value).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Data de Vencimento:</strong> {formatDate(currentRecord.due_date)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Data do Serviço:</strong> {formatDate(currentRecord.service_date)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography id="status">
                  <strong>Status:</strong> {statusMap[currentRecord.status]}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  <strong>Status do Financeiro:</strong>
                  {(user.employee?.department?.name === 'Tecnologia' ||
                    user.employee?.department?.name === 'Financeiro') &&
                    currentRecord.payment_status === 'P' ? (
                    <FormControl variant="outlined" size="small" sx={{ ml: 1 }}>
                      <Select
                        value={currentRecord.payment_status}
                        onChange={(e) => handlePaymentStatusChange(e.target.value)}
                      >
                        <MenuItem value="P">
                          <Chip label="Pendente" color="warning" size="small" />
                        </MenuItem>
                        <MenuItem value="PG">
                          <Chip label="Pago" color="success" size="small" />
                        </MenuItem>
                        <MenuItem value="C">
                          <Chip label="Cancelado" color="error" size="small" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    paymentStatusMap[currentRecord.payment_status]
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  <strong>Status do Gestor:</strong>
                  {user.id === currentRecord.responsible.id &&
                    currentRecord.responsible_status === 'P' ? (
                    <FormControl sx={{ ml: 1 }} variant="outlined" size="small">
                      <Select
                        value={currentRecord.responsible_status}
                        onChange={(e) => handleResponsibleStatusChange(e.target.value)}
                      >
                        <MenuItem value="P">
                          <Chip label="Pendente" color="warning" size="small" />
                        </MenuItem>
                        <MenuItem value="A">
                          <Chip label="Aceito" color="success" size="small" />
                        </MenuItem>
                        <MenuItem value="R">
                          <Chip label="Recusado" color="error" size="small" />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    responsibleStatusMap[currentRecord.responsible_status]
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Data de Criação:</strong>{' '}
                  {new Date(currentRecord.created_at).toLocaleString('pt-BR')}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            {currentRecord.bank_details && (
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Dados Bancários:</strong>{' '}
                  {currentRecord.bank_details.account_type === 'X'
                    ? `PIX (${{
                      CPF: 'CPF',
                      CNPJ: 'CNPJ',
                      EMAIL: 'E-mail',
                      PHONE: 'Celular/Telefone',
                      RANDOM: 'Chave Aleatória'
                    }[currentRecord.bank_details.pix_key_type]}): ${currentRecord.bank_details.pix_key}`
                    : `${currentRecord.bank_details.financial_instituition} Ag: ${currentRecord.bank_details.agency_number} Conta: ${currentRecord.bank_details.account_number}`}
                </Typography>
              </Grid>
            )}
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Departamento Solicitante:</strong> {currentRecord.requesting_department}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Departamento Causador:</strong> {currentRecord.department_name}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Descrição:</strong>
                <br />
                {currentRecord.notes}
              </Typography>
            </Grid>
            {user.is_superuser && (
              <>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Código do Departamento:</strong> {currentRecord.department_code}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Código da Categoria:</strong> {currentRecord.category_code}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Código do Cliente/Fornecedor:</strong>{' '}
                      {currentRecord.client_supplier_code}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Número da Fatura:</strong> {currentRecord.invoice_number || '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
            <Divider sx={{ my: 3 }} />
            <Grid container>
              <Box display="flex" gap={2}>
                <UserCard
                  userId={currentRecord.requester}
                  title="Solicitante"
                />
                <UserCard
                  userId={currentRecord.responsible}
                  title="Gestor"
                />
              </Box>
            </Grid>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ mt: 3 }}>
            <Comment appLabel={'financial'} model={'financialrecord'} objectId={currentRecord.id} />
          </Box>
        )}

        {tabIndex === 2 && (
          <Box sx={{ mt: 3 }}>
            <AttachmentTable
              appLabel={'financial'}
              model={'financialrecord'}
              objectId={currentRecord.id}
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default FinancialRecordDetailDrawer;
