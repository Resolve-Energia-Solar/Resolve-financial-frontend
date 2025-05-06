import { Chip } from "@mui/material";

export default function ScheduleOpinionChip({ status }) {
    if (!status) {
        return <Chip label="Pendente" color="default" />;
    }
    const lowerStatus = String(status).toLowerCase();
    let color = 'default';

    if (lowerStatus.includes('solicitado') || lowerStatus.includes('solicito') || lowerStatus.includes('confirmado')) {
        color = 'primary';
    } else if (lowerStatus.includes('aprovado')) {
        color = 'success';
    } else if (lowerStatus.includes('reprovado') || lowerStatus.includes('reprovada')) {
        color = 'error';
    } else if (lowerStatus.includes('cancelado') || lowerStatus.includes('cancelada')) {
        color = 'error';
    } else if (lowerStatus.includes('concluído')) {
        color = 'success';
    } else if (lowerStatus.includes('andamento')) {
        color = 'info';
    } else if (lowerStatus.includes('entregue')) {
        color = 'success';
    } else if (lowerStatus.includes('agendado')) {
        color = 'info';
    }

    return <Chip label={status} color={color} />;
}