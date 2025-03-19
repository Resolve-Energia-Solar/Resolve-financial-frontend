'use client';
import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText 
} from '@mui/material';

const SelectForm = ({
  label,
  placeholder = 'Selecione...',
  options = [],
  value,
  onChange,
  error = false,
  helperText = '',
  sx = {},
  ...props
}) => {
  return (
    <FormControl fullWidth error={error} sx={{ ...sx }}>
      {label && <InputLabel id="form-select-label">{label}</InputLabel>}
      <Select
        labelId="form-select-label"
        value={value}
        onChange={onChange}
        displayEmpty
        label={label || placeholder}
        {...props}
      >
        {/* Este MenuItem atua como placeholder */}
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectForm;
