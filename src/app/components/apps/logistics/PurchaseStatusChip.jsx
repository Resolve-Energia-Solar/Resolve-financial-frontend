import {
    LockOpen,
    Block as BlockIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    HourglassEmpty as HourglassEmptyIcon,
    RemoveCircleOutline as RemoveCircleOutlineIcon,
    AccessTime as AccessTimeIcon,
    CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import { Chip } from "@mui/material";

  const getPurchaseChipProps = (status) => {
    switch (status) {
      case 'Bloqueado':
        return { label: status, color: 'error', icon: <BlockIcon /> };
      case 'Liberado':
        return { label: status, color: 'info', icon: <LockOpen /> };
      case 'Pendente':
        return { label: status, color: 'warning', icon: <HourglassEmptyIcon /> };
      case 'Compra Realizada':
        return { label: status, color: 'success', icon: <CheckCircleIcon /> };
      case 'Cancelado':
        return { label: status, color: 'error', icon: <CancelIcon /> };
      case 'Distrato':
        return { label: status, color: 'default', icon: <RemoveCircleOutlineIcon /> };
      case 'Aguardando Previsão de Entrega':
        return { label: status, color: 'info', icon: <AccessTimeIcon /> };
      case 'Aguardando Pagamento':
        return { label: status, color: 'warning', icon: <CreditCardIcon /> };
      default:
        return { label: status, color: 'default' };
    }
  };

export default function PurchaseStatusChip({ status }) {
    const { label, color, icon } = getPurchaseChipProps(status);

    return (
        <Chip
            label={label}
            color={color}
            icon={icon}
        />
    );
}