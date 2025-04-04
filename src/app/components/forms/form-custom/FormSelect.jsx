'use client';
import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';


const FormSelect = ({
  placeholder = 'Selecione...',
  options = [],
  value,
  onChange,
  error,
  helperText,
  label,
  sx,
  ...props
}) => {
  return (
    <FormControl fullWidth error={error}>
        {label && <CustomFormLabel style={{ marginBottom: '8px', display: 'block' }}>{label}</CustomFormLabel>}
      <Select
        displayEmpty
        value={value}
        onChange={onChange}
        sx={sx}
        {...props}
      >
        {/* Este MenuItem funciona como placeholder */}
        <MenuItem value="" disabled>
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

export default FormSelect;
