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
    DialogContent,
} from '@mui/material';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import leadService from '@/services/leadService';
import TableHeader from '@/app/components/kanban/Leads/components/TableHeader'
import TableComponent from '@/app/components/kanban/Leads/components/TableComponent'
import formatPhoneNumber from '@/utils/formatPhoneNumber';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import AddSalePage from './Add-Sale';
import ExpandableTableComponent from '../components/ExpandableTableComponent';
import ExpandableListComponent from '../components/ExpandableTableComponent';
import LeadsViewSale from './Projects/View-Project';



const SalesListPage = ({ customer = null, lead }) => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loadingSales, setLoadingSales] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);


    const saleStatus = {
        "C": { label: "Canelada", color: "#FFEBEE" },
        "D": { label: "Destrato", color: "#FFCDD2" },
        "F": { label: "Finalizada", color: "#E8F5E9" },
        "P": { label: "Pendente", color: "#FFF8E1" },
        "E": { label: "Em Andamento", color: "#E3F2FD" },
    };

    const columns = [
        {
            field: 'customer',
            headerName: 'Nome do cliente',
            flex: 1,
            render: (row) =>
                `${row.complete_name || ''}`,
        },
        {
            field: 'contract_number',
            headerName: 'Número de Contrato',
            flex: 1,
        },
        // {
        //     field: 'value',
        //     headerName: 'Valor',
        //     flex: 1,
        //     render: (row) =>
        //         new Intl.NumberFormat('pt-BR', {
        //             style: 'currency',
        //             currency: 'BRL',
        //         }).format(row.value),
        // },
        {
            field: 'total_value',
            headerName: 'Valor',
            flex: 1,
            render: (row) =>
                new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(row.total_value),
        },
        {
            field: 'seller',
            headerName: 'Vendedor',
            flex: 1,
            render: (row) =>
                `${row.complete_name || ''}`,
        },
        {
            field: 'signature_status',
            headerName: 'Status da assinatura',
            flex: 1,
        },
        // {
        //     field: 'status',
        //     headerName: 'Status',
        //     flex: 1,
        //     render: (row) => (
        //         <Chip
        //             label={saleStatus[row.status]?.label || 'Desconhecido'}
        //             sx={{ backgroundColor: saleStatus[row.status]?.color }}
        //         />
        //     ),
        // },
    ];

    const [openAddSale, setOpenAddSale] = useState(false);
    const [openEditSale, setOpenEditSale] = useState(false);
    const [openDetailSale, setOpenDetailSale] = useState(false);
    const [selectedSaleId, setSelectedSaleId] = useState(null);


    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    useEffect(() => {
        const fetchSales = async () => {
            setLoadingSales(true);
            try {
                const response = await saleService.index({
                    customer__in: customer.id,
                })
                console.log('response: ',response)
                setData(response.results.results || []);
                setTotalRows(response.sale?.length || 0);

            } catch (err) {
                console.error('Erro ao buscar vendas');
            } finally {
                setLoadingSales(false);
            }
        };

        fetchSales();
    }, [lead, refresh, page, rowsPerPage]);

    console.log('data: ', data)

    return (
        <>
            <Grid container spacing={0} sx={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', border: "1px solid", borderColor: "#EAEAEA", p: 3 }} >
                <Grid item xs={12} sx={{ overflow: 'scroll' }}>

                    <Grid item xs={12} sx={{
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                        px: 1.5,
                    }}>

                        <Typography
                            sx={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#000000",
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            Vendas do cliente
                        </Typography>

                        <TableHeader
                            buttonLabel="Criar"
                            onButtonClick={() => setOpenAddSale(true)}
                        />

                    </Grid>

                    <Grid container xs={12} >


                        <Grid item xs={12} sx={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', border: "1px solid", borderColor: "#EAEAEA", }} >
                            <ExpandableListComponent
                                columns={columns}
                                data={data}
                                totalRows={totalRows}
                                loading={loadingSales}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={(newPage) => setPage(newPage)}
                                onRowsPerPageChange={(newRows) => {
                                    setRowsPerPage(newRows);
                                    setPage(0);
                                }}
                                actions={{
                                    edit: (row) => {
                                        setSelectedSaleId(row.id);
                                        setOpenEditSale(true);
                                    },
                                    view: (row) => {
                                        setSelectedSaleId(row.id);
                                        setOpenDetailSale(true);
                                    },
                                }}
                            />

                            <Dialog
                                open={openAddSale}
                                onClose={() => setOpenAddSale(false)}
                                maxWidth="lg"
                                fullWidth
                            >
                                <DialogContent>
                                    {/* <AddSalePage 
                                        leadId={leadId} 
                                        onClose={() => setOpenAddSale(false)} 
                                        onRefresh={handleRefresh} /> */}
                                </DialogContent>
                            </Dialog>

                            <Dialog
                                open={openDetailSale}
                                onClose={() => setOpenDetailSale(false)}
                                maxWidth="lg"
                                fullWidth
                                PaperProps={{
                                    sx: {
                                        borderRadius: "20px",
                                    },
                                }}
                            >
                                <DialogContent>
                                    <LeadsViewProposal
                                        leadId={lead?.id}
                                        proposalId={selectedSaleId}
                                        onClose={() => setOpenDetailSale(false)}
                                        onRefresh={handleRefresh}
                                    />
                                </DialogContent>
                            </Dialog>

                        </Grid>

                    </Grid>
                </Grid>
            </Grid>

        </>
    );
};

export default SalesListPage;
