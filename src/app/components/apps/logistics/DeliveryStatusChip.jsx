import {
    LockOpen,
    Block as BlockIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { Chip } from "@mui/material";

const getDeliveryChipProps = (status) => {
    switch (status) {
        case 'Bloqueado':
            return { label: status, color: 'error', icon: <BlockIcon /> };
        case 'Liberado':
            return { label: status, color: 'info', icon: <LockOpen /> };
        case 'Agendado':
            return { label: status, color: 'info', icon: <EventIcon /> };
        case 'Entregue':
            return { label: status, color: 'success', icon: <CheckCircleIcon /> };
        case 'Cancelado':
            return { label: status, color: 'error', icon: <CancelIcon /> };
        default:
            return { label: status, color: 'default' };
    }
};

export default function DeliveryStatusChip({ status }) {
    const { label, color, icon } = getDeliveryChipProps(status);

    return (
        <Chip
            label={label}
            color={color}
            icon={icon}
        />
    );
}