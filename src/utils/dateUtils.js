export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const adjustedTime = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(adjustedTime).toLocaleDateString('pt-BR');
  };
  