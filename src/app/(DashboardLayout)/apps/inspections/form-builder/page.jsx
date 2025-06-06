'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* material */
import {
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import { AddBoxRounded, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { IconEyeglass } from '@tabler/icons-react';

/* components */
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';
import { Table } from '@/app/components/Table';
import { TableHeader } from '@/app/components/TableHeader';

/* services */
import formBuilderService from '@/services/formBuilderService';

const FormBuilderList = () => {
  const [formList, setFormList] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const data = await formBuilderService.index({
          page: page + 1,
          limit: rowsPerPage
        });
        setFormList(data);
        setTotalRows(data.meta.pagination.total_count);
      } catch (err) {
        setError('Erro ao carregar formulários');
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, [page, rowsPerPage]);

  const handleCreateClick = () => {
    router.push('/apps/inspections/form-builder/create');
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/form-builder/${id}/update`);
  };

  const handleViewClick = (id) => {
    router.push(`/apps/inspections/form-builder/${id}/view`);
  };

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setFormToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await formBuilderService.delete(formToDelete.id);
      setFormList(prev => ({
        ...prev,
        results: prev.results.filter((f) => f.id !== formToDelete.id),
      }));
    } catch {
      setError('Erro ao deletar formulário');
    } finally {
      handleCloseModal();
    }
  };

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row) => {
    router.push(`/apps/inspections/form-builder/${row.id}/view`);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      render: (r) => r.id,
      sx: { cursor: 'pointer'}
    },
    {
      field: 'name',
      headerName: 'Nome',
      render: (r) => r.name || '-',
      sx: { cursor: 'pointer'}
    },
    {
      field: 'service',
      headerName: 'Serviço',
      render: (r) => r.service?.name || 'Sem serviço associado',
      sx: { cursor: 'pointer'}
    },
    {
      field: 'actions',
      headerName: 'Ações',
      render: (r) => (
        <>
          <Tooltip title="Editar">
            <IconButton
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(r.id);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Visualizar">
            <IconButton
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleViewClick(r.id);
              }}
            >
              <IconEyeglass />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(r);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
      sx: { display: 'flex', justifyContent: 'start', cursor: 'pointer' },
    },
  ];

  return (
    <PageContainer title="Formulários" description="Listagem de formulários">
      <BlankCard>
        <CardContent>
          <TableHeader.Root>
            <TableHeader.Title
              title="Lista de Formulários"
              totalItems={totalRows}
              objNameNumberReference="formulários"
              loading={loading}
            />
            <TableHeader.Button
              buttonLabel="Criar Formulário"
              icon={<AddBoxRounded />}
              onButtonClick={handleCreateClick}
            />
          </TableHeader.Root>

          {loading ? (
            <Typography>Carregando formulários...</Typography>
          ) : error ? (
            <Typography>{error}</Typography>
          ) : (
            <Table.Root
              data={formList.results || []}
              noWrap
              totalRows={totalRows}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              onRowClick={handleRowClick}
            >
              <Table.Head columns={columns} />
              <Table.Body loading={loading} columns={columns.length}>
                {columns.map((col) => (
                  <Table.Cell
                    key={col.field}
                    field={col.field}
                    render={col.render}
                    align={col.align}
                    sx={col.sx}
                  />
                ))}
              </Table.Body>
              <Table.Pagination />
            </Table.Root>
          )}
        </CardContent>
      </BlankCard>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleCloseModal}
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o formulário? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="primary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default FormBuilderList;
