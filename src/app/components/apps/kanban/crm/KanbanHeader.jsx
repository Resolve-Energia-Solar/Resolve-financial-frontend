'use client';
import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function KanbanHeader({ boards, selectedBoard, onBoardChange }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      <Box display="flex" alignItems="center" gap={2}>
        <FormControl variant="outlined">
          <InputLabel id="select-board-label">Selecionar Quadro</InputLabel>
          <Select
            labelId="select-board-label"
            value={selectedBoard}
            onChange={onBoardChange}
            label="Selecionar Quadro"
            sx={{
              minWidth: '200px',
              bgcolor: '#f0f0f0',
              borderRadius: '10px',
              '&:hover': {
                bgcolor: '#e0e0e0',
              },
            }}
          >
            {boards?.results && boards.results.length > 0 ? (
              boards.results.map((board) => (
                <MenuItem key={board.id} value={board.id}>
                  {board.title}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                Nenhum quadro disponível
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default KanbanHeader;
