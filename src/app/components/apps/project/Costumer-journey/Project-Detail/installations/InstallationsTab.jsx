import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import scheduleService from "@/services/scheduleService";
import TableSkeleton from "../../../../comercial/sale/components/TableSkeleton";
import UserCard from "../../../../users/userCard";
import ScheduleFromProjectForm from "../../../modal/ScheduleFromProjectForm";
import { formatDate } from "@/utils/dateUtils";
import ScheduleOpinionChip from "@/app/components/apps/inspections/schedule/StatusChip/ScheduleOpinionChip";
import { Table } from "@/app/components/Table";
import { useTheme, alpha, Dialog, DialogContent } from "@mui/material";
import { TableHeader } from "@/app/components/TableHeader";
import categoryService from "@/services/categoryService";
import DetailsDrawer from "@/app/components/apps/schedule/DetailsDrawer";
import { Add } from "@mui/icons-material";

export default function InstallationsTab({ projectId, viewOnly = false }) {
    const { enqueueSnackbar } = useSnackbar()
    const [installations, setInstallations] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [categoryId, setCategoryId] = useState(null);
    const [selectedInstallation, setSelectedInstallation] = useState(null);
    const [openInstallationFormModal, setOpenInstallationFormModal] = useState(false);
    const [openViewInstallation, setOpenViewInstallation] = useState(false);

    const fetchItems = useCallback(async () => {
        if (projectId) {
            const fetchInspections = async () => {
                setLoading(true);
                try {
                    const response = await scheduleService.index(
                        {
                            fields: "id,address.complete_address,products.description,scheduled_agent,schedule_date,schedule_end_date,completed_date,final_service_opinion.name,project.inspection,project.product.description,service.name",
                            expand: "address,products,scheduled_agent,final_service_opinion,project,project.product,service",
                            project__in: projectId,
                            category__icontains: 'Instalação'
                        }
                    );
                    setInstallations(response.results);
                } catch (error) {
                    enqueueSnackbar(`Erro ao carregar instalações: ${error.message}`, { variant: "error" });
                } finally {
                    setLoading(false);
                }
            }
            fetchInspections();
        }
        setLoading(false);
    }, [projectId, enqueueSnackbar]);

    useEffect(() => {
        fetchItems();
    }, [projectId]);

    useEffect(() => {
        const fetchCategory = async () => {
            const response = await categoryService.index({ name__in: 'Instalação' });
            if (response.results.length > 0) {
                setCategoryId(response.results[0].id);
            }
        }
        fetchCategory();
    }, []);

    const handleAddSuccess = async () => {
        setOpenInstallationFormModal(false);
        setSelectedInstallation(null);
        await fetchItems();
    };

    const products = installations.map(i => i.project.products).flat();

    if (loading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    const columns = [
        { field: 'service', headerName: 'Serviço', render: r => r.service.name },
        { field: 'address', headerName: 'Endereço', render: r => r.address.complete_address },
        { field: 'schedule_date', headerName: 'Data Inicial', render: r => new Date(r.schedule_date).toLocaleDateString() },
        { field: 'schedule_end_date', headerName: 'Data Final', render: r => new Date(r.schedule_end_date).toLocaleDateString() },
        { field: 'products', headerName: 'Produto', render: r => r.products.map(p => p.description).join(', ') },
        { field: 'scheduled_agent', headerName: 'Equipe', render: r => r.scheduled_agent?.name },
        { field: 'service_opinion', headerName: 'Parecer do Serviço', render: r => r.service_opinion?.name },
        { field: 'final_service_opinion', headerName: 'Parecer Final', render: r => r.final_service_opinion?.name },
    ]


    return (
        <>

            <TableHeader.Root>
                <TableHeader.Title
                    title="Total"
                    totalItems={installations.length}
                    objNameNumberReference={installations.length === 1 ? "Instalação" : "Instalações"}
                />
                {!viewOnly && <TableHeader.Button
                    buttonLabel="Adicionar instalação"
                    icon={<Add />}
                    onButtonClick={() => setOpenInstallationFormModal(true)}
                    sx={{
                        width: 200,
                    }}
                />}
            </TableHeader.Root>

            <Table.Root
                data={installations}
                totalRows={installations.length}
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

                <Table.Body loading={loading}>
                    <Table.Cell
                        render={row => row.service?.name}
                        sx={{ opacity: 0.7, }}
                    />
                    <Table.Cell
                        render={row => row.address?.complete_address}
                        sx={{ opacity: 0.7, }}
                    />
                    <Table.Cell
                        render={row => formatDate(row.schedule_date)}
                        sx={{ opacity: 0.7, }}
                    />
                    <Table.Cell
                        render={row => formatDate(row.schedule_end_date)}
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
                    <Table.Cell render={row => row.service_opinion?.name}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row => <ScheduleOpinionChip status={row.final_service_opinion?.name} />}
                        sx={{ opacity: 0.7 }}
                    />

                    {!viewOnly && <Table.EditAction onClick={row => { setSelectedInstallation(row.id); setOpenInstallationFormModal(true); }} />}
                    <Table.ViewAction onClick={row => { setSelectedInstallation(row.id); setOpenViewInstallation(true) }} />
                </Table.Body>
            </Table.Root>

            {!viewOnly &&
                <Dialog open={openInstallationFormModal} onClose={() => { setOpenInstallationFormModal(false); setSelectedInstallation(null); }} >
                    <DialogContent>
                        <ScheduleFromProjectForm
                            projectId={projectId}
                            scheduleId={selectedInstallation || null}
                            categoryId={categoryId}
                            displayAgent={false}
                            onSave={handleAddSuccess}
                        />
                    </DialogContent>
                </Dialog>
            }

            <DetailsDrawer dialogMode={true} scheduleId={selectedInstallation} open={openViewInstallation} onClose={() => setOpenViewInstallation(false)} />
        </>
    );
}
