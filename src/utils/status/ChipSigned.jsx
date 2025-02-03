import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';

const ChipSigned = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'Assinado':
        return { label: 'Assinado', color: 'success', icon: <CheckCircleIcon /> };
      case 'Enviado':
        return { label: 'Enviado', color: 'info', icon: <HourglassEmptyIcon /> };
      case 'Pendente':
        return { label: 'Pendente', color: 'warning', icon: <HourglassEmptyIcon /> };
      case 'Recusado':
        return { label: 'Recusado', color: 'error', icon: <HourglassEmptyIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default ChipSigned;
