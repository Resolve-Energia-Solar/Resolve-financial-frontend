'use client';
import React from 'react';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';
import { format, parseISO, isValid } from 'date-fns';

const FormDate = ({ label, value, onChange, error, helperText }) => {

  return (
    <div>
      <CustomFormLabel htmlFor="date">{label}</CustomFormLabel>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <DatePicker
          renderInput={(props) => (
            <CustomTextField
              {...props}
              fullWidth
              error={error}
              helperText={helperText}
            />
          )}
          value={value && isValid(parseISO(value)) ? parseISO(value) : null}
          onChange={(newValue) => {
            if (newValue && isValid(newValue)) {
              onChange(format(newValue, 'yyyy-MM-dd'));
            } else {
              onChange('');
            }
          }}
          inputFormat="dd/MM/yyyy"
        />

      </LocalizationProvider>
    </div>
  );
};

export default FormDate;
