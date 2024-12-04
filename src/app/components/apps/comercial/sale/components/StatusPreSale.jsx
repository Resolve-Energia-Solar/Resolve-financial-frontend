import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';

const StatusPreSale = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case false:
        return { label: 'Venda', color: 'success', icon: <CheckCircleIcon /> };
      case true:
        return { label: 'Pré-Venda', color: 'primary', icon: <HourglassEmptyIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default StatusPreSale;
