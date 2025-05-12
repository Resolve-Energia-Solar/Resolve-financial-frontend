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
import { Add } from "@mui/icons-material";

export default function HomologationTab({ projectId }) {

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
     
    const columns = [
        { field: 'service', headerName: 'Serviço', render: r => r.service.name },
        { field: 'address', headerName: 'Endereço', render: r => r.address.complete_address },
        { field: 'products', headerName: 'Produto', render: r => r.products.map(p => p.description).join(', ') },
        { field: 'scheduled_agent', headerName: 'Agente', render: r => r.scheduled_agent?.name },
        { field: 'schedule_date', headerName: 'Agendada', render: r => new Date(r.schedule_date).toLocaleDateString() },
        { field: 'completed_date', headerName: 'Concluída', render: r => r.completed_date ? new Date(r.completed_date).toLocaleDateString() : '-' },
        // { field: 'final_service_opinion', headerName: 'Opinião', render: r => r.final_service_opinion?.name },
    ]

    return (
        <>

            <TableHeader.Root>
                <TableHeader.Title 
                    title="Total"
                    totalItems={inspections.length}
                    objNameNumberReference={inspections.length === 1 ? "Solicitação" : "Solicitações"}
                />
                <TableHeader.Button
                    buttonLabel="Adicionar vistoria"
                    icon={<Add />}
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
                            sx={{ fontWeight: 600, fontSize: '14px'}}
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
                        sx={{ opacity: 0.7,}}
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

            
        </>
    );
}