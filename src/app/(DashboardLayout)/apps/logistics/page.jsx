'use client';
import { useState, useEffect, useCallback } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import projectService from '@/services/projectService';
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import StatusChip from '@/utils/status/DocumentStatusIcon';
import { FilterAlt } from '@mui/icons-material';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';

const LogisticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.index({ user_types: 3, fields: 'id,project_number,sale.customer.complete_name,product.description,address.complete_address,sale.status', expand: 'sale.customer,product,address', page: page + 1, limit: rowsPerPage });
      setProjects(response.results);
      setTotalRows(response.meta.pagination.total_count);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar Projetos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, enqueueSnackbar]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);


  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Logística',
    },
  ];

  const columns = [
    {
      field: 'project_number',
      headerName: 'Projeto',
      render: r => `${r.project_number} - ${r.sale?.customer?.complete_name}` || 'SEM NÚMERO',
      sx: { opacity: 0.7 }
    },
    {
      field: 'product.description',
      headerName: 'Produto',
      render: r => r.product?.description || '-'
    },
    {
      field: 'address',
      headerName: 'Endereço',
      render: r => r.address?.complete_address || '-'
    },
    {
      field: 'sale.status',
      headerName: 'Status da Venda',
      render: r => <StatusChip status={r.sale?.status} />
    },
    {
      field: 'purchase_status',
      headerName: 'Status da Compra',
      render: r => { /* Logic for purchase status */ }
    },
    {
      field: 'delivery_status',
      headerName: 'Status da Entrega',
      render: r => { /* Logic for delivery status */ }
    },
  ];

  const handleRowClick = (row) => {
    setSelectedRow(row.id);
    setOpenDrawer(true);
  }

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target?.value, 10));
    setPage(0);
  }, []);

  return (
    <PageContainer title={'Projetos'}>
      <Breadcrumb items={BCrumb} />
      <TableHeader.Root>
        <TableHeader.Title
          title="Total"
          totalItems={totalRows}
          objNameNumberReference={totalRows === 1 ? "Projeto" : "Projetos"}
        />
        <TableHeader.Button
          buttonLabel="Filtros"
          icon={<FilterAlt />}
          onButtonClick={() => { console.log('Filtros'); }}
          sx={{
            width: 200,
            marginLeft: 2,
          }}
        />
      </TableHeader.Root>

      <Table.Root
        data={projects}
        totalRows={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={handleRowClick}
        onClose={() => {setOpenDrawer(false); setSelectedRow(null);}}
        noWrap={true}
      >
        <Table.Head>
          {columns.map(c => (
            <Table.Cell
              key={c.field}
              sx={{ fontWeight: 600, fontSize: '14px' }}
            >
              {c.headerName}
            </Table.Cell>
          ))}
        </Table.Head>

        <Table.Body
          loading={loading}
          onRowClick={handleRowClick}
          sx={{
            cursor: "pointer",
            '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' },
          }}
        >
          {columns.map(col => (
            <Table.Cell
              key={col.field}
              render={col.render}
              sx={col.sx}
            />
          ))}
        </Table.Body>
        <Table.Pagination />
      </Table.Root>
      <ProjectDetailDrawer projectId={selectedRow} open={openDrawer} onClose={() => setOpenDrawer(false)} />
    </PageContainer>
  );
};

export default LogisticsDashboard;
