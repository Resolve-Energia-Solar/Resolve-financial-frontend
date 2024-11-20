import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

const CustomFieldMoney = ({ value, onChange, error, helperText, ...props }) => {
  const formatToBRL = (value) => {
    if (isNaN(value) || value === null || value === undefined) {
      return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const [inputValue, setInputValue] = useState(formatToBRL(value));

  useEffect(() => {
    setInputValue(formatToBRL(value));
  }, [value]);

  const handleValueChange = (e) => {
    const rawInput = e.target.value;

    const sanitizedValue = rawInput.replace(/[R$\s.,]/g, '').trim();

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
