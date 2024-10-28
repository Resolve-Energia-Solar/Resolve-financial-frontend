const formatDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

export { formatDate, formatTime };
