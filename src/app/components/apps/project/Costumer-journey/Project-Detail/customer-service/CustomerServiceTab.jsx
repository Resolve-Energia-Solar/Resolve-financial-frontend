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

export default function CustomerServiceTab({ projectId, viewOnly = false }) {
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openTicketFormModal, setOpenTicketFormModal] = useState(false);
  const [openViewTicket, setOpenViewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const params = useMemo(
    () => ({
      fields:
        'id,subject,priority,status,created_at,responsible.complete_name,responsible_user.complete_name,project.id,responsible_department.name,ticket_type.name,conclusion_date,deadline',
      expand: 'responsible,responsible_user,project,ticket_type',
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
    { field: 'subject', headerName: 'Título', render: (r) => r.subject },
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
      headerName: 'Prazo',
      render: (r) => formatDateTime(r.deadline),
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
            noWrap={true}
          >
            <Table.Head columns={ticketsColumns}>
              {!viewOnly && <Table.Cell align="center">Editar</Table.Cell>}
              <Table.Cell align="center">Ver</Table.Cell>
            </Table.Head>

            <Table.Body loading={loadingTickets} columns={ticketsColumns.length}>
              {ticketData.results.map((row) => (
                <>
                  <Table.Cell render={() => row.subject} />
                  <Table.Cell render={() => row.priority} />
                  <Table.Cell render={() => row.ticket_type?.name} sx={{ opacity: 0.7 }} />
                  <Table.Cell render={() => {
                    const statusMap = {
                      A: { label: 'Aberto', color: 'info' },
                      P: { label: 'Pendente', color: 'warning' },
                      R: { label: 'Resolvido', color: 'primary' },
                      F: { label: 'Finalizado', color: 'success' },
                      C: { label: 'Cancelado', color: 'error' },
                    };
                    const statusInfo = statusMap[row.status] || { label: row.status, color: 'default' };
                    return <Chip label={statusInfo.label} color={statusInfo.color} />;
                  }} sx={{ opacity: 0.7 }} />
                  <Table.Cell render={() => row.responsible_user?.complete_name} sx={{ opacity: 0.7 }} />
                  <Table.Cell render={() => row.responsible?.complete_name} sx={{ opacity: 0.7 }} />
                  <Table.Cell render={() => formatDateTime(row.created_at)} sx={{ opacity: 0.7 }} />
                  <Table.Cell render={() => formatDateTime(row.deadline)} sx={{ opacity: 0.7 }} />
                  <Table.Cell render={() => formatDateTime(row.conclusion_date)} sx={{ opacity: 0.7 }} />
                  {!viewOnly && (
                    <Table.EditAction
                      onClick={() => {
                        setSelectedTicket(row.id);
                        setOpenTicketFormModal(true);
                      }}
                    />
                  )}
                  <Table.ViewAction
                    onClick={() => {
                      setSelectedTicket(row.id);
                      setOpenViewTicket(true);
                    }}
                  />
                </>
              ))}
            </Table.Body>

            <Table.Pagination />
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
