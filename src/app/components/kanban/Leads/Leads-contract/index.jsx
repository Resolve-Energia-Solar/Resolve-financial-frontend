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
    const [loadingContracts, setLoadingContracts] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const columns = [
        { field: 'leadName', headerName: 'Cliente' },
        { field: 'contract.name', headerName: 'Proposta' },
        { field: 'contract.product_value', headerName: 'Valor' },
        { field: 'kwp', headerName: 'Responsável' },
        { field: 'contractSubmission.status', headerName: 'Data' },
        {
            field: 'column.name',
            headerName: 'Status',
            render: (row) => {
                const statusColors = {
                    "Assinado": { bg: "#000000", text: "#FFFFFF"},
                    "Cancelado": { bg: "#FEEFED", text: "#303030"},
                    "Enviado": { bg: "#F9F7E6", text: "#303030"},
                    "Pendente": { bg: "#F9F0E6", text: "#303030"},
                }

                const status = row?.column?.headerName || "-";
                const { bg, text } = statusColors[status] || { bg: "#E0E0E0", text: "#000000" };

                return (
                    <Chip
                        label={status}
                        sx={{
                            backgroundColor: bg,
                            color: text,
                            fontSize: "10px",
                            fontWeight: 400,
                            borderRadius: "15px",
                            px: 2,
                            height: 24,
                        }}
                    />
                );
            }
        },
    ];

    useEffect(() => {
        const fetchLeads = async () => {
            setLoadingContracts(true);
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
                setLoadingContracts(false);
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
                        loading={loadingContracts}
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

                </Box>
            </Grid>
        </Grid>
    );
}

export default LeadsContractPage;
