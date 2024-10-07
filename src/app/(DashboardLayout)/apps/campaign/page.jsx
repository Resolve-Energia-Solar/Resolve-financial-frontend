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
    AddBoxRounded,
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from "@/app/components/container/PageContainer";
import campaignService from "@/services/campaignService"; 
import { ca } from "date-fns/locale";

const CampaignList = () => {
    const [campaignsList, setCampaignsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await campaignService.getCampaigns();
                setCampaignsList(data.results);
            } catch (err) {
                setError('Erro ao carregar campanhas');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const handleCreateClick = () => {
        router.push('/apps/campaign/create');
    };

    const handleEditClick = (id) => {
        router.push(`/apps/campaign/${id}/update`);
    };

    const handleDeleteClick = (id) => {
        setCampaignToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setCampaignToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await campaignService.deleteCampaign(campaignToDelete);
            setCampaignsList(campaignsList.filter((item) => item.id !== campaignToDelete));
            console.log('Campanha excluída com sucesso');
        } catch (err) {
            setError('Erro ao excluir a campanha');
            console.error('Erro ao excluir a campanha:', err);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <PageContainer title="Campanhas" description="Lista de Campanhas">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Campanhas
                    </Typography>
                    <Button variant="outlined" startIcon={<AddBoxRounded />} sx={{ marginTop: 1, marginBottom: 2 }} onClick={handleCreateClick}>
                        Adicionar Campanha
                    </Button>
                    {loading ? (
                        <Typography>Carregando...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer component={Paper} elevation={3}>
                            <Table aria-label="campaigns table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nome da Campanha</TableCell>
                                        <TableCell>Data de Início</TableCell>
                                        <TableCell>Data de Término</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {campaignsList.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{new Date(item.start_datetime).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(item.end_datetime).toLocaleDateString()}</TableCell>
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
                        Tem certeza de que deseja excluir esta campanha? Esta ação não pode ser desfeita.
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

export default CampaignList;
