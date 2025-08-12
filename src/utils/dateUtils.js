import { RemoveCircleOutline } from '@mui/icons-material';

export const formatDate = (dateString) => {
  if (!dateString) return <RemoveCircleOutline />;
  const date = new Date(dateString);
  const adjustedTime = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(adjustedTime).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Função específica para formatação brasileira de datas (DD/MM/AAAA)
export const formatDateBR = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const adjustedTime = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(adjustedTime).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Função para converter data do formato brasileiro para ISO
export const parseDateBR = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
