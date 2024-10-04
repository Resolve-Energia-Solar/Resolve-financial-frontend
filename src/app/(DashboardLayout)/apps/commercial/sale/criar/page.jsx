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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    HourglassEmpty as HourglassEmptyIcon,
    Cancel as CancelIcon,
    Add,
    AddBox,
    AddBoxTwoTone,
    AddBoxRounded,
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from "@/app/components/container/PageContainer";
import { supabase } from "@/utils/supabaseClient";
import saleService from "@/services/saleService";

const getStatusChip = (status) => {
    switch (status) {
        case 'F':
            return <Chip label="Finalizado" color="success" icon={<CheckCircleIcon />} />;
        case 'EA':
            return <Chip label="Em Andamento" color="primary" icon={<HourglassEmptyIcon />} />;
        case 'C':
            return <Chip label="Cancelado" color="error" icon={<CancelIcon />} />;
        case 'D':
            return <Chip label="Distrato" color="error" icon={<CancelIcon />} />;
        default:
            return <Chip label={status} />;
    }
};

const SaleList = () => {
    const [salesList, setSalesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState(null);
    const router = useRouter(); // Inicializa o roteador

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = await saleService.getSales();
                setSalesList(data.results);
            } catch (err) {
                setError('Erro ao carregar Vendas');
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    const handleEditClick = (id) => {
        // Redireciona para a URL de edição com o id dinâmico
        router.push(`/apps/commercial/sale/${id}/editar`);
    };

    const handleDeleteClick = (id) => {
        setSaleToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSaleToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            // await saleService.deleteSale(saleToDelete);
            setSalesList(salesList.filter((item) => item.id !== saleToDelete));
            console.log('Venda excluída com sucesso');
        } catch (err) {
            setError('Erro ao excluir a venda');
            console.error('Erro ao excluir a venda:', err);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <PageContainer title="Vendas" description="Lista de Vendas">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Vendas
                    </Typography>
                    <Button variant="outlined" startIcon={<AddBoxRounded />} sx={{marginTop:1,marginBottom:2}}>
                    Adicionar Venda
                    </Button>
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
                                            <TableCell>{item.customer.complete_name}</TableCell>
                                            <TableCell>{item.contract_number}</TableCell>
                                            <TableCell>{Number(item.total_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>{item.is_sale ? 'Sim' : 'Não'}</TableCell>
                                            <TableCell>{new Date(item.signature_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{getStatusChip(item.status)}</TableCell>
                                            <TableCell>{new Date(item.document_completion_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{item.branch.name}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Editar">
                                                    <IconButton 
                                                        color="primary" 
                                                        size="small" 
                                                        onClick={() => handleEditClick(item.id)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton 
                                                        color="error" 
                                                        size="small" 
                                                        onClick={() => handleDeleteClick(item.id)}
                                                    >
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

            {/* Modal de confirmação de exclusão */}
            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza de que deseja excluir esta venda? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default SaleList;
