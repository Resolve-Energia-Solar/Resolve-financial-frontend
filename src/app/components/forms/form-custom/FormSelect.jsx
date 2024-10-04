'use client';
import React from 'react';
import {
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

const FormSelect = ({ label, options, value, onChange }) => {
    return (
        <FormControl fullWidth variant="outlined">
            <CustomFormLabel>{label}</CustomFormLabel>
            <Select
                value={value}
                onChange={onChange}
                label={label}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default FormSelect;
