const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return null;
  const [date, time] = dateTimeString.split('T');
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);
  return `${formattedDate} - ${formattedTime}`;
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-');
  if (day.includes('T')) {
    const [newDay, time] = day.split('T');
    return `${newDay}/${month}/${year}`;
  }
  return `${day}/${month}/${year}`;
};

const formatDateTime = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-');
  if (day.includes('T')) {
    const [newDay, time] = day.split('T');
    return `${newDay}/${month}/${year} às ${time.split('.')[0]}`;
  }
  return `${day}/${month}/${year} às ${dateString.split('T')[1].split('.')[0]}`;
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


export { formatDateTime, formatDate, formatTime, formatGetTime, formatTimeToSend };

