import { Chip } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
  Build as BuildIcon,                   // Novo ícone para obras
  Schedule as ScheduleIcon,             // Novo ícone para agendamentos
  Lock as LockIcon                      // Novo ícone para bloqueios
} from '@mui/icons-material';

const ScheduleStatusChip = ({ status }) => {
  if (!status) {
    return <Chip label="Pendente" color="warning" icon={<HourglassEmptyIcon />} />;
  }

  const getChipProps = (status) => {
    switch (status) {
      // Status de sucesso (com variações)
      case 'Instalado':
      case 'Concluído':
      case 'Concluída':
      case 'Entregue':
      case 'Aprovado':
      case 'Aprovada':
        return { 
          label: status, 
          color: 'success', 
          icon: <CheckCircleIcon /> 
        };

      // Status de obra
      case 'Aprovado com Obra':
      case 'Aprovado com obra':
      case 'Aprovada com Obra':
        return { 
          label: status, 
          color: 'info', 
          icon: <BuildIcon /> 
        };
      
      case 'Em obra':
        return { 
          label: status, 
          color: 'warning', 
          icon: <BuildIcon /> 
        };

      // Status de agendamento
      case 'Confirmado':
      case 'confirmado':
      case 'Liberado':
        return { 
          label: status, 
          color: 'success', 
          icon: <CheckCircleIcon /> 
        };
      
      case 'Pendente':
      case 'pendente':
        return { 
          label: status, 
          color: 'warning', 
          icon: <HourglassEmptyIcon /> 
        };
      
      case 'Agendado':
        return { 
          label: status, 
          color: 'info', 
          icon: <ScheduleIcon /> 
        };

      // Status negativos
      case 'Cancelado':
      case 'cancelado':
        return { 
          label: status, 
          color: 'error', 
          icon: <CancelIcon /> 
        };
      
      case 'Bloqueado':
        return { 
          label: status, 
          color: 'error', 
          icon: <LockIcon /> 
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

export default ScheduleStatusChip;