// CheckboxesTags.jsx
import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags({ options, label, placeholder, value, onChange }) {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={options}
      disableCloseOnSelect
      getOptionLabel={(option) => option.label}
      loadingText="Carregando..."
      noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
      onChange={(event, newValue) => {
        onChange(event, newValue);
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value} 
      renderOption={(props, option, { selected }) => {
        return (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        );
      }}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} fullWidth />
      )}
      value={value} 
    />
  );
}
