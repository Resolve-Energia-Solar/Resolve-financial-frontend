'use client';
import React, { useState, useEffect } from "react";
import {
    CardContent,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from "@/app/components/container/PageContainer";

// Função para gerar vendas mockadas
const generateMockSales = (num) => {
    const statuses = ['Finalizar', 'Em Andamento', 'Cancelada'];
    const branches = ['Castanhal', 'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba'];
    const sales = [];

    for (let i = 1; i <= num; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomBranch = branches[Math.floor(Math.random() * branches.length)];
        const randomValue = (Math.random() * 50000 + 10000).toFixed(2);
        const randomDate = new Date(+(new Date()) - Math.floor(Math.random()*10000000000)).toISOString().split('T')[0];
        const randomCompletionDate = new Date(+(new Date()) + Math.floor(Math.random()*10000000000)).toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0];
        
        sales.push({
            id: i,
            total_value: randomValue,
            contract_number: `RES${String(i).padStart(6, '0')}`,
            contract_date: randomDate,
            signature_date: randomDate,
            is_sale: true,
            status: randomStatus,
            branch_id: {
                id: Math.floor(Math.random() * branches.length) + 1,
                name: randomBranch,
                is_deleted: 0,
                address_id: {
                    zipcode: '66690720'
                }
            },
            document_completion_date: randomCompletionDate
        });
    }

    return sales;
};

const SaleList = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Simular a obtenção de dados (pode ser substituído por uma chamada real)
    useEffect(() => {
        setLoading(true);
        try {
            const mockSales = generateMockSales(50);
            setSales(mockSales);
            setLoading(false);
        } catch (err) {
            setError('Erro ao carregar vendas.');
            setLoading(false);
        }
    }, []);

    // Função para mapear status para cores e ícones
    const getStatusChip = (status) => {
        switch(status) {
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
                                        <TableCell>Número do Contrato</TableCell>
                                        <TableCell>Data do Contrato</TableCell>
                                        <TableCell>Valor Total (R$)</TableCell>
                                        <TableCell>Venda</TableCell>
                                        <TableCell>Data de Assinatura</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Data de Conclusão</TableCell>
                                        <TableCell>Filial</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sales.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.contract_number}</TableCell>
                                            <TableCell>{item.contract_date}</TableCell>
                                            <TableCell>{Number(item.total_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>
                                                {item.is_sale ? 'Sim' : 'Não'}
                                            </TableCell>
                                            <TableCell>{item.signature_date}</TableCell>
                                            <TableCell>
                                                {getStatusChip(item.status)}
                                            </TableCell>
                                            <TableCell>{item.document_completion_date}</TableCell>
                                            <TableCell>{item.branch_id.name}</TableCell>
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
