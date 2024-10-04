'use client';
import React from 'react';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DateField from '@mui/x-date-pickers/DateField';

const FormDate = ({ label, value, onChange, error, helperText }) => {
  return (
    <div>
      <CustomFormLabel htmlFor="date">{label}</CustomFormLabel>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(props) => (
            <CustomTextField
              {...props}
              fullWidth
              error={error}
              helperText={helperText}
            />
          )}
          value={value}
          onChange={(newValue) => {
            onChange(newValue);
          }}
          inputFormat="dd/MM/yyyy HH:mm"
        />
      </LocalizationProvider>
    </div>
  );
};

export default FormDate;
