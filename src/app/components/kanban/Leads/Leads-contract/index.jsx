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
    IconButton,
    Grid
} from '@mui/material';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import leadService from '@/services/leadService';
import TableHeader from '@/app/components/kanban/Leads/components/TableHeader'
import TableComponent from '@/app/components/kanban/Leads/components/TableComponent'
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import formatPhoneNumber from '@/utils/formatPhoneNumber';


const LeadsContractPage = ({ leadId = null }) => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const columns = [
        { field: 'name', headerName: 'Nome' },
        { field: 'product.name', headerName: 'Produto' },
        { field: 'product.product_value', headerName: 'Total' },
        { field: 'kwp', headerName: 'Vendedor' },
        { field: 'contractSubmission.status', headerName: 'Data' },
        {
            field: 'column.name',
            headerName: 'Status',
            render: (row) => (
                <Chip
                    // label={row?.column?.name || '-'}
                    label={"Aprovada" || '-'}
                    sx={{
                        border: `1px solid ${row?.column?.color || 'transparent'}`,
                        backgroundColor: '#000000',
                        color: "#FFFFFF",
                        px: 2,
                        fontSize: 10,
                        // width: 95,
                        // height: 27
                    }}
                />
            )
        },
    ];

    useEffect(() => {
        const fetchLeads = async () => {
            setLoadingLeads(true);
            try {
                const data = await leadService.getLeads({
                    params: {
                        page: page + 1,
                        limit: rowsPerPage,
                    },
                });
                setData(data.results);
                setTotalRows(data.count);
            } catch (err) {
                setError('Erro ao carregar Leads');
            } finally {
                setLoadingLeads(false);
            }
        };

        fetchLeads();
    }, [page, rowsPerPage]);

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} sx={{ overflow: 'scroll' }}>
                <Box
                    sx={{
                        borderRadius: '20px',
                        boxShadow: 3,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >

                    <Grid item spacing={2} alignItems="center" xs={12}>
                        <LeadInfoHeader leadId={leadId} />
                    </Grid>

                    <Grid container spacing={4} sx={{ mt: 2, mb: 1, ml: 1.5 }}>
                        <Typography variant="h5" fontWeight={"bold"}>
                            Contratos
                        </Typography>

                    </Grid>

                    <TableComponent
                        columns={columns}
                        data={data}
                        totalRows={totalRows}
                        loading={loadingLeads}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(newPage) => setPage(newPage)}
                        onRowsPerPageChange={(newRows) => {
                            setRowsPerPage(newRows);
                            setPage(0);
                        }}
                        actions={{
                            edit: (row) => router.push(`/apps/leads/${row.id}/edit`),
                            view: (row) => router.push(`/apps/leads/${row.id}/view`),
                        }}
                    />

                </Box>
            </Grid>
        </Grid>
    );
}

export default LeadsContractPage;
