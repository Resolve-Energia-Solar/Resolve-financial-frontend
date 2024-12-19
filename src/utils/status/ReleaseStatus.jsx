import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import theme from '@/utils/theme';

const StatusReleaseChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'Liberado':
        return { label: 'Liberado', color: theme.palette.success.main, icon: '' };
      case 'Bloqueado':
        return { label: 'Bloqueado', color: theme.palette.warning.main, icon: ''};
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} sx={{backgroundColor: color}} icon={icon} />;
};

export default StatusReleaseChip;
