import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import theme from '@/utils/theme';

const StatusFinancialChip = ({ status }) => {
    console.log(status);
  const getChipProps = (s) => {
    switch (s) {
      case 'P':
        return { label: 'Pendente', color: theme.palette.secondary.neutral, icon: '' };
      case 'PG':
        return { label: 'Pago', color: theme.palette.success.main, icon: <HourglassEmptyIcon /> };
      case 'PA':
        return { label: 'Parcialmente Pago', color: theme.palette.success.main, icon: <HourglassEmptyIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} sx={{backgroundColor: color}} icon={icon} />;
};

export default StatusFinancialChip;
