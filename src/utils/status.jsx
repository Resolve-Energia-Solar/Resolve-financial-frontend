import { Chip } from '@mui/material';
import { Settings } from '@mui/icons-material';
import {
  HourglassEmptyIcon,
  CheckCircleIcon,
  CancelIcon
} from '@mui/icons-material';

function getSupplyTypeChip(type) {
  switch (type) {
    case 'M ':
      return <Chip label="Monofásico" color="info" icon={<Settings />} />;
    case 'B':
      return <Chip label="Bifásico" color="info" icon={<Settings />} />;
    case 'T':
      return <Chip label="Trifásico" color="info" icon={<Settings />} />;
    default:
      return <Chip label={type} />;
  }
};

function getStatusChip({status}) {

  console.log(status)
  switch (status) {
    case 'P':
      return <Chip label="Pendente" color="warning" icon={<HourglassEmptyIcon />} />;
    case 'CO':
      return <Chip label="Concluido" color="success" icon={<CheckCircleIcon />} />;
    case 'EA':
      return <Chip label="Em Andamento" color="primary" icon={<HourglassEmptyIcon />} />;
    case 'C':
      return <Chip label="Cancelado" color="error" icon={<CancelIcon />} />;
    case 'D':
      return <Chip label="Distrato" color="error" icon={<CancelIcon />} />;
    default:
      return <Chip label={status} />;
  }
};

export default { getSupplyTypeChip, getStatusChip };