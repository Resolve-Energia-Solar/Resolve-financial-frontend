import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';

const ChipProject = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case true:
        return { label: 'Concluído', color: 'success', icon: <CheckCircleIcon /> };
      case false:
        return { label: 'Pendente', color: 'warning', icon: <HourglassEmptyIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default ChipProject;
