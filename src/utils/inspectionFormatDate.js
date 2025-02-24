const formatDate = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('-');
  if (parts.length < 3) {
    console.error("Invalid date format:", dateString);
    return null;
  }
  const [year, month, day] = parts;
  if (day.includes('T')) {
    const [newDay] = day.split('T');
    return `${newDay}/${month}/${year}`;
  }
  return `${day}/${month}/${year}`;
};


const formatDateTime = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('-');
  if (parts.length < 3) {
    console.error("Invalid date format:", dateString);
    return null;
  }
  const [year, month, day] = parts;
  if (day.includes('T')) {
    const [newDay, timePart] = day.split('T');
    if (!timePart) return null;
    return `${newDay}/${month}/${year} às ${timePart.split('.')[0]}`;
  }
  // This branch might still cause issues if dateString doesn't include 'T'
  const timeParts = dateString.split('T');
  if (timeParts.length < 2) return `${day}/${month}/${year}`;
  return `${day}/${month}/${year} às ${timeParts[1].split('.')[0]}`;
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
  return `${hours}:${minutes}:00`;
};

export { formatDateTime, formatDate, formatTime, formatGetTime, formatTimeToSend };
