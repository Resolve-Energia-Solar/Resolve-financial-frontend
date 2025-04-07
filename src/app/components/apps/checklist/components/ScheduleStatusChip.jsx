import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const ScheduleStatusChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'Cancelado':
        return { label: 'Cancelado', color: 'danger', icon: <CancelIcon /> };
      case 'Em Andamento':
        return { label: 'Em Andamento', color: 'info', icon: <CheckCircleIcon /> };
      case 'Confirmado':
        return { label: 'Confirmado', color: 'success', icon: <CheckCircleIcon /> };
      default:
        return { label: 'Pendente', color: 'warning', icon: <HourglassEmptyIcon /> };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default ScheduleStatusChip;
