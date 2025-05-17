import { useEffect, useState, useCallback } from 'react'
import { useSnackbar } from 'notistack'

import { Box, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogContent, Grid, Typography } from '@mui/material'

import scheduleService from '@/services/scheduleService'
import categoryService from '@/services/categoryService'
import civilConstructionService from '@/services/constructionService'

import { formatDate } from '@/utils/dateUtils'

import { Table } from '@/app/components/Table'
import { TableHeader } from '@/app/components/TableHeader'
import DetailsDrawer from '@/app/components/apps/schedule/DetailsDrawer'
import ScheduleOpinionChip from '@/app/components/apps/inspections/schedule/StatusChip/ScheduleOpinionChip'

import TableSkeleton from '../../../../comercial/sale/components/TableSkeleton'
import UserCard from '../../../../users/userCard'
import ScheduleFromProjectForm from '../../../modal/ScheduleFromProjectForm'
import ConstructionFormModal from './ConstructionFormModal'
import { IconEdit } from '@tabler/icons-react'
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput'
import { Add } from '@mui/icons-material'

export default function ConstructionsTab({ projectId, viewOnly = false }) {
    const { enqueueSnackbar } = useSnackbar()
    const [constructions, setConstructions] = useState([])
    const [constructionsService, setConstructionsService] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [categoryId, setCategoryId] = useState(null);
    const [selectedConstruction, setSelectedConstruction] = useState(null);

    const [selectedConstructionId, setSelectedConstructionId] = useState(null);
    const [selectedConstructionServiceId, setSelectedConstructionServiceId] = useState(null);
    const [openConstructionFormModal, setOpenConstructionFormModal] = useState(false);
    const [openConstructionServiceFormModal, setOpenConstructionServiceFormModal] = useState(false);
    const [openViewConstruction, setOpenViewConstruction] = useState(false);
    const [openFinancialRecordSelectModal, setOpenFinancialRecordSelectModal] = useState(false);
    const [financialRecords, setFinancialRecords] = useState([]);

    const handleRowClick = (row) => {
        if (row.id) {
            setOpenConstructionServiceFormModal(true);
            setSelectedConstructionServiceId(row.id);
        }
    };

    const loadConstructions = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            const response = await civilConstructionService.index({ project__in: projectId, expand: 'financial_records' });
            setConstructions(response.results);
        } catch (error) {
            enqueueSnackbar(`Erro ao carregar obras: ${error.message}`, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [projectId, enqueueSnackbar]);

    useEffect(() => {
        loadConstructions();
    }, [loadConstructions]);

    const fetchConstructions = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            const response = await scheduleService.index({
                fields: [
                    'id',
                    'schedule_date',
                    'schedule_start_time',
                    'address.street',
                    'address.number',
                    'address.complete_address',
                    'service.name',
                    'service.category',
                    'final_service_opinion.name',
                    'protocol',
                    'schedule_agent',
                    'observation'
                ].join(','),
                project__in: projectId,
                category__icontains: 'Obras'
            });
            setConstructionsService(response.results);
        } catch (error) {
            enqueueSnackbar(`Erro ao carregar serviços de obras: ${error.message}`, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [projectId, enqueueSnackbar]);

    useEffect(() => {
        fetchConstructions();
    }, [fetchConstructions]);

    useEffect(() => {
        const fetchCategory = async () => {
            const response = await categoryService.index({ name__in: 'Obras' });
            if (response.results.length > 0) {
                setCategoryId(response.results[0].id);
            }
        }
        fetchCategory();
    }, []);

    const handleAddSuccess = async () => {
        setOpenConstructionServiceFormModal(false);
        setSelectedConstruction(null);
        await fetchConstructions();
    };

    const handleConstructionFormSuccess = async () => {
        setOpenConstructionFormModal(false);
        setSelectedConstructionId(null);
        await loadConstructions()
    }

    const handleFinancialRecordsChange = async (constructionId, value) => {
        const ids = Array.isArray(value) ? value.map(v => v.id) : []

        setLoading(true)
        try {
            await civilConstructionService.update(constructionId, {
                financial_records: ids
            })
            setSelectedConstructionId(null)
            await loadConstructions()
        } catch (error) {
            enqueueSnackbar(
                `Erro ao atualizar solicitações de pagamento: ${error.message}`,
                { variant: "error" }
            )
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    const statusMap = {
        P: { label: 'Pendente', color: 'warning' },
        E: { label: 'Em Andamento', color: 'info' },
        C: { label: 'Cancelada', color: 'error' },
        F: { label: 'Finalizada', color: 'success' },
    };

    const columns = [
        { field: 'service', headerName: 'Serviço', render: r => r.service.name },
        { field: 'address', headerName: 'Endereço', render: r => r.address.complete_address },
        { field: 'schedule_agent', headerName: 'Agente', render: r => { r.schedule_agent ? <UserCard userId={r.schedule_agent} /> : "Sem agente" } },
        { field: 'schedule_date', headerName: 'Agendada', render: r => new Date(r.schedule_date).toLocaleDateString() },
        { field: 'final_service_opinion', headerName: 'Concluída', render: r => r.final_service_opinion ? new Date(r.final_service_opinion).toLocaleDateString() : '-' },
    ]

    return (
        <>
            <Box sx={{ width: '100%', mb: 3 }}>
                {constructions.map((c) => {
                    return (
                        <Card
                            key={c.id}
                            variant="outlined"
                            sx={{ width: '100%', mb: 2, boxShadow: 1, borderRadius: 2 }}
                        >
                            <CardHeader
                                action={
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button onClick={() => { setOpenConstructionFormModal(true); setSelectedConstructionId(c.id) }} variant={null} >
                                            <IconEdit size={16} />
                                        </Button>
                                        <Chip
                                            label={statusMap[c.status]?.label || c.status}
                                            color={statusMap[c.status]?.color}
                                        />
                                    </Box>
                                }
                                title={"Obra"}
                                sx={{
                                    padding: "16px 24px",
                                    border: "0.1px solid #E0E0E0",
                                    borderRadius: "20px",
                                }}
                            />
                            <CardContent>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="h6" color="textSecondary">
                                            Responsabilidade
                                        </Typography>
                                        <Typography variant="body1">
                                            {c.work_responsibility === 'C' ? 'Cliente' :
                                                c.work_responsibility === 'F' ? 'Franquia' :
                                                    c.work_responsibility === 'O' ? 'Centro de Operações' :
                                                        c.work_responsibility}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="h6" color="textSecondary">
                                            % de Sombreamento
                                        </Typography>
                                        <Typography variant="body1">{c.shading_percentage}%</Typography>
                                    </Grid>

                                    {c.repass_value && (
                                        <Grid item xs={6}>
                                            <Typography variant="h6" color="textSecondary">
                                                Valor de Repasse
                                            </Typography>
                                            <Typography variant="body1">
                                                {Number(c.repass_value).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </Typography>
                                        </Grid>
                                    )}

                                    {c.budget_value && (
                                        <Grid item xs={6}>
                                            <Typography variant="h6" color="textSecondary">
                                                Orçamento
                                            </Typography>
                                            <Typography variant="body1">
                                                {Number(c.budget_value).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </Typography>
                                        </Grid>
                                    )}
                                    <Grid item xs={6}>
                                        <Typography variant="h6" color="textSecondary">
                                            Prazo
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(c.deadline)}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography variant="h6" color="textSecondary">
                                            Status
                                        </Typography>
                                        <Chip
                                            label={statusMap[c.status]?.label || c.status}
                                            color={statusMap[c.status]?.color}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="textSecondary">
                                            Descrição do Serviço
                                        </Typography>
                                        <Typography variant="body1">{c.service_description}</Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TableHeader.Root>
                                            <TableHeader.Title
                                                title="Solicitações de Pagamento"
                                            />
                                            <TableHeader.Button
                                                buttonLabel="Adicionar Solicitação"
                                                icon={<Add />}
                                                onButtonClick={() => {
                                                    setOpenFinancialRecordSelectModal(true)
                                                    setSelectedConstructionId(c.id)
                                                    setFinancialRecords(c.financial_records)
                                                    console.log(c.financial_records)
                                                }}
                                                sx={{ width: 250 }}
                                            />
                                        </TableHeader.Root>

                                        <Table.Root
                                            data={c.financial_records}
                                            totalRows={c.financial_records?.length}
                                            page={0}
                                            rowsPerPage={c.financial_records?.length}
                                            onPageChange={() => { }}
                                            onRowsPerPageChange={() => { }}
                                            sx={{ mt: 1 }}
                                        >
                                            <Table.Head>
                                                <Table.Cell>Protocolo</Table.Cell>
                                                <Table.Cell>Valor</Table.Cell>
                                                <Table.Cell>Vencimento</Table.Cell>
                                                <Table.Cell>Fornecedor/Cliente</Table.Cell>
                                            </Table.Head>

                                            <Table.Body loading={false}>
                                                <Table.Cell
                                                    render={fr => fr.protocol}
                                                    sx={{ fontSize: '14px' }}
                                                />
                                                <Table.Cell
                                                    render={fr =>
                                                        Number(fr.value).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL',
                                                        })
                                                    }
                                                    sx={{ fontSize: '14px' }}
                                                />
                                                <Table.Cell
                                                    render={fr => formatDate(fr.due_date)}
                                                    sx={{ fontSize: '14px' }}
                                                />
                                                <Table.Cell
                                                    render={fr => fr.client_supplier_name}
                                                    sx={{ fontSize: '14px' }}
                                                />
                                            </Table.Body>
                                        </Table.Root>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )
                })}
                {!viewOnly && <Box
                    sx={{
                        display: 'flex',
                        justifyContent: constructions.length === 0 ? 'center' : 'flex-end',
                        mt: 1
                    }}
                >
                    <Button onClick={() => setOpenConstructionFormModal(true)}>Adicionar Obra</Button>
                </Box>}
            </Box>

            <TableHeader.Root>
                <TableHeader.Title
                    title="Serviços de Obra"
                    totalItems={constructionsService.length}
                    objNameNumberReference={constructions.length === 1 ? "Obra" : "Obras"}
                />
                {!viewOnly && <TableHeader.Button
                    buttonLabel="Adicionar serviço de obra"
                    icon={<Add />}
                    onButtonClick={() => setOpenConstructionServiceFormModal(true)}
                    sx={{
                        width: 250,
                    }}
                />}
            </TableHeader.Root>

            <Table.Root
                data={constructionsService}
                totalRows={constructionsService.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
            >
                <Table.Head>
                    {columns.map(c => (
                        <Table.Cell
                            key={c.field}
                            sx={{ fontWeight: 600, fontSize: '14px' }}
                        >
                            {c.headerName}
                        </Table.Cell>
                    ))}
                    {!viewOnly && <Table.Cell align="center">Editar</Table.Cell>}
                    <Table.Cell align="center">Ver</Table.Cell>
                </Table.Head>

                <Table.Body
                    loading={loading}
                    onRowClick={handleRowClick}
                    sx={{
                        cursor: "pointer",
                        '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' },
                    }}
                >

                    <Table.Cell
                        render={r => r.service?.name}
                        sx={{ opacity: 0.7, }}
                    />
                    <Table.Cell
                        render={r => r.address?.complete_address}
                        sx={{ opacity: 0.7, }}
                    />
                    <Table.Cell render={r =>
                        r.schedule_agent
                            ? <UserCard userId={r.schedule_agent} />
                            : "Sem agente"}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={r =>
                        formatDate(r.schedule_date)}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={r => { return <ScheduleOpinionChip status={r.final_service_opinion?.name} /> }}
                        sx={{ opacity: 0.7 }}
                    />

                    {!viewOnly && <Table.EditAction onClick={r => { setSelectedConstructionServiceId(r.id); setOpenConstructionServiceFormModal(true) }} />}
                    <Table.ViewAction onClick={(r) => {
                        setOpenViewConstruction(true);
                        setSelectedConstructionServiceId(r.id);
                    }}
                    />
                </Table.Body>
            </Table.Root>

            {!viewOnly && <>
                <ConstructionFormModal
                    open={openConstructionFormModal}
                    onClose={() => setOpenConstructionFormModal(false)}
                    projectId={projectId}
                    constructionId={selectedConstructionId || null}
                    onSave={handleConstructionFormSuccess}
                />

                <Dialog
                    open={openFinancialRecordSelectModal}
                    onClose={() => setOpenFinancialRecordSelectModal(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            padding: '24px',
                            gap: '24px',
                            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                            backgroundColor: '#FFF',
                        },
                    }}
                >
                    <DialogContent>
                        <GenericAsyncAutocompleteInput
                            label="Solicitação de Pagamento"
                            value={financialRecords || []} // Pass the array of selected objects
                            getOptionLabel={(option) => option.protocol || ''} // Specify how to get the label string
                            isOptionEqualToValue={(option, value) => option.id === value.id} // Specify how to compare objects
                            endpoint="api/financial-records"
                            queryParam="protocol__icontains"
                            onChange={(value) => {
                                setFinancialRecords(value); // Update state with selected objects
                            }}
                            extraParams={{ fields: "id,protocol,value,due_date,client_supplier_name" }}
                            multiselect
                            renderOption={(props, option) => {
                                const val = parseFloat(option.value);
                                return (
                                    <Box component="li" {...props} key={option.id}>
                                        {/* Display protocol as the main identifier in the dropdown */}
                                        <Typography variant="body1" component="span">{option.protocol}</Typography>
                                        {/* Display formatted value next to it */}
                                        <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 1 }}>
                                            {isNaN(val)
                                                ? '-'
                                                : val.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })
                                            }
                                        </Typography>
                                    </Box>
                                );
                            }}
                        />
                    </DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                handleFinancialRecordsChange(selectedConstructionId, financialRecords);
                                setOpenFinancialRecordSelectModal(false);
                            }}
                        >
                            Confirmar
                        </Button>
                    </Box>
                </Dialog>

                <Dialog
                    open={openConstructionServiceFormModal}
                    onClose={() => { setOpenConstructionServiceFormModal(false); setSelectedConstructionServiceId(null); }}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: '20px', padding: '24px', gap: '24px', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', backgroundColor: '#FFF' } }}
                >
                    <DialogContent>
                        <ScheduleFromProjectForm
                            projectId={projectId}
                            scheduleId={selectedConstructionServiceId || null}
                            categoryId={categoryId}
                            displayAgent={false}
                            onSave={handleAddSuccess}
                        />
                    </DialogContent>
                </Dialog>
            </>}

            <DetailsDrawer dialogMode={true} scheduleId={selectedConstruction} open={openViewConstruction} onClose={() => setOpenViewConstruction(false)} />
        </>
    );
}
