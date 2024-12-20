import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import theme from '../theme';

const PaymentStatusChip = ({ isPaid }) => {
  const getChipProps = (isPaid) => {
    if (isPaid) {
      return { label: 'Pago', color: theme.palette.success.light, icon: <CheckCircleIcon /> };
    } else {
      return { label: 'Não Pago', color: theme.palette.secondary.light, icon: <CancelIcon /> };
    }
  };
  
  const { label, color, icon } = getChipProps(isPaid);

  return <Chip label={label} sx={{backgroundColor: color, color: '#fff'}} icon={icon} />;
};

export default PaymentStatusChip;
