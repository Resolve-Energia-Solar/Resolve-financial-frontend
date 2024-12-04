import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const CustomFieldMoney = ({ value, onChange, error, helperText, ...props }) => {
  const formatToBRL = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const [inputValue, setInputValue] = useState(formatToBRL(value));

  const handleValueChange = (e) => {
    const inputValue = e.target.value;

    const sanitizedValue = inputValue.replace(/[R$,.]/g, '').trim();
    const parsedValue = parseFloat(sanitizedValue) / 100 || 0;

    setInputValue(formatToBRL(parsedValue));
    onChange(parsedValue);
  };

  return (
    <TextField
      value={inputValue}
      error={error}
      helperText={helperText}
      onChange={handleValueChange}
      {...props} 
    />
  );
};

export default CustomFieldMoney;
