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
    TablePagination,
    Skeleton,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    AddBoxRounded,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from "@/app/components/container/PageContainer";
import documentTypeService from "@/services/documentTypeService";
import { CheckCircle, Cancel } from '@mui/icons-material';

const DocumentTypeList = () => {
    const [documentTypeList, setDocumentTypeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [documentTypeToDelete, setDocumentTypeToDelete] = useState(null);
    const [page, setPage] = useState(0); // Página atual
    const [rowsPerPage, setRowsPerPage] = useState(10); // Itens por página
    const [totalRows, setTotalRows] = useState(0); // Total de itens
    const router = useRouter();

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            setLoading(true);
            try {
                const params = {
                    page: page + 1, // A API geralmente usa página baseada em 1
                    limit: rowsPerPage,
                };
                const data = await documentTypeService.getDocumentTypes(params); // Assumindo que a API aceita esses parâmetros
                setDocumentTypeList(data.results || []);
                setTotalRows(data.count || 0); // Defina o total de itens retornados pela API
            } catch (err) {
                setError('Erro ao carregar Funções');
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentTypes();
    }, [page, rowsPerPage]);

    const handleCreateClick = () => {
        router.push('/apps/document-types/create');
    };

    const handleEditClick = (id) => {
        router.push(`/apps/document-types/${id}/update`);
    };

    const handleDeleteClick = (id) => {
        setDocumentTypeToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setDocumentTypeToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await documentTypeService.deleteDocumentType(documentTypeToDelete);
            setDocumentTypeList(documentTypeList.filter((item) => item.id !== documentTypeToDelete));
        } catch (err) {
            setError('Erro ao excluir a função');
        } finally {
            handleCloseModal();
        }
    };

    // Controle da paginação
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Resetar para a primeira página ao alterar o número de linhas
    };

    return (
        <PageContainer title="Tipos de Documentos" description="Lista de Tipos de Documentos">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Tipos de Documentos
                    </Typography>
                    <Button variant="outlined" startIcon={<AddBoxRounded />} sx={{ marginTop: 1, marginBottom: 2 }} onClick={handleCreateClick}>
                        Criar Tipo
                    </Button>
                    {loading ? (
                        <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                            <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                            <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                            <TableCell><Skeleton variant="text" width="50%" /></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(new Array(5)).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton variant="rectangular" height={20} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} /></TableCell>
                                <TableCell><Skeleton variant="rectangular" height={20} /></TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <>
                            <TableContainer component={Paper} elevation={3}>
                                <Table aria-label="table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nome do Tipo</TableCell>
                                            <TableCell align="center">Reutilizável</TableCell>
                                            <TableCell align="center">Obrigatório</TableCell>
                                            <TableCell>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {documentTypeList.map((item) => (
                                            <TableRow key={item.id} hover>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell align="center">
                                                {item.reusable ? (
                                                    <Tooltip title="Reutilizável">
                                                        <CheckCircle color="success" />
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Não Reutilizável">
                                                        <Cancel color="error" />
                                                    </Tooltip>
                                                )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {item.required ? (
                                                        <Tooltip title="Obrigatório">
                                                            <CheckCircle color="success" />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Não Obrigatório">
                                                            <Cancel color="error" />
                                                        </Tooltip>
                                                    )}
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
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={totalRows}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </CardContent>
            </BlankCard>

            {/* Modal de confirmação de exclusão */}
            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza de que deseja excluir este tipo de documento? Esta ação não pode ser desfeita.
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

export default DocumentTypeList;
