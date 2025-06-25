import { Cancel, CheckCircle, HourglassEmpty, Sync } from "@mui/icons-material";
import { Chip } from "@mui/material";


export default function MonitoringAppStatusChip({ status }) {
  const getChipProps = (status) => {
    switch (status) {
      case 'P':
        return { label: 'Pendente', color: 'warning', icon: <HourglassEmpty /> };
      case 'C':
        return { label: 'Criado', color: 'info', icon: <Sync /> };
      case 'E':
        return { label: 'Criado e Entregue', color: 'success', icon: <CheckCircle /> };
      case 'S':
        return { label: 'Cliente sem Internet', color: 'error', icon: <Cancel /> };
      default:
        return { label: status, color: 'default' };
    }
  };

  const { label, color, icon } = getChipProps(status);
  
  return <Chip label={label} color={color} icon={icon} />;
}