const extractId = (fieldValue) => {
    if (Array.isArray(fieldValue)) {
      return fieldValue.map(item =>
        typeof item === 'object' && item !== null && 'value' in item ? item.value : item
      );
    }
    return typeof fieldValue === 'object' && fieldValue !== null && 'value' in fieldValue
      ? fieldValue.value
      : fieldValue;
  };


export default extractId;