import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
  HourglassFull as HourglassFullIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';

const StatusChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'P':
        return { label: 'Pendente', color: 'warning', icon: <HourglassEmptyIcon /> };
      case 'F':
        return { label: 'Finalizado', color: 'success', icon: <CheckCircleIcon /> };
      case 'EA':
        return { label: 'Em Andamento', color: 'info', icon: <HourglassFullIcon /> };
      case 'C':
        return { label: 'Cancelado', color: 'error', icon: <CancelIcon /> };
      case 'D':
        return { label: 'Distrato', color: 'secondary', icon: <RemoveCircleIcon /> };
      case 'ED':
        return { label: 'Em Processo de Distrato', color: theme.palette.secondary.light, icon: <RemoveCircleIcon sx={{ color: '#fff' }} /> };
      default:
        return { label: 'Desconhecido', color: 'default', icon: <CancelIcon /> };
    }
  };

  const { label, color, icon } = getChipProps(status);

  return <Chip label={label} color={color} icon={icon} />;
};

export default StatusChip;
