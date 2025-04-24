import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import scheduleService from "@/services/scheduleService";
import TableSkeleton from "../../../../comercial/sale/components/TableSkeleton";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UserCard from "../../../../users/userCard";
import { formatDate } from "@/utils/dateUtils";
import ScheduleOpinionChip from "../../../../inspections/schedule/StatusChip/ScheduleOpinionChip";
import { Table } from "@/app/components/Table";
import { useTheme, alpha, Dialog, DialogContent } from "@mui/material";
import { TableHeader } from "@/app/components/TableHeader";
import ScheduleFormCreate from "../../../../inspections/schedule/Add-schedule";

export default function LogisticsTab({ projectId }) {
    const { enqueueSnackbar } = useSnackbar()
    const [inspections, setInspections] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [principalId, setPrincipalId] = useState(null)

    const theme = useTheme();

    const [openAddInspection, setOpenAddInspection] = useState(false);
    const [openEditInspection, setOpenEditInspection] = useState(false);
    const [openViewInspection, setOpenViewInspection] = useState(false);

    useEffect(() => {
        if (projectId) {
            const fetchInspections = async () => {
                setLoading(true);
                try {
                    const response = await scheduleService.index(
                        {
                            fields: "id,address.complete_address,products.description,scheduled_agent,schedule_date,completed_date,final_service_opinion.name,project.inspection,project.product.description,service.name",
                            expand: "address,products,scheduled_agent,final_service_opinion,project,project.product,service",
                            project__in: projectId,
                            category__icontains: 'Entrega'
                        }
                    );
                    setInspections(response.results);
                } catch (error) {
                    enqueueSnackbar(`Erro ao carregar entregas: ${error.message}`, { variant: "error" });
                } finally {
                    setLoading(false);
                }
            }
            fetchInspections();
        }
        setLoading(false);
    }, [projectId]);

    const products = inspections.map(i => i.project.products).flat();

    if (loading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    const columns = [
        { field: 'service', headerName: 'Serviço', render: r => r.service.name },
        { field: 'address', headerName: 'Endereço', render: r => r.address.complete_address },
        { field: 'schedule_date', headerName: 'Agendada', render: r => new Date(r.schedule_date).toLocaleDateString() },
        { field: 'products', headerName: 'Produto', render: r => r.products.map(p => p.description).join(', ') },
        { field: 'scheduled_agent', headerName: 'Fornecedor', render: r => r.scheduled_agent?.name },
        { field: 'final_service_opinion', headerName: 'Status Logístico', render: r => r.final_service_opinion?.name },
    ]


    return (
        <>

            <TableHeader.Root>
                <TableHeader.Title
                    title="Total"
                    totalItems={inspections.length}
                    objNameNumberReference={inspections.length === 1 ? "Entrega" : "Entregas"}
                />
                <TableHeader.Button
                    buttonLabel="Adicionar entrega"
                    onButtonClick={() => setOpenAddInspection(true)}
                    sx={{
                        width: 200,
                    }}
                />
            </TableHeader.Root>

            <Table.Root
                data={inspections}
                totalRows={inspections.length}
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
                    <Table.Cell align="center">Editar</Table.Cell>
                    <Table.Cell align="center">Ver</Table.Cell>
                    <Table.Cell align="center">Principal</Table.Cell>
                </Table.Head>

                <Table.Body loading={loading}>
                    <Table.Cell
                        render={row => row.service?.name}
                        sx={{ opacity: 0.7, }}
                    />
                    <Table.Cell
                        render={row => row.address?.complete_address}
                        sx={{ opacity: 0.7, }}
                    />
                    <Table.Cell render={row =>
                        formatDate(row.schedule_date)}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row =>
                        row.products?.length > 0
                            ? row.products[0].description
                            : row.project?.product?.description}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row =>
                        row.scheduled_agent
                            ? <UserCard userId={row.scheduled_agent} />
                            : "Sem agente"}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row => <ScheduleOpinionChip status={row.final_service_opinion?.name} />}
                        sx={{ opacity: 0.7 }}
                    />

                    <Table.EditAction onClick={row => console.log("editar", row)} />
                    <Table.ViewAction onClick={row => console.log("ver", row)} />
                    <Table.SwitchAction
                        isSelected={row => row.project?.inspection === row.id}
                        onToggle={(row, nextChecked) => {
                            const nextValue = nextChecked ? row.id : null;
                            console.log(
                                `[Switch] row ${row.id}: inspection → ${nextValue}`
                            );
                            setInspections(prev =>
                                prev.map(r =>
                                    r.id === row.id
                                        ? {
                                            ...r,
                                            project: {
                                                ...r.project,
                                                inspection: nextValue
                                            },
                                        }
                                        : r
                                )
                            );
                        }}
                    />
                </Table.Body>
            </Table.Root>

            <Dialog
                open={openAddInspection}
                onClose={() => setOpenAddInspection(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        padding: '24px',
                        gap: '24px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#FFFFFF',
                    },
                }}
            >
                <DialogContent>
                    <ScheduleFormCreate
                        projectId={projectId}
                        customerId={principalId}
                        products={products}

                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
