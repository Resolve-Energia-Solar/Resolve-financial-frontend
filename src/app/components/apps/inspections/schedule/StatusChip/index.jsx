import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const ScheduleStatusChip = ({ status }) => {
  if (!status) {
    return <Chip label="Pendente" color="default" />;
  }
  const getChipProps = (status) => {
    switch (status) {
      case 'Confirmado':
        return { label: 'Confirmado', color: 'success', icon: <CheckCircleIcon /> };
      case 'Pendente':
        return { label: 'Pendente', color: 'primary', icon: <HourglassEmptyIcon /> };
      case 'Cancelado':
        return { label: 'Cancelado', color: 'error', icon: <CancelIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);

  return <Chip label={label} color={color} icon={icon} />;
};

export default ScheduleStatusChip;
