import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import theme from '@/utils/theme';

const StatusChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'F':
        return { label: 'Finalizado', color: theme.palette.success.main, icon: <CheckCircleIcon /> };
      case 'EA':
        return { label: 'Em Andamento', color: theme.palette.success.main, icon: <HourglassEmptyIcon /> };
      case 'P':
        return { label: 'Pendente', color: theme.palette.secondary.neutral, icon: <HourglassEmptyIcon /> };
      case 'C':
        return { label: 'Cancelado', color: 'error', icon: <CancelIcon /> };
      case 'D':
        return { label: 'Distrato', color: 'error', icon: <CancelIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return    <Chip label={label} sx={{backgroundColor: color}} icon={icon} />;
};

export default StatusChip;
