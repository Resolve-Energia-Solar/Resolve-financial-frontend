import { Chip } from '@mui/material';
import theme from '@/utils/theme';


const ChipDeadLine = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case 'P':
        return { label: 'No prazo', color: 'danger'};
      case 'A':
        return { label: 'Em atraso', color: 'success'};
      default:
        return { label: 'Desconhecido', color: theme.palette.grey.light };
    }
  };
  const { label, color, icon } = getChipProps(status);
  
  return   <Chip label={label} sx={{backgroundColor: color, color: '#fff'}} size="small" />;
};


export default ChipDeadLine;
