'use client'

import React, { useState } from 'react';
import { Box, Select, MenuItem, TextField, InputAdornment, Button } from '@mui/material';
import { Clear, Search, TableChart, Toc } from '@mui/icons-material';
function KanbanHeader({ boards, boardSelected, onBoardChange, searchTerm, onSearchChange, viewMode, onClickViewMode }) {

  const [showClearIcon, setShowClearIcon] = useState("none");

  return (

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
      <Box>
        {boards &&
          <Select
            sx={{ minWidth: 220 }}
            value={boardSelected}
            label="Quadro"
            onChange={onBoardChange}
          >
            {boards?.map(
              (board) => <MenuItem key={board.id} value={board.id}>{board.title}</MenuItem>
            )}

          </Select>
        }
      </Box>

      <Box display="flex" gap={2} alignItems="center">
        <Box>

          <Box>
            <Button onClick={onClickViewMode}>
              {viewMode === 'list' ? <Toc /> : <TableChart />}
            </Button>
          </Box>

        </Box>


        <Box>
          <TextField
            size="small"
            variant="outlined"
            onChange={onSearchChange}
            value={searchTerm}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ display: showClearIcon }}
                  onClick={onSearchChange}
                >
                  <Clear />
                </InputAdornment>
              )
            }}
          />
        </Box>

      </Box>
    </Box>

  );
}

export default KanbanHeader;
