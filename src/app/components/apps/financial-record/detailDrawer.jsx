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
  MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Comment from '../comment';
import AttachmentTable from '../attachment/attachmentTable';
import { useSelector } from 'react-redux';
import financialRecordService from '@/services/financialRecordService';

const statusMap = {
  S: <Chip label="Solicitada" color="warning" size="small" />,
  E: <Chip label="Em Andamento" color="success" size="small" />,
  P: <Chip label="Paga" color="success" size="small" />,
  C: <Chip label="Cancelada" color="error" size="small" />
};

const paymentStatusMap = {
  P: <Chip label="Pendente" color="warning" size="small" />,
  PG: <Chip label="Pago" color="success" size="small" />,
  C: <Chip label="Cancelado" color="error" size="small" />
};

const responsibleStatusMap = {
  P: <Chip label="Pendente" color="warning" size="small" />,
  A: <Chip label="Aprovado" color="success" size="small" />,
  R: <Chip label="Reprovado" color="error" size="small" />
};

const FINANCIAL_RECORD_CONTENT_TYPE = process.env.NEXT_PUBLIC_FINANCIAL_RECORD_CONTENT_TYPE;

const FinancialRecordDetailDrawer = ({ open, onClose, record }) => {
  const user = useSelector((state) => state.user?.user);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentRecord, setCurrentRecord] = useState(record);

  useEffect(() => {
    setCurrentRecord(record);
  }, [record]);

  const handlePaymentStatusChange = async (status) => {
    try {
    await financialRecordService.updateFinancialRecordResponsibleStatus(currentRecord.id, {
      status
    });
      setCurrentRecord((prev) => ({ ...prev, payment_status: status }));
    } catch (error) {
      console.error(error);
      alert(`Erro ao atualizar status de pagamento: ${error.message}`);
    }
  };

  const handleResponsibleStatusChange = async (status) => {
    try {
      const newStatus = status === 'A' ? 'E' : status === 'R' ? 'C' : currentRecord.status;
      await financialRecordService.updateFinancialRecordPartial(currentRecord.id, {
        responsible_status: status,
        responsible_response_date: new Date().toISOString(),
        status: newStatus
      });
      setCurrentRecord((prev) => ({
        ...prev,
        responsible_status: status,
        status: newStatus
      }));
    } catch (error) {
      console.error(error);
      alert(`Erro ao atualizar status do responsável: ${error.message}`);
    }
  };

  if (!currentRecord) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: '55vw', p: 4, display: 'flex', flexDirection: 'column', ml: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Solicitação nº {currentRecord.protocol}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
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
                  <strong>Descrição:</strong> {currentRecord.notes}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Beneficiário:</strong> {currentRecord.client_supplier_name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Valor:</strong>{' '}
                  R$ {parseFloat(currentRecord.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Data de Vencimento:</strong> {new Date(currentRecord.due_date).toLocaleDateString('pt-BR')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Data do Serviço:</strong> {new Date(currentRecord.service_date).toLocaleDateString('pt-BR')}
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
                  <strong>Data de Criação:</strong> {new Date(currentRecord.created_at).toLocaleString('pt-BR')}
                </Typography>
              </Grid>
            </Grid>
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
                  <strong>Código do Cliente/Fornecedor:</strong> {currentRecord.client_supplier_code}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Número da Fatura:</strong> {currentRecord.invoice_number || '-'}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Grid container>
              <Box display="flex" gap={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Solicitante
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                    <Avatar
                      src={currentRecord.requester.profile_picture}
                      alt={currentRecord.requester.complete_name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography>{currentRecord.requester.complete_name}</Typography>
                      <Typography>
                        <Link href={`mailto:${currentRecord.requester.email}`}>
                          {currentRecord.requester.email}
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Gestor
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                    <Avatar
                      src={currentRecord.responsible.profile_picture}
                      alt={currentRecord.responsible.complete_name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography>{currentRecord.responsible.complete_name}</Typography>
                      <Typography>
                        <Link href={`mailto:${currentRecord.responsible.email}`}>
                          {currentRecord.responsible.email}
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ mt: 3 }}>
            <Comment contentType={FINANCIAL_RECORD_CONTENT_TYPE} objectId={currentRecord.id} />
          </Box>
        )}

        {tabIndex === 2 && (
          <Box sx={{ mt: 3 }}>
            <AttachmentTable contentType={FINANCIAL_RECORD_CONTENT_TYPE} objectId={currentRecord.id} />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default FinancialRecordDetailDrawer;
