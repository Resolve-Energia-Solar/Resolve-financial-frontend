import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon, 
} from '@mui/icons-material';
import theme from '@/utils/theme';

const StatusFinancialChip = ({ status }) => {
  const getChipProps = (s) => {
    switch (s) {
      case 'P':
        return { label: 'Pendente', color: theme.palette.secondary.light, icon: <HourglassEmptyIcon /> };
      case 'L':
        return { label: 'Liberado', color: theme.palette.info.main,  icon: <CheckCircleIcon/> };
      case 'C':
        return { label: 'Concluido', color: theme.palette.success.light, icon: <CheckCircleIcon sx={{color: '#fff'}} />};
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} sx={{backgroundColor: color, color: '#fff'}} icon={icon} />;
};

export default StatusFinancialChip;
