'use client';
import React from 'react';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const FormDateRange = ({ label, value = [null, null], onChange, error, helperText }) => {
  const [startDate, endDate] = value;

  return (
    <div>
      <CustomFormLabel 
        htmlFor="date-range" 
        sx={{ display: 'block', paddingBottom: '10px' }}
      >
        {label}
      </CustomFormLabel>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <DateTimePicker
            label="Início"
            renderInput={(props) => (
              <CustomTextField
                {...props}
                fullWidth
                error={error}
                helperText={helperText}
              />
            )}
            value={startDate}
            onChange={(newValue) => {
              onChange([newValue, endDate]);
            }}
            inputFormat="dd/MM/yyyy HH:mm"
          /> 
          <span>-</span>
          <DateTimePicker
            label="Término"
            renderInput={(props) => (
              <CustomTextField
                {...props}
                fullWidth
                error={error}
                helperText={helperText}
              />
            )}
            value={endDate}
            onChange={(newValue) => {
              if (newValue >= startDate) {
                onChange([startDate, newValue]);
              } else {
                console.warn("A data de término não pode ser anterior à data de início");
              }
            }}
            inputFormat="dd/MM/yyyy HH:mm"
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default FormDateRange;
