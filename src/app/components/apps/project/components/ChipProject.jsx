import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Cancel as CancelIcon,
  RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';

const ChipProject = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'CO':
        return { label: 'Concluído', color: 'success', icon: <CheckCircleIcon /> };
      case 'P':
        return { label: 'Pendente', color: 'warning', icon: <HourglassEmptyIcon /> };
      case 'EA':
        return { label: 'Em Andamento', color: 'primary', icon: <PlayCircleFilledIcon /> };
      case 'C':
        return { label: 'Cancelado', color: 'error', icon: <CancelIcon /> };
      case 'D':
        return { label: 'Distrato', color: 'default', icon: <RemoveCircleIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default ChipProject;
