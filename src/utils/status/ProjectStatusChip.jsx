import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
  HourglassFull as HourglassFullIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';
import theme from '@/utils/theme';

const StatusChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'P':
        return { label: 'Pendente', color: theme.palette.warning.light, icon: <HourglassEmptyIcon sx={{ color: '#fff' }} /> };
      case 'CO':
        return { label: 'Concluído', color: theme.palette.success.light, icon: <CheckCircleIcon sx={{ color: '#fff' }} /> };
      case 'EA':
        return { label: 'Em Andamento', color: theme.palette.info.light, icon: <HourglassFullIcon sx={{ color: '#fff' }} /> };
      case 'C':
        return { label: 'Cancelado', color: theme.palette.error.light, icon: <CancelIcon sx={{ color: '#fff' }} /> };
      case 'D':
        return { label: 'Distrato', color: theme.palette.secondary.light, icon: <RemoveCircleIcon sx={{ color: '#fff' }} /> };
      default:
        return { label: 'Desconhecido', color: theme.palette.grey.light, icon: <CancelIcon sx={{ color: '#fff' }} /> };
    }
  };

  const { label, color, icon } = getChipProps(status);

  return <Chip label={label} sx={{ backgroundColor: color, color: '#fff' }} icon={icon} />;
};

export default StatusChip;
