'use client';
import React from 'react';
import {
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    FormHelperText, // Importar FormHelperText
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

const FormSelect = ({ label, options, value, onChange, error, helperText, ...props }) => {
    return (
        <FormControl fullWidth variant="outlined" error={error} >
            <CustomFormLabel>{label}</CustomFormLabel>
            <Select
                value={value}
                onChange={onChange}
                label={label}
                {...props}
            >
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
