import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import theme from '@/utils/theme';

const ReleaseStatus = ({ status }) => {
  const getChipProps = (status) => {
    if (status == true) {
      return { label: 'Liberado', color: theme.palette.success.light, icon: <CheckCircleIcon /> };
    } else {
      return { label: 'Bloqueado', color: theme.palette.warning.main, icon: <CancelIcon /> };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} sx={{backgroundColor: color, color: '#fff'}} icon={icon} />;
};

export default ReleaseStatus;
