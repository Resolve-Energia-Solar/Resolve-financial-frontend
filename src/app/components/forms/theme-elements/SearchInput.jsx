import React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  errorMessage,
}) {
  return (
    <div>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: "100%",
          boxShadow: errorMessage
            ? '0 0 5px 1px rgba(255, 0, 0, 0.3)' // Sombra vermelha discreta
            : '0 1px 3px rgba(0, 0, 0, 0.2)', // Sombra padrão
          border: errorMessage ? '1px solid rgba(255, 0, 0, 0.4)' : 'none', // Borda sutil para erro
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit(value);
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'search' }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      {errorMessage && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: 'block' }}
        >
          {errorMessage}
        </Typography>
      )}
    </div>
  );
}
