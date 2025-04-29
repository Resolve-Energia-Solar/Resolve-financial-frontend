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
        'solicito civil + solicito sombreamento',
        'solicitado análise de sombreamento',
        'pendente',
        'solicitado engenheiro eletricista',
        'solicitado análise do engenheiro civil',
        'solicitado análise do engenheiro eletricista',
        'solicitado análise do engenheiro civil'
      ];

    if (successStatus.some(status => lowerStatus.includes(status))) {
        color = 'success';
    } else if (errorStatus.some(status => lowerStatus.includes(status))) {
        color = 'error';
    } else if (infoStatus.some(status => lowerStatus.includes(status))) {
        color = 'info';
    } 

    return <Chip label={status} color={color} />;
}