import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Table, TableHead, TableBody, TableCell, TableRow, Switch } from "@mui/material";
import scheduleService from "@/services/scheduleService";
import TableSkeleton from "../../comercial/sale/components/TableSkeleton";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UserCard from "../../users/userCard";
import { formatDate } from "@/utils/dateUtils";
import ScheduleOpinionChip from "../schedule/StatusChip/ScheduleOpinionChip";

export default function InspectionsTable({ projectId }) {
    const { enqueueSnackbar } = useSnackbar();
    const [inspections, setInspections] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            const fetchInspections = async () => {
                setIsLoading(true);
                try {
                    const response = await scheduleService.index(
                        {
                            fields: "id,address.complete_address,products.description,scheduled_agent,schedule_date,completed_date,final_service_opinion.name,project.inspection,project.product.description",
                            expand: "address,products,scheduled_agent,final_service_opinion,project,project.product",
                            project__in: projectId
                        }
                    );
                    console.log(response.results);
                    if (response.results?.length === 0) {
                        enqueueSnackbar("Sem vistorias para este projeto.", { variant: "info" });
                    }
                    setInspections(response.results);
                } catch (error) {
                    enqueueSnackbar(`Erro ao carregar vistorias: ${error.message}`, { variant: "error" });
                } finally {
                    setIsLoading(false);
                }
            }
            fetchInspections();
        }
        setIsLoading(false);
    }, [projectId]);

    if (isLoading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    return (
        <Table>
            <TableHead>
                <TableCell>Endereço</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Agente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Parecer Final</TableCell>
                <TableCell>Ações</TableCell>
                <TableCell>Principal</TableCell>
            </TableHead>
            <TableBody>
                {inspections?.map((inspection) => (
                    <TableRow key={inspection.id}>
                        <TableCell>{inspection.address?.complete_address}</TableCell>
                        <TableCell>{inspection.products.length > 0 ? inspection.products[0].description : inspection.project.product.description}</TableCell>
                        <TableCell>{inspection.schedule_agent ? <UserCard userId={inspection.schedule_agent} /> : 'Sem agente'}</TableCell>
                        <TableCell>{formatDate(inspection.schedule_date)}</TableCell>
                        <TableCell>
                            <ScheduleOpinionChip status={inspection.final_service_opinion?.name} />
                        </TableCell>
                        <TableCell>
                            <EditIcon sx={{ mr: 1 }} />
                            <VisibilityIcon />
                        </TableCell>
                        <TableCell><Switch checked={inspection.id === inspection.project.inspection} /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
