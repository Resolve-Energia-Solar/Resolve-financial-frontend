import { Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Build as BuildIcon } from '@mui/icons-material';

const ProductChip = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      case "S":
        return { label: 'Padrão', color: 'primary', icon: <CheckCircleIcon /> };
      case "N":
        return { label: 'Customizado', color: 'secondary', icon: <BuildIcon /> };
      default:
        return { label: status };
    }
  };

  const { label, color, icon } = getChipProps(status);

  return <Chip label={label} color={color} icon={icon} />;
};

export default ProductChip;

