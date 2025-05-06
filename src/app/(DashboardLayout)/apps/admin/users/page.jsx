'use client';
import { useState, useEffect, useCallback } from 'react';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import { useSnackbar } from 'notistack';
import userService from '@/services/userService';
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import { Chip, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import UserForm from '@/app/components/apps/users/UserForm';

const UserList = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.index({ user_types: 3, fields: 'id,complete_name,username,email,is_active,employee.role.name,employee.branch.name,last_login,person_type', expand: 'employee.role,employee.branch', page: page + 1, limit: rowsPerPage });
      setUsers(response.results);
      setTotalRows(response.meta.pagination.total_count);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar Funcionários', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Funcionários',
    },
  ];

  const columns = [
    {
      field: 'complete_name',
      headerName: 'Nome Completo',
      render: r => r.complete_name || 'SEM NOME',
      sx: { opacity: 0.7 }
    },
    {
      field: 'email',
      headerName: 'E-mail',
      render: r => r.email || '-'
    },
    {
      field: 'role',
      headerName: 'Cargo',
      render: r => r.employee?.role?.name || '-'
    },
    {
      field: 'branch',
      headerName: 'Filial',
      render: r => r.employee?.branch?.name || '-'
    },
    {
      field: 'person_type',
      headerName: 'Tipo de Pessoa',
      render: r => {
        if (r.person_type === 'PF') return (
          <Chip
            label="Física"
            color="info"
            icon={<PersonIcon />}
            size="small"
            sx={{ color: 'white', backgroundColor: (theme) => theme.palette.info.main }}
          />
        );
        if (r.person_type === 'PJ') return (
          <Chip
            label="Jurídica"
            color="secondary"
            icon={<BusinessIcon />}
            size="small"
            sx={{ color: 'white', backgroundColor: (theme) => theme.palette.secondary.main }}
          />
        );
        return '-';
      }
    },
    {
      field: 'is_active',
      headerName: 'Status',
      render: r => {
        if (typeof r.is_active === 'boolean') {
          return r.is_active ? (
            <Chip
              label="Ativo"
              color="success"
              icon={<CheckIcon />}
              size="small"
              sx={{ color: 'white', backgroundColor: (theme) => theme.palette.success.main }}
            />
          ) : (
            <Chip
              label="Inativo"
              color="error"
              icon={<CloseIcon />}
              size="small"
              sx={{ color: 'white', backgroundColor: (theme) => theme.palette.error.main }}
            />
          );
        }
        return '-';
      }
    },
    {
      field: 'last_login',
      headerName: 'Último Acesso',
      render: r => {
        if (r.last_login) {
          const date = new Date(r.last_login);
          return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        }
        return '-';
      }
    },
  ];

  const handleRowClick = (row) => {
    console.log(row);
  }

  const handleEditClick = (row) => {
    console.log(row);
  }
  const handleViewClick = (row) => {
    console.log(row);
  }

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target?.value, 10));
    setPage(0);
  }, []);

  return (

    <PageContainer title={'Funcionários'}>
      <Breadcrumb items={BCrumb} />
      <TableHeader.Root>
        <TableHeader.Title
          title="Total"
          totalItems={totalRows}
          objNameNumberReference={totalRows === 1 ? "Funcionário" : "Funcionários"}
        />
        <TableHeader.Button
          buttonLabel="Adicionar funcionário"
          onButtonClick={() => { console.log('Adicionar funcionário'); }}
          sx={{
            width: 200,
          }}
        />
      </TableHeader.Root>

      <Table.Root
        data={users}
        totalRows={totalRows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
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
          <Table.Cell align="center">Editar</Table.Cell>
          <Table.Cell align="center">Ver</Table.Cell>
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
          <Table.EditAction onClick={r => { handleEditClick(r.id) }} />
          <Table.ViewAction onClick={(r) => { handleViewClick(r.id) }} />
        </Table.Body>
        <Table.Pagination />
      </Table.Root>

      <Dialog
        open={open}
        // onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h4">Adicionar Usuário</Typography>
        </DialogTitle>
        <DialogContent>
          <UserForm />
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
};

export default UserList;
