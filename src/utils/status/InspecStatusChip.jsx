import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import theme from '@/utils/theme';

const StatusInspectionChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'Pendente':
        return { label: 'Pendente', color: theme.palette.secondary.neutral, icon: '' };
      case 'Concluído':
        return { label: 'Pago', color: theme.palette.success.main, icon: <HourglassEmptyIcon /> };
      case 'Cancelado':
        return { label: 'Cancelado', color: theme.palette.warning.main, icon: <HourglassEmptyIcon /> };
      case 'NV':
        return { label: 'Não vinculado', color: '#fff', icon: <CancelIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} sx={{backgroundColor: color}} icon={icon} />;
};

export default StatusInspectionChip;
