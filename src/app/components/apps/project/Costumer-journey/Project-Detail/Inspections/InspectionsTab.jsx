import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import scheduleService from "@/services/scheduleService";
import TableSkeleton from "../../../../comercial/sale/components/TableSkeleton";
import UserCard from "../../../../users/userCard";
import ScheduleFromProjectForm from "../../../modal/AddSchedule";
import { formatDate } from "@/utils/dateUtils";
import { Table } from "@/app/components/Table";
import { useTheme, Dialog, DialogContent } from "@mui/material";
import { TableHeader } from "@/app/components/TableHeader";
import categoryService from "@/services/categoryService";
import ViewInspection from "./View-inspection";

export default function InspectionsTab({ projectId }) {
    const { enqueueSnackbar } = useSnackbar()
    const [inspections, setInspections] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [principalId, setPrincipalId] = useState(null)
    const [categoryId, setCategoryId] = useState(null);

    const theme = useTheme();

    const [openAddInspection, setOpenAddInspection] = useState(false);
    const [openEditInspection, setOpenEditInspection] = useState(false);
    const [openViewInspection, setOpenViewInspection] = useState(false);
    
    const [selectedRow, setSelectedRow] = useState(0);

    const fetchInspections = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            const response = await scheduleService.index({
                fields: "id,address.complete_address,products.description,scheduled_agent,schedule_date,completed_date,service.name,service.category,project.inspection,schedule.final_service_opinion.name",
                expand: "address,products,scheduled_agent,service,project,schedule",
                project__in: projectId,
                category__icontains: 'Vistoria'
            });
            setInspections(response.results);
        } catch (error) {
            enqueueSnackbar(`Erro ao carregar vistorias: ${error.message}`, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [projectId, enqueueSnackbar]);

    useEffect(() => {
        fetchInspections();
    }, [fetchInspections]);

    useEffect(() => {
        const fetchCategory = async () => {
            const response = await categoryService.index({ name__in: 'Vistoria' });
            if (response.results.length > 0) {
                setCategoryId(response.results[0].id);
            }
        }
        fetchCategory();
    }, []);

    const handleAddSuccess = async () => {
        setOpenAddInspection(false);
        await fetchInspections();
    };

    const products = inspections.map(i => i.project.products).flat();

    if (loading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    const columns = [
        { field: 'service', headerName: 'Serviço', render: r => r.service.name },
        { field: 'address', headerName: 'Endereço', render: r => r.address.complete_address },
        { field: 'products', headerName: 'Produto', render: r => r.products.map(p => p.description).join(', ') },
        { field: 'scheduled_agent', headerName: 'Agente', render: r => r.scheduled_agent?.name },
        { field: 'schedule_date', headerName: 'Agendada', render: r => new Date(r.schedule_date).toLocaleDateString() },
        { field: 'completed_date', headerName: 'Concluída', render: r => r.completed_date ? new Date(r.completed_date).toLocaleDateString() : '-' },
        // { field: 'final_service_opinion', headerName: 'Opinião', render: r => r.final_service_opinion?.name },
    ]


    // const handleEditSuccess = async () => {
    //     setOpenEditInspection(false);
    //     await fetchInspections();
    // };


    return (
        <>

            <TableHeader.Root>
                <TableHeader.Title
                    title="Total"
                    totalItems={inspections.length}
                    objNameNumberReference={inspections.length === 1 ? "Vistoria" : "Vistorias"}
                />
                <TableHeader.Button
                    buttonLabel="Adicionar vistoria"
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
                    <Table.Cell render={row =>
                        formatDate(row.schedule_date)}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row =>
                        formatDate(row.completed_date)}
                        sx={{ opacity: 0.7 }}
                    />

                    <Table.EditAction onClick={row => console.log("editar", row)} />
                    <Table.ViewAction onClick={(row) => {
                        setOpenViewInspection(true); 
                        setSelectedRow(row);
                        console.log("ver", row);
                        console.log("selectedInspectionId", selectedRow)
                        }} 
                    />
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
                PaperProps={{ sx: { borderRadius: '20px', padding: '24px', gap: '24px', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', backgroundColor: '#FFF' } }}
            >
                <DialogContent>
                    <ScheduleFromProjectForm
                        projectId={projectId}
                        categoryId={categoryId}
                        products={products}
                        onSave={handleAddSuccess}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={openViewInspection}
                onClose={() => setOpenViewInspection(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: '20px', padding: '24px', gap: '24px', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)', backgroundColor: '#FFF' } }}
            >
                <DialogContent>
                    <ViewInspection
                        projectId={projectId}
                        categoryId={categoryId}
                        products={products}
                        onSave={handleAddSuccess}
                        selectedInspectionId={selectedRow}
                        // row={selectedRow ? selectedRow : {}}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
