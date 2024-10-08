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
import departmentService from "@/services/departmentService";

const DepartmentList = () => {
    const [departmentList, setDepartmentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await departmentService.getDepartment();
                console.log(data);
                setDepartmentList(data.results);
            } catch (err) {
                setError('Erro ao carregar departamentos');
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    const handleCreateClick = () => {
        router.push('/apps/department/create');
    };

    const handleEditClick = (id) => {
        router.push(`/apps/department/${id}/update`);
    };

    const handleDeleteClick = (id) => {
        setDepartmentToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setDepartmentToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await departmentService.deleteDepartment(departmentToDelete);
            setDepartmentList(departmentList.filter((item) => item.id !== departmentToDelete));
            console.log('Departamento excluído com sucesso');
        } catch (err) {
            setError('Erro ao excluir o departamento');
            console.error('Erro ao excluir o departamento', err);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <PageContainer title="Departamentos" description="Lista de Departamentos">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Departamentos
                    </Typography>
                    <Button variant="outlined" startIcon={<AddBoxRounded />} sx={{marginTop:1,marginBottom:2}} onClick={handleCreateClick}>
                        Criar Departamento
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
                                        <TableCell>Email</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {departmentList.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.email}</TableCell>
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
                        Tem certeza de que deseja excluir este departamento? Esta ação não pode ser desfeita.
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

export default DepartmentList;
