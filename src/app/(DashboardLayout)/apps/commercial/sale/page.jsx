'use client';
import React, { useState, useEffect } from "react";
import {
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    Chip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from "@/app/components/container/PageContainer";
import { supabase } from "@/utils/supabaseClient";

const getStatusChip = (status) => {
    switch (status) {
        case 'Finalizar':
            return <Chip label={status} color="success" icon={<CheckCircleIcon />} />;
        case 'Em Andamento':
            return <Chip label={status} color="primary" icon={<HourglassEmptyIcon />} />;
        case 'Cancelada':
            return <Chip label={status} color="error" icon={<CancelIcon />} />;
        default:
            return <Chip label={status} />;
    }
};

const SaleList = () => {
    const [salesList, setSalesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const { data: salesData, error: salesError } = await supabase
                    .from('sales')
                    .select('*, branches(name),customers(name)')

                if (salesError) throw salesError;

                setSalesList(salesData);
            } catch (error) {
                setError('Erro ao buscar vendas.');
                console.error('Erro ao buscar vendas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    return (
        <PageContainer title="Vendas" description="Lista de Vendas">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Vendas
                    </Typography>
                    {loading ? (
                        <Typography>Carregando...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer component={Paper} elevation={3}>
                            <Table aria-label="sales table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nome contratante</TableCell>
                                        <TableCell>Número do Contrato</TableCell>
                                        <TableCell>Data do Contrato</TableCell>
                                        <TableCell>Valor Total (R$)</TableCell>
                                        <TableCell>Venda</TableCell>
                                        <TableCell>Data de Assinatura</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Data de Conclusão</TableCell>
                                        <TableCell>Unidade</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salesList.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.customers?.name}</TableCell>
                                            <TableCell>{item.contract_number}</TableCell>

                                            <TableCell>{new Date(item.contract_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{Number(item.total_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>
                                                {item.is_sale ? 'Sim' : 'Não'}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(item.signature_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusChip(item.status)}
                                            </TableCell>
                                            <TableCell>{new Date(item.document_completion_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{item.branches.name}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Editar">
                                                    <IconButton color="primary" size="small">
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton color="error" size="small">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </BlankCard>
        </PageContainer>
    );
};

export default SaleList;
