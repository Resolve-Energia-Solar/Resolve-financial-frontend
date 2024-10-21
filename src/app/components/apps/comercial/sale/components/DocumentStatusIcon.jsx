import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const StatusChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'F':
        return { label: 'Finalizado', color: 'success', icon: <CheckCircleIcon /> };
      case 'EA':
        return { label: 'Em Andamento', color: 'primary', icon: <HourglassEmptyIcon /> };
      case 'P':
        return { label: 'Pendente', color: 'warning', icon: <HourglassEmptyIcon /> };
      case 'C':
        return { label: 'Cancelado', color: 'error', icon: <CancelIcon /> };
      case 'D':
        return { label: 'Distrato', color: 'error', icon: <CancelIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default StatusChip;
