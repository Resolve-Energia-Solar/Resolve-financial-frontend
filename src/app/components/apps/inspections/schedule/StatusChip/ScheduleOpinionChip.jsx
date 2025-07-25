import { Chip } from "@mui/material";

export default function ScheduleOpinionChip({ status }) {
  if (!status) {
    return <Chip label="Pendente" color="default" />;
  }

  const lowerStatus = String(status).toLowerCase();
  let color = "default";
  if (["aprovado", "concluído", "entregue"].some(term => lowerStatus.includes(term))) {
    color = "success";
  } else if (["reprovado", "cancelado"].some(term => lowerStatus.includes(term))) {
    color = "error";
  } else if (["andamento", "agendado"].some(term => lowerStatus.includes(term))) {
    color = "info";
  } else if (["solicitado", "confirmado"].some(term => lowerStatus.includes(term))) {
    color = "primary";
  }

  return <Chip label={status} color={color} />;
}