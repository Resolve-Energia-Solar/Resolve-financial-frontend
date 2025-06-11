'use client';
import { useState, useEffect, useCallback, useContext } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';
import { FilterAlt } from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { useTheme, Grid, Dialog, DialogContent } from '@mui/material';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { FilterContext } from '@/context/FilterContext';
import UserCard from '@/app/components/apps/users/userCard';
import { IconPlus } from '@tabler/icons-react';
import TicketForm from '@/app/components/apps/project/Costumer-journey/Project-Detail/customer-service/TicketForm';
import ticketService from '@/services/ticketService';
import TicketStatusChip from '@/app/components/apps/customer_service/TicketStatusChip';
import TicketPriority from '@/app/components/apps/customer_service/TicketPriority';

const TicketsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);
  const [openTicketForm, setOpenTicketForm] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [ordering, setOrdering] = useState('-created_at');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ticketService.index({
        fields:
          'id,protocol,project.id,project.project_number,project.sale.customer.complete_name,responsible,subject.subject,description,ticket_type,priority,responsible_department,responsible_user,status,conclusion_date,deadline,observer,answered_at,answered_by,closed_at,closed_by,resolved_at,resolved_by,created_by,created_at,updated_at,duration',
        expand: 'project,project.sale.customer,subject',
        is_deleted: false,
        page: page + 1,
        limit: rowsPerPage,
        ordering,
        ...filters,
      });
      setTickets(response.results);
      setTotalRows(response.meta.pagination.total_count);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar tickets', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters, ordering, enqueueSnackbar]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets, refresh, filters]);

  const handleSort = (field) => {
    setPage(0);
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else {
      setOrdering(field);
    }
  };

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Tickets' }];

  const columns = [
    {
      field: 'project.project_number,project.sale.customer.complete_name',
      headerName: 'Projeto',
      render: (r) => `${r.project?.project_number} - ${r.project?.sale?.customer?.complete_name}`,
      sx: { opacity: 0.7 },
    },
    {
      field: 'protocol',
      headerName: 'Protocolo',
      render: (r) => r.protocol || '-',
      sx: { fontWeight: 'bold', color: theme.palette.primary.main },
    },
    {
      field: 'created_by',
      headerName: 'Criado por',
      render: (r) => r.created_by ? <UserCard userId={r.created_by} /> : '-'
    },
    {
      field: 'created_at',
      headerName: 'Data de Abertura',
      render: (r) => r.created_at ? new Date(r.created_at).toLocaleString('pt-BR') : '-',
      sortable: true,
    },
    {
      field: 'priority',
      headerName: 'Prioridade',
      render: (r) => <TicketPriority priority={r.priority} />,
    },
    {
      field: 'subject.subject',
      headerName: 'Assunto',
      render: (r) => r.subject?.subject || 'N/A',
    },
    {
      field: 'responsible',
      headerName: 'Responsável',
      render: (r) => r.responsible ? <UserCard userId={r.responsible} /> : '-',
    },
    {
      field: 'status',
      headerName: 'Status',
      render: (r) => <TicketStatusChip status={r.status} />,
    },
    {
      field: 'duration',
      headerName: 'Duração',
      render: (r) => r.duration || '-'
    }
  ];

  const handleRowClick = (row) => {
    setSelectedProject(row.project?.id);
    setSelectedRow(row.id);
    setOpenDrawer(true);
  };

  const handlePageChange = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target?.value, 10));
    setPage(0);
  }, []);

  return (
    <PageContainer title={'Tickets'} description={'Dashboard de Tickets'}>
      <Breadcrumb items={BCrumb} />

      {/* Tabela de Projetos */}
      <TableHeader.Root>
        <TableHeader.Title
          title="Total"
          totalItems={totalRows}
          objNameNumberReference={totalRows === 1 ? 'Ticket' : 'Tickets'}
          loading={loading}
        />
        <Grid
          item
          gridArea="button"
          container
          direction="row"
          spacing={1}
          justifyContent="flex-end"
        >
          <TableHeader.Button
            buttonLabel="Filtros"
            icon={<FilterAlt />}
            onButtonClick={() => setFilterDrawerOpen(true)}
            sx={{ width: 120 }}
          />
          <TableHeader.Button
            buttonLabel="Adicionar"
            icon={<IconPlus />}
            onButtonClick={() => setOpenTicketForm(true)}
            sx={{ width: 120 }}
          />
        </Grid>
      </TableHeader.Root>

      <Table.Root
        data={tickets}
        totalRows={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={handleRowClick}
        onClose={() => {
          setOpenDrawer(false);
          setSelectedProject(null);
        }}
        noWrap={true}
      >
        <Table.Head columns={columns} onSort={handleSort} />
        <Table.Body
          loading={loading}
          columns={columns.length}
          onRowClick={handleRowClick}
          sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' } }}
        >
          {columns.map((col) => (
            <Table.Cell key={col.field} render={col.render} sx={col.sx} />
          ))}
        </Table.Body>
        <Table.Pagination />
      </Table.Root>
      <ProjectDetailDrawer
        projectId={selectedProject}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        tab={'Pós-Venda'}
        extraId={selectedRow}
      />
      {/* Formulário de Ticket */}
      <Dialog open={openTicketForm} onClose={() => setOpenTicketForm(false)} fullWidth maxWidth="md" sx={{ padding: 2 }}>
        <DialogContent dividers>
          <TicketForm onSave={() => { setOpenTicketForm(false); fetchTickets(); }} />
        </DialogContent>
      </Dialog>
      {/* Filtros */}
      <GenericFilterDrawer
        filters={filterConfig}
        initialValues={filters}
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </PageContainer>
  );
};

export default TicketsDashboard;
