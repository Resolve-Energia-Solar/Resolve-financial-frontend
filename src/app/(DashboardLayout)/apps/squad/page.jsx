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
    AddBoxRounded,
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from "@/app/components/container/PageContainer";
import squadService from "@/services/squadService";

const SquadList = () => {
    const [squadList, setSquadList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [squadToDelete, setSquadToDelete] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchSquads = async () => {
            try {
                const data = await squadService.getSquads();
                console.log(data);
                setSquadList(data.results);
            } catch (err) {
                setError('Erro ao carregar Squads');
            } finally {
                setLoading(false);
            }
        };

        fetchSquads();
    }, []);

    const handleCreateClick = () => {
        router.push('/apps/squad/create');
    };

    const handleEditClick = (id) => {
        router.push(`/apps/squad/${id}/update`);
    };

    const handleDeleteClick = (id) => {
        setSquadToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSquadToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await squadService.deleteSquad(squadToDelete);
            setSquadList(squadList.filter((item) => item.id !== squadToDelete));
            console.log('Squad excluído com sucesso');
        } catch (err) {
            setError('Erro ao excluir o Squad');
            console.error('Erro ao excluir o Squad', err);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <PageContainer title="Squads" description="Lista de Squads">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Squads
                    </Typography>
                    <Button variant="outlined" startIcon={<AddBoxRounded />} sx={{ marginTop: 1, marginBottom: 2 }} onClick={handleCreateClick}>
                        Criar Squad
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
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Filial</TableCell>
                                        <TableCell>Gerente</TableCell>
                                        <TableCell>Endereço</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {squadList.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.branch?.name || 'N/A'}</TableCell>
                                            <TableCell>{item.manager?.complete_name || 'N/A'}</TableCell>
                                            <TableCell>
                                                {`${item.branch?.address?.city || 'N/A'}, ${item.branch?.address?.state || 'N/A'}`}
                                            </TableCell>
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
                        Tem certeza de que deseja excluir este Squad? Esta ação não pode ser desfeita.
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

export default SquadList;
