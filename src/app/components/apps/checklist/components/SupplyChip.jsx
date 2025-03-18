import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const SupplyChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'M':
        return { label: 'Monofásico', color: 'success', icon: <CheckCircleIcon /> };
      case 'B':
        return { label: 'Bifásico', color: 'success', icon: <CheckCircleIcon /> };
      case 'T':
        return { label: 'Trifásico', color: 'success', icon: <CheckCircleIcon /> };
      default:
        return { label: 'Pendente', color: 'warning', icon: <HourglassEmptyIcon /> };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default SupplyChip;
