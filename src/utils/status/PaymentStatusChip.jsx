import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const PaymentStatusChip = ({ isPaid }) => {
  const getChipProps = (isPaid) => {
    if (isPaid) {
      return { label: 'Pago', color: 'success', icon: <CheckCircleIcon /> };
    } else {
      return { label: 'Não Pago', color: 'error', icon: <CancelIcon /> };
    }
  };

  const { label, color, icon } = getChipProps(isPaid);

  return <Chip label={label} color={color} icon={icon} />;
};

export default PaymentStatusChip;
