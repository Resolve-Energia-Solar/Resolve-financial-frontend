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
    Grid,
    Dialog,
} from '@mui/material';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import leadService from '@/services/leadService';
import TableHeader from '@/app/components/kanban/Leads/components/TableHeader'
import TableComponent from '@/app/components/kanban/Leads/components/TableComponent'
import formatPhoneNumber from '@/utils/formatPhoneNumber';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import LeadProposalPage from './Add-Proposal';
import LeadsViewProposal from './View-Proposal';


const LeadsProposalListPage = ({ leadId = null }) => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loadingProposals, setLoadingProposals] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);

    const proposalStatus = {
        "A": { label: "Aceita", color: "#E9F9E6" },
        "R": { label: "Recusada", color: "#FEEFEE" },
        "P": { label: "Pendente", color: "#FFF7E5" },
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Nome',
            flex: 1,
            render: (row) =>
                row?.products.length > 0
                    ? row.products.map((product) => product.name).join(', ')
                    : 'Nenhum produto vinculado',
        },
        {
            field: 'id',
            headerName: 'Proposta',
            flex: 1,
        },
        {
            field: 'value',
            headerName: 'Valor',
            flex: 1,
            render: (row) =>
                new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(row.value),
        },
        {
            field: 'responsible',
            headerName: 'Responsável',
            flex: 1,
            render: (row) =>
                `${row.created_by?.first_name || ''} ${row.created_by?.last_name || ''}`,
        },
        {
            field: 'due_date',
            headerName: 'Data',
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            render: (row) => (
                <Chip
                    label={proposalStatus[row.status]?.label || 'Desconhecido'}
                    sx={{ backgroundColor: proposalStatus[row.status]?.color }}
                />
            ),
        },
    ];

    const [openAddProposal, setOpenAddProposal] = useState(false);
    const [openDetailProposal, setOpenDetailProposal] = useState(false);
    const [selectedProposalId, setSelectedProposalId] = useState(null);

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    useEffect(() => {
        const fetchProposals = async () => {
            setLoadingProposals(true);
            try {
                const response = await leadService.getLeadById(leadId, {
                    params: {
                        expand: 'proposals',
                        fields: 'id,proposals',
                        page: page + 1,
                        limit: rowsPerPage,
                    },
                });
                setData(response.proposals || []);
            } catch (err) {
                console.error('Erro ao buscar contratos');
            } finally {
                setLoadingProposals(false);
            }
        };

        fetchProposals();
    }, [leadId, refresh, page, rowsPerPage]);

    const handleSelect = (id) => {
        setSelected(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(item => item !== id)
                : [...prevSelected, id]
        );
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleRowClick = (contractId) => {
        setSelectedProposalId(contractId);
        setOpenDetailProposal(true);
    };


    return (
        <>
            <Grid container spacing={0}>
                <Grid item xs={12} sx={{ overflow: 'scroll' }}>
                    <Box sx={{ borderRadius: '20px', display: 'flex', flexDirection: 'column' }}>
                        <Grid item spacing={2} alignItems="center" xs={12}>
                            <LeadInfoHeader leadId={leadId} tabValue={2} />
                        </Grid>
                    </Box>

                    <Grid container xs={12} >
                        <Grid item xs={12} >
                            <TableHeader
                                title={"Total"}
                                totalItems={totalRows}
                                objNameNumberReference={"Propostas"}
                                buttonLabel="Criar"
                                onButtonClick={() => console.log('Go to create proposal')}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', }} >
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
                                    edit: (row) => router.push(`/apps/leads/${row.id}/edit`),
                                    view: (row) => router.push(`/apps/leads/${row.id}/view`),

                                }}
                            />

                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </>
    );
};

export default LeadsProposalListPage;
