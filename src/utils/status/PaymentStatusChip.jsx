import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import theme from '../theme';

const PaymentStatusChip = ({ isPaid }) => {
  const getChipProps = (isPaid) => {
    if (isPaid) {
      return { label: 'Pago', color: theme.palette.success.main, icon: <CheckCircleIcon /> };
    } else {
      return { label: 'Não Pago', color:  'error', icon: <CancelIcon /> };
    }
  };
  //ele não reconhece o warning 

  const { label, color, icon } = getChipProps(isPaid);

  return <Chip label={label} sx={{backgroundColor: color}} icon={icon} />;
};

export default PaymentStatusChip;
