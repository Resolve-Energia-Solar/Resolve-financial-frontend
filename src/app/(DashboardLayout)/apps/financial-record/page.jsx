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
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    AddBoxRounded,
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from "@/app/components/container/PageContainer";
import financialRecordService from "@/services/financialRecordService";

const financialRecordList = () => {
    const [financialRecordList, setFinancialRecordList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [financialRecordToDelete, setFinancialRecordToDelete] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchFinancialRecords = async () => {
            try {
                const data = await financialRecordService.getFinancialRecordList();
                console.log(data);
                setFinancialRecordList(data.results);
            } catch (err) {
                setError('Erro ao carregar Contas a Receber/Pagar');
            } finally {
                setLoading(false);
            }
        };

        fetchFinancialRecords();
    }, []);

    const handleCreateClick = () => {
        router.push('/apps/financial-record/create');
    };

    const handleEditClick = (id) => {
        router.push(`/apps/financial-record/${id}/update`);
    };

    const handleDeleteClick = (id) => {
        setFinancialRecordToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setFinancialRecordToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await financialRecordService.deleteFinancialRecord(financialRecordToDelete);
            setFinancialRecordList(financialRecordList.filter((item) => item.id !== financialRecordToDelete));
            console.log('Conta a Receber/Pagar excluído com sucesso');
        } catch (err) {
            setError('Erro ao excluir o Conta a Receber/Pagar');
            console.error('Erro ao excluir o Conta a Receber/Pagar', err);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <PageContainer title="Contas a Receber/Pagar" description="Lista de Contas a Receber/Pagar">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Contas a Receber/Pagar
                    </Typography>
                    <Button variant="outlined" startIcon={<AddBoxRounded />} sx={{marginTop:1,marginBottom:2}} onClick={handleCreateClick}>
                        Criar Conta a Receber/Pagar
                    </Button>
                    {loading ? (
                        <Typography>Carregando...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer component={Paper} elevation={3}>
                            <Table aria-label="table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Protocolo</TableCell>
                                        <TableCell>Valor</TableCell>
                                        <TableCell>Data de Vencimento</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {financialRecordList.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.protocol}</TableCell>
                                            <TableCell>{item.value}</TableCell>
                                            <TableCell>{item.due_date}</TableCell>
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


            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza de que deseja excluir este Conta a Receber/Pagar? Esta ação não pode ser desfeita.
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

export default financialRecordList;
