import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function DynamicSelect({ options, onChange }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <NativeSelect
          defaultValue=""
          inputProps={{
            name: 'dynamic-options',
            id: 'dynamic-native-select',
          }}
          onChange={(e) => onChange(e.target.value)} // Dispara o callback com o valor selecionado
          sx={{
            '&::before': {
              borderBottom: 'none',
            },
            '&::after': {
              borderBottom: 'none',
            },
            '&:hover::before': {
              borderBottom: 'none',
            },
          }}
        >
          <option value="" disabled>
            Selecione um quadro
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </Box>
  );
}
