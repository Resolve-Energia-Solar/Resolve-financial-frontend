import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const ChipRequest = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'S':
        return { label: 'Solicitada', color: 'warning', icon: <HourglassEmptyIcon /> };
      case 'I':
        return { label: 'Indeferida', color: 'error', icon: <ErrorIcon /> };
      case 'ID':
        return { label: 'Indeferida por Débito', color: 'error', icon: <ErrorIcon /> };
      case 'D':
        return { label: 'Deferida', color: 'success', icon: <CheckCircleIcon /> };
      default:
        return { label: 'Sem Solicitação', color: 'default', icon: null};
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default ChipRequest;
