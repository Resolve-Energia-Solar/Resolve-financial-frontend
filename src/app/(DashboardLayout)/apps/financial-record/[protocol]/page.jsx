'use client';
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  Stack,
  Tabs,
  Tab,
  Chip,
  Box,
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from 'notistack';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';
import financialRecordService from '@/services/financialRecordService';
import { IconPdf } from '@tabler/icons-react';
import { formatDate } from '@/utils/dateUtils';
import Comment from '@/app/components/apps/comment';
import AttachmentTable from '@/app/components/apps/attachment/attachmentTable';

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

const paymentMethodMap = {
  B: <Chip label="Boleto" color="success" />,
  T: <Chip label="Transferência Bancária" color="success" />,
  E: <Chip label="Dinheiro em Espécie" color="success" />,
  D: <Chip label="Cartão de Débito" color="success" />,
  C: <Chip label="Cartão de Crédito" color="success" />,
  P: <Chip label="Pix" color="success" />,
};

export default function FinancialRecordDetailsPage() {
  const router = useRouter();
  const { protocol } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const breadcrumbs = [
    { to: '/', title: 'Home' },
    { to: '/apps/financial-record', title: 'Contas a Receber/Pagar' },
    { to: `/apps/financial-record/${protocol}`, title: protocol },
    { title: 'Detalhes da Solicitação' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const dataList = await financialRecordService.index({
          protocol__in: protocol,
          fields: 'id',
        });
        const records = dataList.results;
        if (records && records.length > 0) {
          const recordId = records[0].id;
          const fetchedData = await financialRecordService.find(recordId, { expand: 'bank_details' });
          setRecord(fetchedData);
        } else {
          enqueueSnackbar('Registro não encontrado.', { variant: 'error' });
          router.push('/apps/financial-record');
        }
      } catch (error) {
        console.error('Erro ao carregar os detalhes do registro:', error);
        enqueueSnackbar('Erro ao carregar os detalhes do registro.', { variant: 'error' });
        router.push('/apps/financial-record');
      } finally {
        setLoading(false);
      }
    })();
  }, [protocol, enqueueSnackbar, router]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handlePDFDownload = async () => {
    try {
      const response = await financialRecordService.find(record.id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `solicitacao_${record.protocol}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      enqueueSnackbar(`Erro ao gerar PDF: ${error.message}`, { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <PageContainer title="Carregando Detalhes" description="Aguarde...">
        <CircularProgress />
      </PageContainer>
    );
  }

  if (!record) return null;

  return (
    <PageContainer
      title="Detalhes da Solicitação"
      description="Visualize os detalhes da conta a receber/pagar"
    >
      <Breadcrumb items={breadcrumbs} />
      <ParentCard title={`Solicitação nº ${record.protocol}`}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Detalhes da Solicitação
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={handlePDFDownload}
              startIcon={<IconPdf size={20} />}
            >
              Gerar PDF
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push(`/apps/financial-record/${protocol}/update`)}
            >
              Editar
            </Button>
          </Stack>
        </Box>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Geral" />
          <Tab label="Comentários" />
          <Tab label="Anexos" />
        </Tabs>
        {tabIndex === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Beneficiário
              </Typography>
              <Typography variant="body1">{record.client_supplier_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Departamento Solicitante
              </Typography>
              <Typography variant="body1">{record.requesting_department}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Departamento Causador
              </Typography>
              <Typography variant="body1">{record.department_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Categoria
              </Typography>
              <Typography variant="body1">{record.category_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Valor (R$)
              </Typography>
              <Typography variant="body1">{record.value}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Forma de Pagamento
              </Typography>
              <Typography variant="body1">{paymentMethodMap[record.payment_method]}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Typography variant="body1">{statusMap[record.status]}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Status de Pagamento
              </Typography>
              <Typography variant="body1">{paymentStatusMap[record.payment_status]}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Status do Responsável
              </Typography>
              <Typography variant="body1">
                {responsibleStatusMap[record.responsible_status]}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Data do Serviço
              </Typography>
              <Typography variant="body1">{formatDate(record.service_date)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Data de Vencimento
              </Typography>
              <Typography variant="body1">{formatDate(record.due_date)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Número da Nota Fiscal
              </Typography>
              <Typography variant="body1">{record.invoice_number || '-'}</Typography>
            </Grid>
            {record.bank_details && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Dados Bancários
                </Typography>
                <Typography variant='body1'>{record.bank_details.account_type === 'X'
                  ? `PIX (${{
                    CPF: 'CPF',
                    CNPJ: 'CNPJ',
                    EMAIL: 'E-mail',
                    PHONE: 'Celular/Telefone',
                    RANDOM: 'Chave Aleatória'
                  }[record.bank_details.pix_key_type]}): ${record.bank_details.pix_key}`
                  : `${record.bank_details.financial_instituition} Ag: ${record.bank_details.agency_number} Conta: ${record.bank_details.account_number}`}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Descrição
              </Typography>
              <Typography variant="body1">{record.notes}</Typography>
            </Grid>
          </Grid>
        )}
        {tabIndex === 1 && (
          <Box>
            <Comment appLabel="financial" model="financialrecord" objectId={record.id} />
          </Box>
        )}
        {tabIndex === 2 && (
          <Box>
            <AttachmentTable appLabel="financial" model="financialrecord" objectId={record.id} />
          </Box>
        )}
      </ParentCard>
      <Stack direction="row" spacing={2} mt={3}>
        <Button variant="outlined" onClick={() => router.push('/apps/financial-record')}>
          Voltar
        </Button>
      </Stack>
    </PageContainer>
  );
}
