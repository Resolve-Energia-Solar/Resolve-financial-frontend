import { Chip } from '@mui/material';
import theme from '@/utils/theme';


const ChipDeadLine = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'P':
        return { label: 'No prazo', color: theme.palette.success.main, labelColor: '#fff' };
      case 'A':
        return { label: 'Em atraso', color: theme.palette.error.main, labelColor: '#fff' };
      default:
        return { label: 'Desconhecido', color: theme.palette.grey.light, labelColor: '#000' };
    }
  };
  const { label, color, labelColor } = getChipProps(status);
  
  return <Chip label={label} sx={{backgroundColor: color, color: labelColor}} size="small" />;
};


export default ChipDeadLine;

