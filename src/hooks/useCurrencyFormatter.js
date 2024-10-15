import { useState, useEffect } from 'react';

export default function useCurrencyFormatter(initialValue) {
  const [formattedValue, setFormattedValue] = useState('');
  const [numericValue, setNumericValue] = useState('');

  const formatCurrency = (value) => {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleValueChange = (e, handleChange) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setNumericValue(rawValue); 
    const formatted = formatCurrency(rawValue / 100); 
    setFormattedValue(formatted);
    handleChange('totalValue', rawValue / 100);
  };

  useEffect(() => {
    if (initialValue !== undefined) {
      const rawValue = Number(initialValue).toFixed(2).replace('.', '');
      setNumericValue(rawValue);
      setFormattedValue(formatCurrency(rawValue / 100));
    }
  }, [initialValue]);

  return {
    formattedValue,
    numericValue,
    handleValueChange,
  };
}
