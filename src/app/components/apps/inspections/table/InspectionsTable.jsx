import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
// import { Table, TableHead, TableBody, TableCell, TableRow, Switch } from "@mui/material";
import scheduleService from "@/services/scheduleService";
import TableSkeleton from "../../comercial/sale/components/TableSkeleton";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UserCard from "../../users/userCard";
import { formatDate } from "@/utils/dateUtils";
import ScheduleOpinionChip from "../schedule/StatusChip/ScheduleOpinionChip";
import { Table } from "@/app/components/Table";

export default function InspectionsTable({ projectId }) {
    const { enqueueSnackbar } = useSnackbar()
    const [inspections, setInspections] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [principalId, setPrincipalId] = useState(null)

    useEffect(() => {
        if (projectId) {
            const fetchInspections = async () => {
                setLoading(true);
                try {
                    const response = await scheduleService.index(
                        {
                            fields: "id,address.complete_address,products.description,scheduled_agent,schedule_date,completed_date,final_service_opinion.name,project.inspection,project.product.description",
                            expand: "address,products,scheduled_agent,final_service_opinion,project,project.product",
                            project__in: projectId
                        }
                    );
                    setInspections(response.results);
                } catch (error) {
                    enqueueSnackbar(`Erro ao carregar vistorias: ${error.message}`, { variant: "error" });
                } finally {
                    setLoading(false);
                }
            }
            fetchInspections();
        }
        setLoading(false);
    }, [projectId]);
    // useEffect(() => {
    //     if (!projectId) return;
    //     setLoading(true);
    //     scheduleService
    //         .index(
    //             {
    //                 fields: "id,address.complete_address,products.description,scheduled_agent,schedule_date,completed_date,final_service_opinion.name,project.inspection,project.product.description",
    //                 expand: "address,products,scheduled_agent,final_service_opinion,project,project.product",
    //                 project__in: projectId
    //             }
    //         )
    //         .then(res => setInspections(res.results))
    //         .catch(err => enqueueSnackbar(err.message, { variant: "error" }))
    //         .finally(() => setLoading(false));
    // }, [projectId]);

    if (loading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    const columns = [
        { field: 'address', headerName: 'Endereço', render: r => r.address.complete_address },
        { field: 'products', headerName: 'Produto', render: r => r.products.map(p => p.description).join(', ') },
        { field: 'scheduled_agent', headerName: 'Agente', render: r => r.scheduled_agent?.name },
        { field: 'schedule_date', headerName: 'Agendada', render: r => new Date(r.schedule_date).toLocaleDateString() },
        { field: 'completed_date', headerName: 'Concluída', render: r => r.completed_date ? new Date(r.completed_date).toLocaleDateString() : '-' },
        { field: 'final_service_opinion', headerName: 'Opinião', render: r => r.final_service_opinion?.name },
    ]

    const handleEdit = (id) => {
        console.log(`editar inspeção com id: ${id}`);
    }

    const handleView = (id) => {
        console.log(`visualizar inspeção com id: ${id}`);
    }

    // const handleSwitchChange = (id) => {
    //     console.log(`switch principal inspeção com id: ${id}`);
    // }

    // return (
    //     <Table>
    //         <TableHead>
    //             <TableCell>Endereço</TableCell>
    //             <TableCell>Produto</TableCell>
    //             <TableCell>Agente</TableCell>
    //             <TableCell>Data</TableCell>
    //             <TableCell>Parecer Final</TableCell>
    //             <TableCell>Ações</TableCell>
    //             <TableCell>Principal</TableCell>
    //         </TableHead>
    //         <TableBody>
    //             {inspections?.length === 0 ? (
    //                 <TableRow>
    //                     <TableCell colSpan={7} align="center">Nenhuma vistoria encontrada.</TableCell>
    //                 </TableRow>
    //             ) : (
    //                 inspections?.map((inspection) => (
    //                     <TableRow key={inspection.id}>
    //                         <TableCell>{inspection.address?.complete_address}</TableCell>
    //                         <TableCell>{inspection.products.length > 0 ? inspection.products[0].description : inspection.project.product.description}</TableCell>
    //                         <TableCell>{inspection.schedule_agent ? <UserCard userId={inspection.schedule_agent} /> : 'Sem agente'}</TableCell>
    //                         <TableCell>{formatDate(inspection.schedule_date)}</TableCell>
    //                         <TableCell>
    //                             <ScheduleOpinionChip status={inspection.final_service_opinion?.name} />
    //                         </TableCell>
    //                         <TableCell>
    //                             <EditIcon sx={{ mr: 1 }} />
    //                             <VisibilityIcon />
    //                         </TableCell>
    //                         <TableCell><Switch checked={inspection.id === inspection.project.inspection} /></TableCell>
    //                     </TableRow>
    //                 ))
    //             )}
    //         </TableBody>
    //     </Table>
    // )

    return (
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
                        sx={{ fontWeight: 600, fontSize:'14px', color:'#303030' }}
                    >
                        {c.headerName}
                    </Table.Cell>
                ))}
                <Table.Cell align="center" sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>Editar</Table.Cell>
                <Table.Cell align="center" sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>Ver</Table.Cell>
                <Table.Cell align="center" sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>Principal</Table.Cell>
            </Table.Head>

            <Table.Body loading={loading}>
                    <Table.Cell 
                        render={row => row.address?.complete_address} 
                        sx={{ fontWeight: 600, fontSize: '14px', color: '#7E8388' }}
                    />
                    <Table.Cell render={row =>
                        row.products?.length > 0
                            ? row.products[0].description
                            : row.project?.product?.description} 
                        sx={{ fontWeight: 600, fontSize: '14px', color: '#7E8388' }}
                    />
                    <Table.Cell render={row =>
                        row.scheduled_agent
                            ? <UserCard userId={row.scheduled_agent} />
                            : "Sem agente"
                    } />
                    <Table.Cell render={row =>
                        formatDate(row.schedule_date)
                    } />
                    <Table.Cell render={row =>
                        formatDate(row.completed_date)
                    } />
                    <Table.Cell render={row =>
                        formatDate(row.opinion_date)
                    } />
                    {/* <Table.Cell render={row =>
                        <ScheduleOpinionChip status={row.final_service_opinion?.name} />
                    } /> */}

                    <Table.EditAction onClick={row => console.log("editar", row)} />
                    <Table.ViewAction onClick={row => console.log("ver", row)} />
                    <Table.SwitchAction
                        selectedId={principalId}
                        onSelect={id => setPrincipalId(id)}
                    />
           
            </Table.Body>

        </Table.Root>
    );
}
