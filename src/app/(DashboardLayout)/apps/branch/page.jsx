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
import branchService from "@/services/branchService";

const BranchList = () => {
    const [branchesList, setBranchesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await branchService.getBranches(); // Método para obter as Franquias
                setBranchesList(data.results);
            } catch (err) {
                setError('Erro ao carregar Franquias');
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    const handleCreateClick = () => {
        router.push('/apps/branch/create'); // Rota para criar nova filial
    };

    const handleEditClick = (id) => {
        router.push(`/apps/branch/${id}/update`); // Rota para editar filial
    };

    const handleDeleteClick = (id) => {
        setBranchToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setBranchToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            // await branchService.deleteBranch(branchToDelete); // Descomente para excluir a filial
            setBranchesList(branchesList.filter((item) => item.id !== branchToDelete));
            console.log('Filial excluída com sucesso');
        } catch (err) {
            setError('Erro ao excluir a filial');
            console.error('Erro ao excluir a filial:', err);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <PageContainer title="Franquias" description="Lista de Franquias">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Franquias
                    </Typography>
                    <Button variant="outlined" startIcon={<AddBoxRounded />} sx={{ marginTop: 1, marginBottom: 2 }} onClick={handleCreateClick}>
                        Adicionar Franquias
                    </Button>
                    {loading ? (
                        <Typography>Carregando...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer component={Paper} elevation={3}>
                            <Table aria-label="branches table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Endereço</TableCell>
                                        <TableCell>Proprietários</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {branchesList.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                {item.address.street}, {item.address.number} - {item.address.neighborhood}, {item.address.city} - {item.address.state}, {item.address.zip_code}
                                            </TableCell>
                                            <TableCell>
                                                {item.owners.length > 0 ? item.owners.map(owner => (
                                                    <div key={owner.id}>
                                                        {owner.complete_name} ({owner.email})
                                                    </div>
                                                )) : 'Nenhum proprietário'}
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
                        Tem certeza de que deseja excluir esta filial? Esta ação não pode ser desfeita.
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

export default BranchList;