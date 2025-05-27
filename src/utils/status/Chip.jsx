import { useTheme, Chip } from '@mui/material';
import PropTypes from 'prop-types';

const GenericChip = ({ status, statusMap }) => {
  const theme = useTheme();
  const { label = 'Desconhecido', color = '#fff', icon = null } = statusMap[status] || {};

  return (
    <Chip
      label={label}
      sx={{ backgroundColor: color, color: theme.palette.getContrastText(color) }}
      icon={icon}
    />
  );
};

Chip.propTypes = {
  status: PropTypes.string.isRequired,
  statusMap: PropTypes.object.isRequired,
};

export default GenericChip;
