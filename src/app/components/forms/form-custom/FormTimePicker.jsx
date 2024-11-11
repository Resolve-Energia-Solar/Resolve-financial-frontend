'use client';
import React from 'react'
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ptBR } from 'date-fns/locale';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const FormTimePicker = ({ label, value, onChange, error, helperText }) => {
    const [value2, setValue2] = React.useState(null);
    return (
        <div>
            <CustomFormLabel htmlFor="time">{label}</CustomFormLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <TimePicker
                    value={value}
                    onChange={(newValue) => {
                        console.log('Hora no picker ->',newValue);
                        onChange(newValue);
                    }}
                    inputFormat="HH:mm"
                    renderInput={(props) => (
                        <CustomTextField
                            {...props}
                            fullWidth
                            error={error}
                            helperText={error ? helperText : ''}
                            sx={{
                                '& .MuiSvgIcon-root': {
                                    width: '18px',
                                    height: '18px',
                                },
                                '& .MuiFormHelperText-root': {
                                    display: error ? 'block' : 'none',
                                },
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
        </div>
    )
}

export default FormTimePicker
