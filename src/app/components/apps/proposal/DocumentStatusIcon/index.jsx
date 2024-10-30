import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const StatusChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'A':
        return { label: 'Finalizado', color: 'success', icon: <CheckCircleIcon /> };
      case 'P':
        return { label: 'Pendente', color: 'warning', icon: <HourglassEmptyIcon /> };
      case 'R':
        return { label: 'Cancelado', color: 'error', icon: <CancelIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);

  return <Chip label={label} color={color} icon={icon} />;
};

export default StatusChip;
