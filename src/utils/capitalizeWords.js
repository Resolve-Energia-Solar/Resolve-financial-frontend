export const capitalizeWords = (str, minLength = 2) => {
    if (typeof str !== 'string') {
        return '';
    }
    return str.toLocaleLowerCase('pt-BR').replace(/\b[\p{L}]+\b/gu, (word) => {
      if (word.length <= minLength) {
        return word;
      }
      return word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1);
    });
  };
  