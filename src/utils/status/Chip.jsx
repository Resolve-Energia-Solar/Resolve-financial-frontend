import { Chip } from '@mui/material';
import PropTypes from 'prop-types';

const GenericChip = ({ status, statusMap }) => {
  const { label = 'Desconhecido', color = 'grey', icon = null } = statusMap[status] || {};

  return (
    <Chip
      label={label}
      sx={{ backgroundColor: color, color: '#fff' }}
      icon={icon}
    />
  );
};

Chip.propTypes = {
  status: PropTypes.string.isRequired,
  statusMap: PropTypes.object.isRequired,
};

export default GenericChip;
