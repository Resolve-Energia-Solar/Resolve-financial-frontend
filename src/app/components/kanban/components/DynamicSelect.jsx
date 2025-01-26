import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function DynamicSelect({ options, onChange, value, onAdd }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Box sx={{ position: 'relative' }}>
          <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            displayEmpty
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            sx={{
              paddingRight: '50px',
              '& .MuiSelect-icon': {
                display: 'none',
              },
            }}
          >
            <MenuItem value="" disabled>
              Selecione um quadro
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {onAdd && (
            <IconButton
              onClick={onAdd}
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                right: '36px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                marginRight: '5px',
              }}
            >
              <AddIcon />
            </IconButton>
          )}
          <IconButton
            onClick={handleOpen}
            size="small"
            sx={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          >
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
      </FormControl>
    </Box>
  );
}
