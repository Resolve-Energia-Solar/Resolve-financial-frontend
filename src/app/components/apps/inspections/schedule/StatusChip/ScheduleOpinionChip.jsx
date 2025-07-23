import { Chip } from "@mui/material";

export default function ScheduleOpinionChip({ status }) {
  if (!status) {
    return <Chip label="Pendente" color="default" />;
  }

  const lowerStatus = String(status).toLowerCase();
  let color = "default"; // Cor padrão
  if (["aprovado", "concluído", "entregue"].some(term => lowerStatus.includes(term))) {
    color = "success"; // Verde 🟢
  } else if (["reprovado", "cancelado"].some(term => lowerStatus.includes(term))) {
    color = "error"; // Vermelho 🔴
  } else if (["andamento", "agendado"].some(term => lowerStatus.includes(term))) {
    color = "info"; // Azul 🔵
  } else if (["solicitado", "confirmado"].some(term => lowerStatus.includes(term))) {
    color = "primary"; // Azul principal 🔵
  }

  return <Chip label={status} color={color} />;
}