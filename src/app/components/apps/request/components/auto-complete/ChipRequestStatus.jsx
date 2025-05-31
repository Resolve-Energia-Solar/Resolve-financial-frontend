import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Error as ErrorIcon,
  Block as BlockIcon,              
  Send as SendIcon,                
  DoNotDisturb as DoNotDisturbIcon,
} from '@mui/icons-material';

const ChipRequestStatus = ({ status }) => {
  const getChipProps = (status) => {
    switch (status) {
      // Status de solicitação em andamento
      case 'Pendente':
        return { 
          label: 'Pendente', 
          color: 'warning', 
          icon: <HourglassEmptyIcon /> 
        };
      
      // Status de solicitação enviada
      case 'Solicitada':
      case 'Solicitado':
        return { 
          label: status, 
          color: 'info', 
          icon: <SendIcon /> 
        };
      
      // Status negativos/rejeição
      case 'Indeferido':
      case 'Indeferida':
      case 'Bloqueado':
      case 'Bloqueada':
        return { 
          label: status, 
          color: 'error', 
          icon: <BlockIcon /> 
        };
      
      // Status positivos/aprovação
      case 'Deferido':
      case 'Deferida':
        return { 
          label: status, 
          color: 'success', 
          icon: <CheckCircleIcon /> 
        };
      
      // Status neutro/não aplicável
      case 'Não se aplica':
        return { 
          label: 'Não se aplica', 
          color: 'default', 
          icon: <DoNotDisturbIcon /> 
        };
      
      default:
        return { 
          label: status, 
          color: 'default' 
        };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
};

export default ChipRequestStatus;