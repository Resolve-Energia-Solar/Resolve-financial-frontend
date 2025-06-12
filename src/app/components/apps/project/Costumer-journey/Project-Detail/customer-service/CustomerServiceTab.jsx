'use client';
import React, { useState, useMemo } from 'react';
import {
  Chip,
  Typography,
  Grid,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import TableSkeleton from '../../../../comercial/sale/components/TableSkeleton';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';
import TicketForm from './TicketForm';
import useTicket from '@/hooks/tickets/useTicket';
import { formatDateTime } from '@/utils/inspectionFormatDate';

export default function CustomerServiceTab({ projectId, viewOnly = false, ticketId = null }) {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openTicketFormModal, setOpenTicketFormModal] = useState(!!ticketId);
  const [selectedTicket, setSelectedTicket] = useState(ticketId);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(
    () => ({
      fields:
        'id,subject.subject,priority,status,created_at,responsible.complete_name,responsible_user.complete_name,project.id,responsible_department.name,ticket_type.name,conclusion_date,deadline',
      expand: 'responsible,responsible_user,project,ticket_type,subject',
      project__in: projectId,
      page: page + 1,
      page_size: rowsPerPage,
      _refresh: refreshKey,
    }),
    [page, rowsPerPage, projectId, refreshKey]
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
        const statusMap = {
          A: { label: 'Aberto', color: 'info' },
          P: { label: 'Pendente', color: 'warning' },
          R: { label: 'Resolvido', color: 'primary' },
          F: { label: 'Finalizado', color: 'success' },
          C: { label: 'Cancelado', color: 'error' },
        };
        const statusInfo = statusMap[r.status] || { label: r.status, color: 'default' };
        return <Chip label={statusInfo.label} color={statusInfo.color} />;
      },
    },
    {
      field: 'responsible_user',
      headerName: 'Responsável',
      render: (r) => r.responsible_user?.complete_name,
    },
    {
      field: 'responsible',
      headerName: 'Criado por',
      render: (r) => r.responsible?.complete_name,
    },
    {
      field: 'created_at',
      headerName: 'Criado em',
      render: (r) => formatDateTime(r.created_at),
    },
    {
      field: 'deadline',
      headerName: 'Prazo (horas)',
      render: (r) => r.deadline ? `${r.deadline}h` : '-',
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
                cursor: "pointer",
                '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' },
              }}
            >
              {ticketsColumns.map(col => (
                <Table.Cell
                  key={col.field}
                  render={col.render}
                  sx={col.sx}
                />
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
            }
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
