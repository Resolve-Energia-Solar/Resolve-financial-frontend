const formatDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const formatTime = (timeString) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

const formatGetTime = (timeString) => {
  if (!timeString) return null;
  const currentDate = new Date();
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const formattedTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    hours,
    minutes,
    seconds,
  );
  return formattedTime;
};

const formatTimeToSend = (timeString) => {
  if (!timeString) return null;
  const date = new Date(timeString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export { formatDate, formatTime, formatGetTime, formatTimeToSend };
