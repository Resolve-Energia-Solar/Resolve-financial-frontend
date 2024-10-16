const capitalizeFirstWord = (str) => {
  if (!str) return str;
  console.log('str:', str, 'after:', str.charAt(0).toUpperCase() + str.slice(1));
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default capitalizeFirstWord;
