import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function KanbanHeader({ boards, selectedBoard, onBoardChange, searchTerm, onSearchChange }) {
  const theme = useTheme();
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      <FormControl variant="outlined">
        <InputLabel id="select-board-label">Selecionar Quadro</InputLabel>
        <Select
          labelId="select-board-label"
          value={selectedBoard}
          onChange={onBoardChange}
          label="Selecionar Quadro"
          sx={{
            minWidth: '250px',
            bgcolor: theme.palette.background.paper,
            borderRadius: '10px',
            '&:hover': { bgcolor: theme.palette.action.hover },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.dark,
            },
          }}
        >
          {boards?.results?.map((board) => (
            <MenuItem key={board.id} value={board.id}>
              {board.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display="flex" alignItems="center" ml="auto">
        <TextField
          placeholder="Buscar Lead"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: '400px',
            bgcolor: theme.palette.background.paper,
            borderRadius: '40px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '40px',
              paddingRight: '10px',
              '& fieldset': { borderColor: theme.palette.grey[300] },
              '&:hover fieldset': { borderColor: theme.palette.primary.light },
              '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default KanbanHeader;
