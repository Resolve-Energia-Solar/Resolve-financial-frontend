'use client';
import React, { useState, useEffect, useContext } from "react";
import {
    Box,
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
import { FilterContext } from "@/context/FilterContext";
import { useRouter } from 'next/navigation';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from "@/app/components/container/PageContainer";
import financialRecordService from "@/services/financialRecordService";
import FinancialRecordDetailDrawer from "@/app/components/apps/financial-record/detailDrawer";
import GenericFilterDrawer from "@/app/components/filters/GenericFilterDrawer";
import AutoCompleteBeneficiary from '@/app/components/apps/financial-record/beneficiaryInput';
import AutoCompleteDepartment from '@/app/components/apps/financial-record/departmentInput';
import AutoCompleteCategory from '@/app/components/apps/financial-record/categoryInput';

const financialRecordList = () => {
    const router = useRouter();
    const { filters, setFilters } = useContext(FilterContext);

    const [financialRecordList, setFinancialRecordList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [financialRecordToDelete, setFinancialRecordToDelete] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchFinancialRecords = async () => {
            setLoading(true);
            try {
                // Passe os filtros para a requisição
                const data = await financialRecordService.getFinancialRecordList(filters);
                setFinancialRecordList(data.results);
            } catch (err) {
                setError('Erro ao carregar Contas a Receber/Pagar');
            } finally {
                setLoading(false);
            }
        };
        fetchFinancialRecords();
    }, [filters]);

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

    const getStatusLabel = (status) => {
        switch (status) {
            case 'S':
                return 'Solicitada';
            case 'E':
                return 'Em Andamento';
            case 'P':
                return 'Paga';
            case 'C':
                return 'Cancelada';
            default:
                return 'Desconhecido';
        }
    };

    const handleRowClick = (record) => {
        setSelectedRecord(record);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedRecord(null);
    };

    const financialRecordFilterConfig = [
        {
          key: 'client_supplier_code',
          label: 'Cliente/Fornecedor (Omie)',
          type: 'custom',
          customComponent: AutoCompleteBeneficiary,
          customTransform: (value) =>
            value && typeof value === 'object' ? value.codigo_cliente : value,
        },
        {
          key: 'department_code__icontains',
          label: 'Departamento Causador (Omie)',
          type: 'custom',
          customComponent: AutoCompleteDepartment,
          customTransform: (value) =>
            value && typeof value === 'object' ? value.codigo : value,
        },
        {
          key: 'category_code__icontains',
          label: 'Categoria (Omie)',
          type: 'custom',
          customComponent: AutoCompleteCategory,
          customTransform: (value) =>
            value && typeof value === 'object' ? value.codigo : value,
        },      
        {
            key: "integration_code",
            label: "Código de Integração",
            type: "async-autocomplete",
            endpoint: "/api/financial-record/",
            queryParam: "integration_code__exact",
            extraParams: {},
            mapResponse: (data) => data.results.map(financialRecord => ({
                label: financialRecord.protocol,
                value: financialRecord.protocol
            }))
        },
        { key: "integration_code__in", label: "Código de Integração (Lista)", type: "multiselect", options: [] },
        { key: "protocol__icontains", label: "Protocolo (Contém)", type: "text" },
        { key: "protocol__in", label: "Protocolo (Lista)", type: "multiselect", options: [] },
        { key: "status__in", label: "Status (Lista)", type: "multiselect", options: [] },
        {
            key: "value_range",
            label: "Valor",
            type: "number-range",
            subkeys: { min: "value__gte", max: "value__lte" }
        },
        { key: "due_date__range", label: "Data de Vencimento (Entre)", type: "range", inputType: "date" },
        { key: "service_date__range", label: "Data de Serviço (Entre)", type: "range", inputType: "date" },
        { key: "requesting_department", label: "Departamento Solicitante", type: "text" },
        { key: "department_code__icontains", label: "Código do Departamento (Contém)", type: "text" },
        { key: "department_code__in", label: "Código do Departamento (Lista)", type: "multiselect", options: [] },
        { key: "category_code__icontains", label: "Código da Categoria (Contém)", type: "text" },
        { key: "category_code__in", label: "Código da Categoria (Lista)", type: "multiselect", options: [] },
        { key: "invoice_number__icontains", label: "Número da Fatura (Contém)", type: "text" },
        { key: "invoice_number__in", label: "Número da Fatura (Lista)", type: "multiselect", options: [] },
        { key: "notes__icontains", label: "Notas (Contém)", type: "text" },
        { key: "notes__in", label: "Notas (Lista)", type: "multiselect", options: [] },
        {
            key: "requester",
            label: "Solicitante",
            type: "async-autocomplete",
            endpoint: "/api/users/",
            queryParam: "complete_name__icontains",
            extraParams: {},
            mapResponse: (data) => data.results.map(user => ({
                label: user.complete_name,
                value: user.id
            }))
        },
        { key: "created_at__range", label: "Criado em (Entre)", type: "range", inputType: "date" },
        {
            key: "responsible",
            label: "Responsável",
            type: "async-autocomplete",
            endpoint: "/api/users/",
            queryParam: "complete_name__icontains",
            extraParams: {},
            mapResponse: (data) => data.results.map(user => ({
                label: user.complete_name,
                value: user.id
            }))
        }, {
            key: "responsible_status__in", label: "Status do Responsável (Lista)", type: "multiselect", options: [
                { label: "Aprovada", value: "A" },
                { label: "Pendente", value: "P" },
                { label: "Reprovada", value: "R" }
            ]
        },
        { key: "responsible_response_date__range", label: "Data de Resposta (Entre)", type: "range", inputType: "date" },
        { key: "responsible_notes__icontains", label: "Notas do Responsável (Contém)", type: "text" },
        { key: "responsible_notes__in", label: "Notas do Responsável (Lista)", type: "multiselect", options: [] },
        {
            key: "payment_status__in", label: "Status de Pagamento (Lista)", type: "multiselect", options: [
                { label: "Paga", value: "PG" },
                { label: "Pendente", value: "P" },
                { label: "Cancelada", value: "C" }
            ]
        },
        { key: "paid_at__range", label: "Pago em (Entre)", type: "range", inputType: "date" },
    ];

    return (
        <PageContainer title="Contas a Receber/Pagar" description="Lista de Contas a Receber/Pagar">
            <BlankCard>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Lista de Contas a Receber/Pagar
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddBoxRounded />}
                            sx={{ mt: 1, mb: 2 }}
                            onClick={handleCreateClick}
                        >
                            Criar Conta a Receber/Pagar
                        </Button>

                        <Button
                            variant="outlined"
                            sx={{ mt: 1, mb: 2 }}
                            onClick={() => setFilterDrawerOpen(true)}
                        >
                            Abrir Filtros
                        </Button>
                    </Box>

                    <GenericFilterDrawer
                        filters={financialRecordFilterConfig}
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
                                        <TableCell>Protocolo</TableCell>
                                        <TableCell>Descrição</TableCell>
                                        <TableCell>Beneficiário/Pagador</TableCell>
                                        <TableCell>Valor</TableCell>
                                        <TableCell>Data de Vencimento</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {financialRecordList.map((item) => (
                                        <TableRow key={item.id} hover onClick={() => handleRowClick(item)}>
                                            <TableCell>{item.protocol}</TableCell>
                                            <TableCell>
                                                {item.notes.length > 35 ? `${item.notes.substring(0, 35)}...` : item.notes}
                                            </TableCell>
                                            <TableCell>{item.client_supplier_name}</TableCell>
                                            <TableCell>
                                                R$ {parseFloat(item.value).toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(item.due_date).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>{getStatusLabel(item.status)}</TableCell>
                                            <TableCell>
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        color="primary"
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditClick(item.id);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(item.id);
                                                        }}
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

            <FinancialRecordDetailDrawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                record={selectedRecord}
            />
        </PageContainer>
    );
};

export default financialRecordList;
