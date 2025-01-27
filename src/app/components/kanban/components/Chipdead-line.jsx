import { Chip } from '@mui/material';
import theme from '@/utils/theme';
import { useTheme } from '@emotion/react';


const ChipDeadLine = ({ status }) => {
  const  theme = useTheme();
  const getChipProps = (status) => {
    switch (status) {
      case 'P':
        return { label: 'No prazo', color: '#E9F9E6', labelColor: '#17AF65' };
      case 'A':
        return { label: 'Em atraso', color: theme.palette.error.highlight, labelColor: '#EA3209' };
      default:
        return { label: 'Desconhecido', color: theme.palette.grey.light, labelColor: '#000' };
    }
  };
  const { label, color, labelColor } = getChipProps(status);
  
  return <Chip label={label} sx={{backgroundColor: color, color: labelColor, borderRadius: 1, fontWeight: 400}} size="small" />;
};


export default ChipDeadLine;

