import { Chip } from "@mui/material";

export default function FinalServiceOpinionChip({ status }) {
    if (!status) {
        return <Chip label="Pendente" color="default" />;
    }
    const lowerStatus = status.toLowerCase();
    let color = 'default';

    const successStatus = [
        'aprovado com obra + aprovado com sombreamento',
        'aprovado com sombreamento',
        'aprovado com obra',
        'aprovado',
    ];

    const errorStatus = [
        'cancelada',
        'reprovada',
        'reprovado',
        'cancelado'
    ];

    const infoStatus = [
        
    ];

    if (successStatus.some(status => lowerStatus.includes(status))) {
        color = 'success';
    } else if (errorStatus.some(status => lowerStatus.includes(status))) {
        color = 'error';
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