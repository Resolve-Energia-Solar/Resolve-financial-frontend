import { Chip } from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Payments as PaymentsIcon,
} from '@mui/icons-material';

export default function ContractChip({ status }) {
  const getChipProps = (status) => {
    switch (status) {
      case 'running':
        return { label: 'Em andamento', color: 'warning', icon: <PaymentsIcon /> };
      case 'closed':
        return { label: 'Fechado', color: 'success', icon: <AttachMoneyIcon /> };
      case 'canceled':
        return { label: 'Cancelado', color: 'error', icon: <ReceiptIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);

  return <Chip label={label} color={color} icon={icon} />;
};

