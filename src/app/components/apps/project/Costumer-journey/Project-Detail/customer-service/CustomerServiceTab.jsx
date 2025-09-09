'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Chip, Typography, Grid, Dialog, DialogContent } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import TableSkeleton from '../../../../comercial/sale/components/TableSkeleton';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';
import TicketForm from './TicketForm';
import useTicket from '@/hooks/tickets/useTicket';
import { formatDateTime } from '@/utils/inspectionFormatDate';
import TicketStatusChip from '@/app/components/apps/customer_service/TicketStatusChip';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import projectService from '@/services/projectService';

export default function CustomerServiceTab({ projectId, viewOnly = false, ticketId = null }) {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openTicketFormModal, setOpenTicketFormModal] = useState(!!ticketId);
  const [selectedTicket, setSelectedTicket] = useState(ticketId);
  const [monitoringAppStatus, setMonitoringAppStatus] = useState('P');
  const [financierMonitoringStatus, setFinancierMonitoringStatus] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (projectId) {
      projectService
        .find(projectId, { fields: 'monitoring_app_status,financier_monitoring_status' })
        .then((response) => {
          setMonitoringAppStatus(response.monitoring_app_status || 'P');
          setFinancierMonitoringStatus(response.financier_monitoring_status || '');
        })
        .catch((error) => {
          console.error('Erro ao carregar status do projeto:', error);
          enqueueSnackbar('Erro ao carregar status do projeto', { variant: 'error' });
        });
    }
  }, [projectId, enqueueSnackbar]);

  const params = useMemo(
    () => ({
      fields:
        'id,subject.subject,priority,status,created_at,responsible.complete_name,created_by.complete_name,project.id,responsible_department.name,ticket_type.name,conclusion_date,deadline',
      expand: 'responsible,created_by,project,ticket_type,subject',
      project__in: projectId,
      page: page + 1,
      page_size: rowsPerPage,
      _refresh: refreshKey,
    }),
    [page, rowsPerPage, projectId, refreshKey],
  );

  const { loading: loadingTickets, error: ticketsError, ticketData } = useTicket(params);

  const handleTicketFormSuccess = () => {
    setOpenTicketFormModal(false);
    setSelectedTicket(null);
    enqueueSnackbar('Ticket salvo com sucesso!', { variant: 'success' });
    setRefreshKey((prev) => prev + 1);
  };

  if (loadingTickets) {
    return <TableSkeleton columns={8} rows={4} />;
  }

  if (ticketsError) {
    enqueueSnackbar(ticketsError, { variant: 'error' });
    return null;
  }

  const handleMonitoringAppStatusChange = (value) => {
    setMonitoringAppStatus(value);
    projectService
      .update(projectId, { monitoring_app_status: value })
      .then(() => {
        enqueueSnackbar('Status do app de monitoramento atualizado com sucesso!', {
          variant: 'success',
        });
        setRefreshKey((prev) => prev + 1);
      })
      .catch((error) => {
        console.error('Erro ao atualizar status do app de monitoramento:', error);
        enqueueSnackbar('Erro ao atualizar status do app de monitoramento', { variant: 'error' });
      });
  };

  const handleFinancierMonitoringStatusChange = (value) => {
    setFinancierMonitoringStatus(value);
    projectService
      .update(projectId, { financier_monitoring_status: value })
      .then(() => {
        enqueueSnackbar('Status de monitoramento da financiadora atualizado com sucesso!', {
          variant: 'success',
        });
        setRefreshKey((prev) => prev + 1);
      })
      .catch((error) => {
        console.error('Erro ao atualizar status de monitoramento da financiadora:', error);
        enqueueSnackbar('Erro ao atualizar status de monitoramento da financiadora', {
          variant: 'error',
        });
      });
  };

  const ticketsColumns = [
    { field: 'subject.subject', headerName: 'Título', render: (r) => r.subject?.subject },
    { field: 'priority', headerName: 'Prioridade', render: (r) => r.priority },
    {
      field: 'ticket_type',
      headerName: 'Tipo de Ticket',
      render: (r) => r.ticket_type?.name,
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (r) => {
        <TicketStatusChip status={r.status} />;
      },
    },
    {
      field: 'responsible',
      headerName: 'Responsável',
      render: (r) => r.responsible?.complete_name,
    },
    {
      field: 'created_by',
      headerName: 'Criado por',
      render: (r) => r.created_by?.complete_name,
    },
    {
      field: 'created_at',
      headerName: 'Criado em',
      render: (r) => formatDateTime(r.created_at),
    },
    {
      field: 'deadline',
      headerName: 'Prazo (horas)',
      render: (r) => (r.deadline ? `${r.deadline}h` : '-'),
    },
    {
      field: 'conclusion_date',
      headerName: 'Data de Conclusão',
      render: (r) => formatDateTime(r.conclusion_date),
    },
  ];

  return (
    <>
      <Typography fontSize={20} fontWeight={700} gutterBottom>
        Relacionamento com o Cliente
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormSelect
            label="Status da Entrega do App de Monitoramento"
            options={[
              { value: 'C', label: 'Criado' },
              { value: 'E', label: 'Criado e Entregue' },
              { value: 'S', label: 'Cliente sem Internet' },
              { value: 'P', label: 'Pendente' },
            ]}
            value={monitoringAppStatus}
            onChange={(e) => handleMonitoringAppStatusChange(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormSelect
            label="Status de Monitoramento da Financiadora"
            options={[
              { value: '', label: 'Selecione...' },
              { value: 'SFI', label: 'Sem Foto da Instalação' },
              { value: 'CMK', label: 'Confirmar Mensagem de Kit Entregue' },
              { value: 'FTA', label: 'Falha na Transferência (Em Análise)' },
              {
                value: 'AAD',
                label: 'Aguardando Aprovação da Documentação de Equipamento Entregue',
              },
              { value: 'F', label: 'Finalizado' },
            ]}
            value={financierMonitoringStatus}
            onChange={(e) => handleFinancierMonitoringStatusChange(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TableHeader.Root>
            <TableHeader.Title
              title="Total de Tickets"
              totalItems={ticketData.meta.pagination.total_count}
            />
            {!viewOnly && (
              <TableHeader.Button
                buttonLabel="Adicionar Ticket"
                icon={<Add />}
                onButtonClick={() => {
                  setOpenTicketFormModal(true);
                  setSelectedTicket(null);
                }}
                sx={{ width: 200 }}
              />
            )}
          </TableHeader.Root>
        </Grid>

        <Grid item xs={12}>
          <Table.Root
            data={ticketData.results}
            totalRows={ticketData.meta.pagination.total_count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            onRowClick={(r) => {
              setSelectedTicket(r.id);
              setOpenTicketFormModal(true);
            }}
            noWrap
          >
            <Table.Head columns={ticketsColumns}>
              <Table.Cell align="center">Ver</Table.Cell>
              {!viewOnly && (
                <>
                  <Table.Cell align="center">Editar</Table.Cell>
                  <Table.Cell align="center">Principal</Table.Cell>
                </>
              )}
            </Table.Head>

            <Table.Body
              loading={loadingTickets}
              columns={ticketsColumns.length}
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' },
              }}
            >
              {ticketsColumns.map((col) => (
                <Table.Cell key={col.field} render={col.render} sx={col.sx} />
              ))}
            </Table.Body>
          </Table.Root>
        </Grid>
      </Grid>

      {!viewOnly && (
        <Dialog
          open={openTicketFormModal}
          onClose={() => {
            setOpenTicketFormModal(false);
            setSelectedTicket(null);
          }}
          maxWidth="md"
          sx={{
            padding: 2,
            '& .MuiDialog-paper': {
              minWidth: '50vw',
              minHeight: '90vh',
            },
          }}
        >
          <DialogContent>
            <TicketForm
              ticketId={selectedTicket}
              projectId={projectId}
              onSave={handleTicketFormSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
