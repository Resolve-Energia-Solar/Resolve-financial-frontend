import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const ChipRequestStatus = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'Solicitada':
        return { label: 'Solicitada', color: 'warning', icon: <HourglassEmptyIcon /> };
      case 'Indeferida':
        return { label: 'Indeferida', color: 'error', icon: <ErrorIcon /> };
      case 'Bloqueado':
        return { label: 'Bloqueado', color: 'error', icon: <ErrorIcon /> };
      case 'Deferida':
        return { label: 'Deferida', color: 'success', icon: <CheckCircleIcon /> };
      case 'Não se aplica':
        return { label: 'Não se aplica', color: 'default', icon: null};
      default:
        return { label: 'Não se aplica', color: 'default', icon: null};
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default ChipRequestStatus;
