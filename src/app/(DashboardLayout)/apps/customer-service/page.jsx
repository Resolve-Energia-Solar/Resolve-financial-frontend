'use client';
import { useState, useEffect, useCallback, useContext } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import projectService from '@/services/projectService';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';
import StatusChip from '@/utils/status/DocumentStatusIcon';
import { FilterAlt } from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { useTheme, Grid, Dialog, DialogContent } from '@mui/material';
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import filterConfig from './filterConfig';
import { formatDate } from '@/utils/dateUtils';
import ScheduleOpinionChip from '@/app/components/apps/inspections/schedule/StatusChip/ScheduleOpinionChip';
import { FilterContext } from '@/context/FilterContext';
import UserCard from '@/app/components/apps/users/userCard';
import JourneyCounterChip from '@/app/components/apps/project/Costumer-journey/JourneyCounterChip';
import { IconPlus } from '@tabler/icons-react';
import TicketForm from '@/app/components/apps/project/Costumer-journey/Project-Detail/customer-service/TicketForm';

const TicketsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const { filters, setFilters, clearFilters, refresh } = useContext(FilterContext);
  const [openTicketForm, setOpenTicketForm] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [ordering, setOrdering] = useState('-created_at');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({
        fields:
          'id,project_number,sale.customer.complete_name,sale.signature_date,sale.status,journey_counter,sale.branch.name,inspection.schedule_date,inspection.final_service_opinion.name,inspection.final_service_opinion_date,inspection.final_service_opinion_user,sale.id',
        expand: 'sale,sale.customer,sale.branch,inspection,inspection.final_service_opinion',
        metrics: 'journey_counter',
        page: page + 1,
        limit: rowsPerPage,
        ordering,
        remove_termination_cancelled_and_pre_sale: true,
        ...filters,
      });
      setProjects(response.results);
      setTotalRows(response.meta.pagination.total_count);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar Projetos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters, ordering, enqueueSnackbar]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, refresh, filters]);

  const handleSort = (field) => {
    setPage(0);
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else {
      setOrdering(field);
    }
  };

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Relacionamento' }];

  const columns = [
    {
      field: 'project',
      headerName: 'Projeto',
      render: (r) => `${r.project_number} - ${r.sale?.customer?.complete_name}` || 'SEM NÚMERO',
      sx: { opacity: 0.7 },
    },
    {
      field: 'sale.signature_date',
      headerName: 'Data de Assinatura',
      render: (r) => formatDate(r.sale?.signature_date),
    },
    {
      field: 'sale.status',
      headerName: 'Status',
      render: (r) => <StatusChip status={r.sale?.status} />,
    },
    {
      field: 'journey_counter',
      headerName: 'Contador',
      render: (r) => <JourneyCounterChip count={r.journey_counter} />,
      sortable: true,
    },
    {
      field: 'sale.branch',
      headerName: 'Unidade',
      render: (r) => r.sale?.branch?.name || '-',
    },
    {
      field: 'inspection.final_service_opinion.name',
      headerName: 'Tickets Abertos',
      render: (r) => <ScheduleOpinionChip status={r.inspection?.final_service_opinion?.name} />,
    },
    {
      field: 'inspection.schedule_date',
      headerName: 'Ticket aberto em',
      render: (r) => formatDate(r.inspection?.schedule_date),
      sortable: true,
    },
    {
      field: 'inspection.final_service_opinion_user',
      headerName: 'Setores Responsáveis',
      render: (r) => {
        return r.inspection?.final_service_opinion_user ? (
          <UserCard userId={r.inspection?.final_service_opinion_user} />
        ) : (
          '-'
        );
      },
    },
    {
      field: 'inspection.final_service_opinion_user',
      headerName: 'Responsável',
      render: (r) => {
        return r.inspection?.final_service_opinion_user ? (
          <UserCard userId={r.inspection?.final_service_opinion_user} />
        ) : (
          '-'
        );
      },
    },
  ];

  const handleRowClick = (row) => {
    setSelectedRow(row.id);
    setSelectedSaleId(row.sale?.id);
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
          objNameNumberReference={totalRows === 1 ? 'Projeto' : 'Projetos'}
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
        data={projects}
        totalRows={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={handleRowClick}
        onClose={() => {
          setOpenDrawer(false);
          setSelectedRow(null);
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
        saleId={selectedSaleId}
        projectId={selectedRow}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      />
      {/* Formulário de Ticket */}
      <Dialog open={openTicketForm} onClose={() => setOpenTicketForm(false)} fullWidth maxWidth="md" sx={{ padding: 2 }}>
        <DialogContent dividers>
          <TicketForm onSave={() => { }} />
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
