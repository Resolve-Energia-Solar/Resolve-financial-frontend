import {
    TablePagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    Button,
    Chip,
    IconButton
  } from '@mui/material';
  
  import { useRouter } from 'next/navigation';
  import React, { useState, useEffect } from 'react';
  import proposalService from '@/services/proposalService';
  import TableHeader from '@/app/components/kanban/Leads/components/TableHeader'
  import TableComponent from '@/app/components/kanban/Leads/components/TableComponent'
  import formatPhoneNumber from '@/utils/formatPhoneNumber';
  
  
  const LeadsProposalListPage = () => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loadingProposals, setLoadingProposals] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const columns = [
      { field: 'name', headerName: 'Cliente' },
      { field: 'first_document', headerName: 'Proposta' },
      { field: 'origin?.name', headerName: 'Nome' },
      { field: 'kwp', headerName: 'Valor' },
      { field: 'address', headerName: 'Responsável' },
      { field: 'phone', headerName: 'Data' },
      {
        field: 'column.name',
        headerName: 'Status',
        render: (row) => (
          <Chip
            label={row?.column?.name || '-'}
            sx={{
              border: `1px solid ${row?.column?.color || 'transparent'}`,
              backgroundColor: 'transparent',
              color: "#7E8388"
            }}
          />
        )
      },
    ];
  
    useEffect(() => {
      const fetchProposals = async () => {
        setLoadingProposals(true);
        try {
          const data = await proposalService.getLeads({
            params: {
              page: page + 1,
              limit: rowsPerPage,
            },
          });
          setData(data.results);
          setTotalRows(data.count);
        } catch (err) {
          setError('Erro ao carregar Propostas');
        } finally {
          setLoadingProposals(false);
        }
      };
  
      fetchProposals();
    }, [page, rowsPerPage]);
  
  
    return (
      <>
        <TableHeader
          title={"Total"}
          totalItems={totalRows}
          objNameNumberReference={"Propostas"}
          buttonLabel="Criar"
          onButtonClick={() => console.log('Go to create proposal')}
        />
  
        <TableComponent
          columns={columns}
          data={data}
          totalRows={totalRows}
          loading={loadingProposals}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRows) => {
            setRowsPerPage(newRows);
            setPage(0);
          }}
          actions={{
            edit: (row) => router.push("/apps/leads/${row.id}/edit"),
            view: (row) => router.push("/apps/leads/${row.id}/view"),
          }}
        />
  
      </>
    );
  };
  
  export default LeadsProposalListPage;
  