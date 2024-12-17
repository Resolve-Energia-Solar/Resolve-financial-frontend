import { Box, InputAdornment, MenuItem, Select, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from "@mui/icons-material/Clear";
import KanbanColumn from './KanbanColumn';
import Loading from '@/app/loading';
import { useState } from 'react';

export default function KanbanBoard({ board, boards, handleChangeBoard, handleChangeSearchBoard }) {
    const [showClearIcon, setShowClearIcon] = useState("none");
    const handleClick = () => {
        // TODO: Clear the search input
        console.log("clicked the clear icon...");
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {board &&
                    <Select
                        sx={{ maxWidth: 220 }}
                        value={board.id}
                        label="Quadro"
                        onChange={handleChangeBoard}
                    >
                        {boards?.map(
                            (board) => <MenuItem key={board.id} value={board.id}>{board.title}</MenuItem>
                        )}

                    </Select>
                }
                <Box>
                    <TextField
                        size="small"
                        variant="outlined"
                        onChange={handleChangeSearchBoard}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    style={{ display: showClearIcon }}
                                    onClick={handleClick}
                                >
                                    <ClearIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', overflowX: 'auto', overflowY: 'hidden', boxShadow: '', maxHeight: 'calc(100vh - 100px)' }}>
                {
                    board ? board?.columns?.map(
                        (column => (
                            <KanbanColumn key={column.id} title={column.name} color={column.color} tasks={column.task} />
                        ))
                    ) : <Loading />
                }
            </Box>
        </Box>
    );
}
