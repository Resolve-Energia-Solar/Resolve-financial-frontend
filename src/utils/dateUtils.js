import { RemoveCircleOutline } from "@mui/icons-material";

export const formatDate = (dateString) => {
  if (!dateString) return <RemoveCircleOutline />;
  const date = new Date(dateString);
  const adjustedTime = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(adjustedTime).toLocaleDateString('pt-BR');
};
