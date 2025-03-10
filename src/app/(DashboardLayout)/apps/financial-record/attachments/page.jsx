'use client';
import React, { useState, useEffect, useContext } from "react";
import { useSelector } from 'react-redux';
import {
    Box,
    CardContent,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import { InsertDriveFile } from '@mui/icons-material';
import { useRouter } from "next/navigation";
import { FilterContext } from "@/context/FilterContext";
import BlankCard from "@/app/components/shared/BlankCard";
import PageContainer from "@/app/components/container/PageContainer";
import attachmentService from "@/services/attachmentService";
import financialRecordService from "@/services/financialRecordService";
import GenericFilterDrawer from "@/app/components/filters/GenericFilterDrawer";
import getContentType from "@/utils/getContentType";
import { useSnackbar } from 'notistack';
import { formatDate } from "@/utils/dateUtils";

const attachmentList = () => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { filters, setFilters } = useContext(FilterContext);
    const [attachmentList, setAttachmentList] = useState([]);
    const [protocolMap, setProtocolMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState(null);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [rowsPerPage] = useState(20);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const fetchAttachments = async () => {
            try {
                setLoading(true);
                const contentTypeId = await getContentType('financial', 'financialrecord');
                const data = await attachmentService.getAttachments(
                    Number(rowsPerPage),
                    page + 1,
                    contentTypeId,
                    filters
                );
                setAttachmentList(data.results);
                setTotalRows(data.count);
            } catch (err) {
                setError("Erro ao carregar anexos");
            } finally {
                setLoading(false);
            }
        };

        fetchAttachments();
    }, [filters, rowsPerPage, page]);

    useEffect(() => {
        const fetchProtocols = async () => {
            const newMap = { ...protocolMap };
            for (const item of attachmentList) {
                if (item.object_id && !newMap[item.object_id]) {
                    try {
                        const record = await financialRecordService.getFinancialRecordById(item.object_id);
                        newMap[item.object_id] = record.protocol;
                    } catch (error) {
                        console.error("Erro ao buscar protocolo para object_id", item.object_id, error);
                        newMap[item.object_id] = '-';
                    }
                }
            }
            setProtocolMap(newMap);
        };

        if (attachmentList.length > 0) {
            fetchProtocols();
        }
    }, [attachmentList]);

    const handleDeleteClick = (id) => {
        setAttachmentToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setAttachmentToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await attachmentService.deleteAttachment(attachmentToDelete);
            setAttachmentList(attachmentList.filter((item) => item.id !== attachmentToDelete));
            console.log('Anexo excluído com sucesso');
        } catch (err) {
            setError('Erro ao excluir o anexo');
            console.error('Erro ao excluir o anexo', err);
        } finally {
            handleCloseModal();
        }
    };

    const handleRowClick = (attachment) => {
        window.open(attachment.file, '_blank');
    };

    const attachmentFilterConfig = [
        {
            key: 'object_id',
            label: 'Solicitação',
            type: 'async-multiselect',
            endpoint: '/api/financial-records/',
            queryParam: 'protocol__icontains',
            mapResponse: (data) =>
                data.results.map((record) => ({
                    label: record.protocol,
                    value: record.id,
                })),
        },
        {
            key: 'document_type__in',
            label: 'Tipo de Documento',
            type: 'async-multiselect',
            endpoint: '/api/document-types/',
            extraParams: { app_label__in: 'financial' },
            queryParam: 'name_icontains',
            mapResponse: (data) =>
                data.results.map((type) => ({
                    label: type.name,
                    value: type.id,
                })),
        },
        /*
        {
            key: 'document_subtype__in',
            label: 'Subtipo de Documento',
            type: 'async-multiselect',
            endpoint: '/api/document-subtypes/',
            queryParam: 'name_icontains',
            mapResponse: (data) =>
                data.results.map((subtype) => ({
                    label: subtype.name,
                    value: subtype.id,
                })),
        }, */
        {
            key: 'description__icontains',
            label: 'Descrição',
            type: 'text'
        },
        {
            key: 'created_at__range',
            label: 'Criado em',
            type: 'range',
            inputType: 'date'
        }
    ];

    const user = useSelector((state) => state.user?.user);
    const userPermissions = user?.permissions || user?.user_permissions || [];

    useEffect(() => {
        if (!userPermissions.includes("core.add_attachment")) {
            enqueueSnackbar('Você não tem permissão para acessar essa página!', { variant: 'error' });
            router.push('commercial/sale');
        }
    }, [userPermissions, router]);

    return (
        <PageContainer title="Anexos" description="Lista de Anexos">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Anexos
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Button
                            variant="outlined"
                            sx={{ mt: 1, mb: 2 }}
                            onClick={() => setFilterDrawerOpen(true)}
                        >
                            Abrir Filtros
                        </Button>
                    </Box>

                    <GenericFilterDrawer
                        filters={attachmentFilterConfig}
                        initialValues={filters}
                        open={filterDrawerOpen}
                        onClose={() => setFilterDrawerOpen(false)}
                        onApply={(newFilters) => setFilters(newFilters)}
                    />

                    {loading ? (
                        <Typography>Carregando...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer component={Paper} elevation={3}>
                            <Table aria-label="table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Arquivo</TableCell>
                                        <TableCell>Solicitação</TableCell>
                                        <TableCell>Tipo</TableCell>
                                        <TableCell>Criado em</TableCell>
                                        {/* <TableCell>Usuário</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attachmentList.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            hover
                                            onClick={() => handleRowClick(item)}
                                        >
                                            <TableCell>
                                                <Link href={item.file}>
                                                    <InsertDriveFile fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                                    {item.file && item.file.split('?')[0].split('/').pop()}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {item.object_id
                                                    ? (protocolMap[item.object_id] || "Carregando...")
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {item.document_type?.name}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(item.created_at)}
                                            </TableCell>
                                            {/* <TableCell>{item.created_by}</TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    <TablePagination
                        rowsPerPageOptions={[20]}
                        component="div"
                        count={totalRows}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        labelRowsPerPage="Linhas por página"
                    />
                </CardContent>
            </BlankCard>

            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem certeza de que deseja excluir este Anexo? Esta ação não pode ser desfeita.
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

export default attachmentList;
