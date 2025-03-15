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
import LeadsViewProposal from '../Leads-proposal/View-Proposal';



const SalesListPage = ({ leadId = null }) => {
    const router = useRouter();
    // const [data, setData] = useState([]);
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
            field: 'name',
            headerName: 'Projeto',
            flex: 1,
            // render: (row) =>
            //     row?.products.length > 0
            //         ? row.products.map((product) => product.name).join(', ')
            //         : 'Nenhum produto vinculado',
        },
        {
            field: 'type',
            headerName: 'Tipo de projeto',
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
            field: 'seller',
            headerName: 'Vendedor Responsável',
            flex: 1,
            // render: (row) =>
            //     `${row.created_by?.first_name || ''} ${row.created_by?.last_name || ''}`,
        },
        {
            field: 'sdr',
            headerName: 'SDR',
            flex: 1,
        },
        {
            field: 'franchise',
            headerName: 'Franquia',
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
                const response = await leadService.getLeadById(leadId, {
                    params: {
                        expand: 'sale',
                        fields: 'id,sale',
                        page: page + 1,
                        limit: rowsPerPage,
                    },
                });
                setData(response.sales || []);
                setTotalRows(response.sale?.length || 0);

            } catch (err) {
                console.error('Erro ao buscar vendas');
            } finally {
                setLoadingSales(false);
            }
        };

        fetchSales();
    }, [leadId, refresh, page, rowsPerPage]);

    const data = [
        {
            id: 1,
            name: 'Supermercado Matheus',
            status: 'Assinado',
            projects: [
                { id: 101, name: 'Projeto A', type: 'Comercial', seller: 'Beatriz Silva', sdr: '123', franchise: 'Belém - Centro' },
                { id: 102, name: 'Projeto B', type: 'Residencial', seller: 'Carlos Souza', sdr: '1246', franchise: 'Belém - Centro' },
            ],
        },
        {
            id: 2,
            name: 'Supermercado Líder',
            status: 'Pendente',
            projects: [
                { id: 103, name: 'Projeto A', type: 'Comercial', seller: 'Yasmin de Albuquerque', sdr: '189', franchise: 'Belém - Centro' },
            ],
        },
        {
            id: 3,
            name: 'Supermercado Formosa',
            status: 'Pendente',
            projects: [],
        },
    ]; // adds mock data



    return (
        <>
            <Grid container spacing={0} sx={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', border: "1px solid", borderColor: "#EAEAEA", p: 3 }} >
                <Grid item xs={12} sx={{ overflow: 'scroll' }}>
                    <Grid item xs={12} sx={{
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'nowrap'
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
                            Contratos do cliente
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
                            >
                                <DialogContent>
                                    <LeadsViewProposal
                                        leadId={leadId}
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
