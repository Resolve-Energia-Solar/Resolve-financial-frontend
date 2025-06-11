import { Chip } from '@mui/material';
import {
    HourglassEmpty,
    Reply,
    Flag,
    CheckCircle,
    Cancel,
    DoNotDisturb
} from '@mui/icons-material';

const TicketStatusChip = ({ status, size }) => {
    const getChipProps = (status) => {
        switch (status) {
            case 'A':
                return { label: 'Aberto', color: 'warning', icon: <Flag /> };
            case 'E':
                return { label: 'Em Espera', color: 'info', icon: <HourglassEmpty /> };
            case 'RE':
                return { label: 'Respondido', color: 'primary', icon: <Reply /> };
            case 'R':
                return { label: 'Resolvido', color: 'success', icon: <CheckCircle /> };
            case 'F':
                return { label: 'Fechado', color: 'default', icon: <Cancel /> };
            default:
                return { label: 'Desconhecido', color: 'default', icon: <DoNotDisturb /> };
        }
    };

    const { label, color, icon } = getChipProps(status);

    return <Chip label={label} color={color} icon={icon} size={size} />;
};

export default TicketStatusChip;
